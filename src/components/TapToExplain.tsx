import { useCallback, useEffect, useRef, useState } from 'react';
import { DIFFICULTY_LABEL, DIFFICULTY_BADGE } from '../types';
import type { Hadith } from '../lib/hadith';
import {
  explainPassage,
  findRelated,
  excerpt,
  type ExplainResult,
  type ExplainContext,
  type RelatedItem,
} from '../lib/explain';

/**
 * Tap-to-explain overlay.
 *
 * Watches the browser Selection API for text highlighted inside any element
 * marked `data-explain-source="hadith"` (the hadith English/Arabic region — see
 * HadithCard.tsx). When a passage is selected it floats a small "Explain this
 * passage" bubble near the selection; tapping it opens a panel with (1) a
 * clearly-labelled DEMO explanation and (2) a REAL list of related hadith. The
 * panel navigates to a tapped hadith via the callback passed from App.
 *
 * Mounted once at the App root so it works across the feed, saved, today, and
 * the hadith browse section.
 */

interface Props {
  hadiths: Hadith[];
  onOpenHadith: (hadithNumber: number) => void;
}

/** Minimum trimmed selection length before the bubble is offered. */
const MIN_SELECTION = 4;

/** The hadith number the selection sits inside. */
interface SourceRef {
  hadithNumber: number;
}

interface BubbleState {
  x: number;
  y: number;
  text: string;
  source: SourceRef;
}

interface PanelState {
  passage: string;
  source: SourceRef;
}

/** Read the current selection, but only if it sits inside an explainable host. */
function readSelection(): { text: string; source: SourceRef; rect: DOMRect } | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
  const text = sel.toString().replace(/\s+/g, ' ').trim();
  if (text.length < MIN_SELECTION) return null;

  const range = sel.getRangeAt(0);
  const node = range.commonAncestorContainer;
  const el =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as Element)
      : node.parentElement;
  const host = el?.closest('[data-explain-source="hadith"]') as HTMLElement | null;
  if (!host) return null;

  const id = host.getAttribute('data-explain-id');
  const n = id ? Number(id) : NaN;
  if (!Number.isFinite(n)) return null;

  const rect = range.getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) return null;

  return { text, source: { hadithNumber: n }, rect };
}

const BUBBLE_HEIGHT = 44;

export default function TapToExplain({ hadiths, onOpenHadith }: Props) {
  const [bubble, setBubble] = useState<BubbleState | null>(null);
  const [panel, setPanel] = useState<PanelState | null>(null);
  const panelOpenRef = useRef(false);
  panelOpenRef.current = panel !== null;

  const refresh = useCallback(() => {
    // Freeze the bubble while the panel is open.
    if (panelOpenRef.current) return;
    const info = readSelection();
    if (!info) {
      setBubble(null);
      return;
    }
    const { rect, text, source } = info;
    const cx = rect.left + rect.width / 2;
    let y = rect.top - BUBBLE_HEIGHT - 8;
    if (y < 8) y = rect.bottom + 8; // flip below if there is no room above
    const x = Math.min(Math.max(cx, 72), window.innerWidth - 72);
    setBubble({ x, y, text, source });
  }, []);

  // Selection lifecycle listeners. `selectionchange` is debounced with a short
  // timeout because it fires rapidly during a drag; `mouseup`/`touchend` catch
  // the end of a drag immediately (and are what Playwright can dispatch).
  useEffect(() => {
    let t: number | undefined;
    const debounced = () => {
      window.clearTimeout(t);
      t = window.setTimeout(refresh, 60);
    };
    const immediate = () => {
      window.clearTimeout(t);
      refresh();
    };
    const dismiss = () => {
      if (!panelOpenRef.current) setBubble(null);
    };

    document.addEventListener('selectionchange', debounced);
    document.addEventListener('mouseup', immediate);
    document.addEventListener('touchend', immediate);
    // Any scroll should retract the bubble (its anchor has moved).
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('resize', dismiss);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('selectionchange', debounced);
      document.removeEventListener('mouseup', immediate);
      document.removeEventListener('touchend', immediate);
      window.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('resize', dismiss);
    };
  }, [refresh]);

  const openPanel = () => {
    if (!bubble) return;
    setPanel({ passage: bubble.text, source: bubble.source });
    setBubble(null);
    // Collapse the native selection so the OS selection menu doesn't linger.
    window.getSelection()?.removeAllRanges();
  };

  return (
    <>
      {bubble && (
        <button
          type="button"
          data-testid="explain-bubble"
          onMouseDown={(e) => e.preventDefault()} // keep the selection alive
          onClick={openPanel}
          style={{ left: bubble.x, top: bubble.y }}
          className="fixed z-[80] -translate-x-1/2 rounded-full bg-emerald-800 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 ring-1 ring-amber-300/60 transition hover:bg-emerald-700"
        >
          <span aria-hidden className="mr-1.5">💡</span>
          Explain this passage
        </button>
      )}

      {panel && (
        <ExplainPanel
          passage={panel.passage}
          source={panel.source}
          hadiths={hadiths}
          onClose={() => setPanel(null)}
          onOpenHadith={(n) => {
            setPanel(null);
            onOpenHadith(n);
          }}
        />
      )}
    </>
  );
}

// ── Explanation + related panel (bottom sheet) ──

