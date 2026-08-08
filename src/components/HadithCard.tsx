import { useEffect, useRef } from 'react';
import ShareMenu from './ShareMenu';
import { snippet } from '../lib/share';
import { DIFFICULTY_LABEL, DIFFICULTY_BADGE } from '../types';
import { hadithId, type Hadith } from '../lib/hadith';

interface Props {
  hadith: Hadith;
  /** Show the book badge (used in search results / feed where context helps). */
  showBook?: boolean;
  /** Amber ring highlight (used when a hadith is focused from search). */
  highlighted?: boolean;
  /** When true the card fills the snap-viewport height (feed mode). */
  fill?: boolean;
  /** Whether this hadith is bookmarked. */
  saved?: boolean;
  /** Toggle the bookmark for this hadith (by its stable id). */
  onToggleSave?: (id: string) => void;
  /** Whether this hadith has already been read (awards its points once). */
  read?: boolean;
  /** Called once when the hadith is first "read" (scrolled into view). */
  onRead?: () => void;
}

/**
 * A single Riyad us-Salihin hadith rendered in the app's sand/emerald card
 * language. Reused by the daily pick (Today), the feed, the Saved list, and the
 * book → chapter browse section. Carries save/bookmark + first-view read
 * tracking (for difficulty-weighted knowledge points), a share action, a link
 * back to sunnah.com, and a neutral "grading not verified" note. The Arabic +
 * English region is marked explainable for tap-to-explain.
 */
export default function HadithCard({
  hadith,
  showBook = false,
  highlighted = false,
  fill = false,
  saved = false,
  onToggleSave,
  read = false,
  onRead,
}: Props) {
  const id = hadithId(hadith);

  // Award points the first time the card scrolls substantially into view.
  const ref = useRef<HTMLElement | null>(null);
  const firedRef = useRef(false);
  useEffect(() => {
    if (!onRead) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            onRead();
            io.disconnect();
          }
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onRead]);

  return (
    <article
      ref={ref}
      id={`hadith-${hadith.hadithNumber}`}
      className={
        (fill ? 'min-h-[calc(100dvh-8.5rem)] snap-start flex items-center justify-center px-4 py-4 ' : '') +
        (fill ? '' : 'mx-auto max-w-md ')
      }
    >
      <div
        className={
          'w-full max-w-md overflow-hidden rounded-3xl bg-sand-50 shadow-xl shadow-emerald-950/20 ring-1 transition ' +
          (highlighted ? 'ring-4 ring-amber-300' : 'ring-black/5')
        }
      >
        {/* Header: reference badge (+ book when requested) + difficulty */}
        <div className="flex flex-wrap items-center gap-1.5 px-5 pt-5">
          <span className="inline-flex items-center rounded-full bg-emerald-800/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
            {hadith.reference}
          </span>
          {showBook && (
            <span className="inline-flex items-center rounded-full bg-amber-200/70 px-3 py-1 text-xs font-semibold text-emerald-950">
              {hadith.book.name}
            </span>
          )}
          <span
            data-difficulty={hadith.difficulty}
            className={
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ' +
              DIFFICULTY_BADGE[hadith.difficulty]
            }
          >
            {DIFFICULTY_LABEL[hadith.difficulty]}
          </span>
          {read && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-emerald-800 px-2.5 py-1 text-[10px] font-semibold text-white"
              title="You've read this — points awarded"
            >
              ✓ Read
            </span>
          )}
        </div>

        {/* Body */}
        <div className="px-5 pb-3 pt-4">
          {/* Arabic + English marked explainable — highlighting either offers the
              tap-to-explain bubble (see components/TapToExplain.tsx). */}
          <div data-explain-source="hadith" data-explain-id={id}>
            <p className="arabic text-right text-2xl leading-loose text-emerald-900">
              {hadith.arabic}
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
              {hadith.narrator && (
                <span className="font-medium text-emerald-800">{hadith.narrator} </span>
              )}
              {hadith.english}
            </p>
          </div>

          <p className="mt-4 text-xs font-medium leading-relaxed text-emerald-800/70">
            {hadith.reference} · {hadith.book.name} · {hadith.chapter.name}
          </p>

          {/* Grading is NOT authoritative — the upstream blanket "Sahih" is unverified. */}
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-900/90 ring-1 ring-amber-200">
            <span className="font-semibold">Grading not verified here.</span>{' '}
            Confirm the authentication on sunnah.com before relying on it.
          </p>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2 border-t border-sand-200 px-4 py-3">
          {onToggleSave && (
            <button
              type="button"
              aria-pressed={saved}
              aria-label={saved ? 'Remove bookmark' : 'Save'}
              data-testid="hadith-save"
              onClick={() => onToggleSave(id)}
              className={
                'flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition ' +
                (saved
                  ? 'bg-emerald-800 text-white'
                  : 'text-ink/60 hover:bg-sand-100')
              }
            >
              <span aria-hidden>{saved ? '🔖' : '📑'}</span>
              {saved ? 'Saved' : 'Save'}
            </button>
          )}
          <a
            href={hadith.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-sm font-semibold text-ink/60 transition hover:bg-sand-100"
          >
            sunnah.com
            <span aria-hidden>↗</span>
          </a>
          <ShareMenu
            text={snippet(`${hadith.reference} — ${hadith.english}`)}
          />
        </div>
      </div>
    </article>
  );
}
