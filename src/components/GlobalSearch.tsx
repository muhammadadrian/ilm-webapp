import { useEffect, useMemo, useRef, useState } from 'react';
import { DIFFICULTY_LABEL, DIFFICULTY_BADGE } from '../types';
import type { Hadith } from '../lib/hadith';
import {
  FACETS,
  EMOTIONS,
  LIFE_ISSUES,
  matchHadith,
  isActiveSearch,
  excerpt,
  type Facet,
} from '../lib/search';

interface Props {
  hadiths: Hadith[];
  onClose: () => void;
  onOpenHadith: (hadithNumber: number) => void;
}

/** How many results to render at once (the count line still shows the total). */
const RENDER_CAP = 60;

/**
 * Full-screen, global faceted search overlay. Reachable from the top-right icon
 * on every screen. Searches the 1,896 Riyad us-Salihin hadith. See lib/search.ts
 * for the facet/emotion/life-issue keyword mappings.
 */
export default function GlobalSearch({ hadiths, onClose, onOpenHadith }: Props) {
  const [facet, setFacet] = useState<Facet>('all');
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus the search box on open, and close on Escape.
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const active = isActiveSearch(facet, query, selection);

  const results = useMemo(
    () => (active ? matchHadith(hadiths, facet, query, selection) : []),
    [hadiths, facet, query, selection, active]
  );

  // Reset the chip selection whenever the facet changes.
  const chooseFacet = (f: Facet) => {
    setFacet(f);
    setSelection(null);
  };

  const totalCount = results.length;
  const showChips = facet === 'emotion' || facet === 'life';
  const facetMeta = FACETS.find((f) => f.key === facet)!;

  const placeholder =
    facet === 'scholar'
      ? 'Narrator, e.g. Abu Hurairah, Umar…'
      : facet === 'quran'
        ? 'Reference like 2:255, or words from a verse…'
        : facet === 'emotion' || facet === 'life'
          ? 'Optional: add a word to narrow…'
          : 'Search 1,896 hadith…';

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-emerald-950/95 backdrop-blur-sm text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
      data-testid="global-search-overlay"
    >
      {/* ── Header: input + close ── */}
      <div className="shrink-0 bg-gradient-to-b from-emerald-950 to-emerald-900 px-4 pb-3 pt-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-emerald-950/50"
            >
              🔍
            </span>
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="Global search"
              data-testid="global-search-input"
              className="w-full rounded-full bg-white/95 py-2.5 pl-9 pr-9 text-sm text-emerald-950 placeholder:text-emerald-950/40 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-amber-300"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full px-1.5 text-emerald-950/50 hover:text-emerald-950"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            data-testid="global-search-close"
            className="shrink-0 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold ring-1 ring-white/15 transition hover:bg-white/20"
          >
            Close
          </button>
        </div>

        {/* ── Facet tabs ── */}
        <div
          className="no-scrollbar mt-3 flex gap-1 overflow-x-auto rounded-full bg-white/10 p-1 text-xs font-semibold"
          role="tablist"
          aria-label="Search mode"
        >
          {FACETS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={facet === f.key}
              data-testid={`facet-${f.key}`}
              onClick={() => chooseFacet(f.key)}
              className={
                'shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 transition ' +
                (facet === f.key
                  ? 'bg-white text-emerald-900'
                  : 'text-white/70 hover:text-white')
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Facet-specific chips ── */}
        {showChips && (
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
            {facet === 'emotion' &&
              EMOTIONS.map((e) => (
                <Chip
                  key={e.key}
                  active={selection === e.key}
                  onClick={() => setSelection(selection === e.key ? null : e.key)}
                  testid={`emotion-${e.key}`}
                >
                  <span aria-hidden className="mr-1">
                    {e.emoji}
                  </span>
                  {e.label}
                </Chip>
              ))}
            {facet === 'life' &&
              LIFE_ISSUES.map((l) => (
                <Chip
                  key={l.key}
                  active={selection === l.key}
                  onClick={() => setSelection(selection === l.key ? null : l.key)}
                  testid={`life-${l.key}`}
                >
                  <span aria-hidden className="mr-1">
                    {l.emoji}
                  </span>
                  {l.label}
                </Chip>
              ))}
          </div>
        )}

        {/* ── Hint / result count line ── */}
        <p className="mt-2 text-[11px] leading-snug text-white/50" data-testid="search-status">
          {!active ? (
            facetMeta.hint
          ) : (
            <>
              <span className="font-semibold text-white/80" data-testid="result-count">
                {totalCount.toLocaleString()}
              </span>{' '}
              hadith result{totalCount === 1 ? '' : 's'}
            </>
          )}
        </p>
      </div>

      {/* ── Results ── */}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-3" data-testid="search-results">
        {!active ? (
          <EmptyPrompt facet={facet} />
        ) : (
          <>
            {results.slice(0, RENDER_CAP).map((h) => (
              <HadithResultRow
                key={h.hadithNumber}
                hadith={h}
                onClick={() => onOpenHadith(h.hadithNumber)}
              />
            ))}
            {results.length > RENDER_CAP && (
              <p className="mb-3 mt-1 text-center text-xs text-white/40">
                Showing first {RENDER_CAP} of {results.length.toLocaleString()} hadith —
                refine your search to see more.
              </p>
            )}

            {/* Nothing matched */}
            {totalCount === 0 && (
              <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                <span className="text-3xl" aria-hidden>
                  🔍
                </span>
                <p className="mt-3 font-semibold">No matches</p>
                <p className="mt-1 text-sm text-white/60">
                  Try another word, switch the facet, or clear your filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Facet chip ──

function Chip({
  active,
  onClick,
  children,
  testid,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  testid?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-testid={testid}
      className={
        'whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ' +
        (active
          ? 'bg-amber-200 text-emerald-950 shadow'
          : 'bg-white/10 text-white/80 ring-1 ring-white/15 hover:bg-white/20')
      }
    >
      {children}
    </button>
  );
}

// ── Empty-state prompt (before an active search) ──

function EmptyPrompt({ facet }: { facet: Facet }) {
  const meta = FACETS.find((f) => f.key === facet)!;
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <span className="text-4xl" aria-hidden>
        {facet === 'emotion' ? '💭' : facet === 'quran' ? '📖' : facet === 'scholar' ? '🧕' : '🔍'}
      </span>
      <p className="mt-3 font-semibold">{meta.label} search</p>
      <p className="mt-1 max-w-xs text-sm text-white/60">{meta.hint}</p>
    </div>
  );
}

// ── Hadith result row ──

function HadithResultRow({ hadith, onClick }: { hadith: Hadith; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="result-hadith"
      className="mb-2 flex w-full flex-col gap-1.5 rounded-2xl bg-white/10 px-4 py-3 text-left ring-1 ring-white/10 transition hover:bg-white/15"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-full bg-amber-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-50 ring-1 ring-amber-300/30">
          Hadith
        </span>
        <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
          {hadith.reference}
        </span>
        <span
          className={
            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ' +
            DIFFICULTY_BADGE[hadith.difficulty]
          }
        >
          {DIFFICULTY_LABEL[hadith.difficulty]}
        </span>
      </div>
      <p className="text-[13px] leading-snug text-white/80">
        {hadith.narrator && <span className="font-semibold text-emerald-200">{hadith.narrator} </span>}
        {excerpt(hadith.english)}
      </p>
      <p className="text-[11px] font-medium text-emerald-200/70">
        {hadith.book.name} · {hadith.chapter.name}
      </p>
    </button>
  );
}