function ExplainPanel({
  passage,
  source,
  hadiths,
  onClose,
  onOpenHadith,
}: {
  passage: string;
  source: SourceRef;
  hadiths: Hadith[];
  onClose: () => void;
  onOpenHadith: (hadithNumber: number) => void;
}) {
  const [explanation, setExplanation] = useState<ExplainResult | null>(null);
  const [related, setRelated] = useState<RelatedItem[] | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    let alive = true;

    const src = hadiths.find((h) => h.hadithNumber === source.hadithNumber);

    // Explanation (demo now; real backend later — see lib/explain.ts seam).
    const ctx: ExplainContext = { reference: src?.reference };
    explainPassage(passage, ctx).then((r) => {
      if (alive) setExplanation(r);
    });

    // Related — REAL, via the shared keyword system.
    if (src) {
      setRelated(
        findRelated({ passage, source: { kind: 'hadith', hadith: src }, hadiths })
      );
    } else {
      setRelated([]);
    }

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col justify-end bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Explain this passage"
      data-testid="explain-panel"
      onClick={onClose}
    >
      <div
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl bg-emerald-900 text-white shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grabber + header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-emerald-950 to-emerald-900 px-5 pb-3 pt-3">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/25" />
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Explain this passage</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-testid="explain-close"
              className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/15 transition hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-5 px-5 pb-8 pt-4">
          {/* Selected passage */}
          <section>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/50">
              Selected passage
            </p>
            <blockquote
              data-testid="explain-passage"
              className="rounded-2xl bg-white/10 px-4 py-3 text-[15px] italic leading-relaxed text-white/90 ring-1 ring-white/10"
            >
              “{passage}”
            </blockquote>
          </section>

          {/* Explanation (DEMO) */}
          <section data-testid="explain-demo">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                AI explanation
              </p>
              <span className="inline-flex items-center rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-950">
                Demo
              </span>
            </div>

            <div className="rounded-2xl bg-amber-100 px-4 py-3 text-amber-950 ring-1 ring-amber-300">
              <p className="text-[12px] font-semibold leading-snug">
                ⚠ This is a placeholder, not a real AI answer and not a scholarly
                ruling.
              </p>
              <p className="mt-1 text-[12px] leading-snug text-amber-900">
                Real explanations need a model connected via the backend (this
                static app ships no API key). The text below is generic on
                purpose — it invents no hadith, tafsir, or scholar attributions.
              </p>
            </div>

            {explanation ? (
              <div className="mt-3 space-y-3">
                <p className="text-[15px] leading-relaxed text-white/85">
                  {explanation.plain}
                </p>
                <div className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-amber-200/80">
                    Practical application · demo
                  </p>
                  <p className="text-[14px] leading-relaxed text-white/80">
                    {explanation.application}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/50">Preparing explanation…</p>
            )}
          </section>

          {/* Related (REAL) */}
          <section data-testid="explain-related">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                Related in Ilm
              </p>
              <span className="inline-flex items-center rounded-full bg-emerald-600/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-50 ring-1 ring-emerald-300/30">
                Real
              </span>
            </div>

            {related && related.length > 0 ? (
              <ul className="space-y-2">
                {related.map((item) => (
                  <RelatedRow
                    key={`h-${item.hadith.hadithNumber}`}
                    item={item}
                    onOpenHadith={onOpenHadith}
                  />
                ))}
              </ul>
            ) : related ? (
              <p className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/60 ring-1 ring-white/10">
                No closely related hadith found for this selection. Try
                highlighting a longer, more distinctive phrase.
              </p>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/60">
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden
                />
                Finding related hadith…
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// ── Related item row ──

function RelatedRow({
  item,
  onOpenHadith,
}: {
  item: RelatedItem;
  onOpenHadith: (hadithNumber: number) => void;
}) {
  const h = item.hadith;
  return (
    <li>
      <button
        type="button"
        data-testid="explain-related-item"
        onClick={() => onOpenHadith(h.hadithNumber)}
        className="flex w-full flex-col gap-1.5 rounded-2xl bg-white/10 px-4 py-3 text-left ring-1 ring-white/10 transition hover:bg-white/15"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-amber-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-50 ring-1 ring-amber-300/30">
            Hadith
          </span>
          <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
            {h.reference}
          </span>
          <span
            className={
              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ' +
              DIFFICULTY_BADGE[h.difficulty]
            }
          >
            {DIFFICULTY_LABEL[h.difficulty]}
          </span>
        </div>
        <p className="text-[13px] leading-snug text-white/80">
          {h.narrator && (
            <span className="font-semibold text-emerald-200">{h.narrator} </span>
          )}
          {excerpt(h.english, 120)}
        </p>
        <p className="text-[11px] font-medium text-emerald-200/70">
          {h.book.name} · {h.chapter.name}
        </p>
        <RelatedReasons reasons={item.reasons} />
      </button>
    </li>
  );
}

function RelatedReasons({ reasons }: { reasons: string[] }) {
  if (reasons.length === 0) return null;
  return (
    <div className="mt-0.5 flex flex-wrap gap-1.5">
      {reasons.map((r, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-full bg-emerald-950/40 px-2 py-0.5 text-[10px] font-medium text-emerald-100/80 ring-1 ring-white/10"
        >
          {r}
        </span>
      ))}
    </div>
  );
}
