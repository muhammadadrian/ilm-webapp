import { useEffect, useRef } from 'react';
import type { Card } from '../types';
import { CATEGORY_LABEL, THEME_LABEL, DIFFICULTY_LABEL, DIFFICULTY_BADGE } from '../types';
import ShareMenu from './ShareMenu';
import { snippet } from '../lib/share';

interface Props {
  card: Card;
  saved: boolean;
  liked: boolean;
  onToggleSave: (id: string) => void;
  onToggleLike: (id: string) => void;
  /** When true the card fills the snap-viewport height (feed mode). */
  fill?: boolean;
  /** Called once when the card is first "read" (scrolled into view). */
  onRead?: () => void;
  /** Whether this card has already been read (awards its points once). */
  read?: boolean;
}

export default function InsightCard({
  card,
  saved,
  liked,
  onToggleSave,
  onToggleLike,
  fill = false,
  onRead,
  read = false,
}: Props) {
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
      className={
        (fill
          ? 'min-h-[calc(100dvh-8.5rem)] snap-start '
          : '') +
        'flex items-center justify-center px-4 py-4'
      }
    >
      <div className="w-full max-w-md rounded-3xl bg-sand-50 shadow-xl shadow-emerald-950/20 ring-1 ring-black/5 overflow-hidden">
        {/* Header row: category badge + review tag */}
        <div className="flex items-center justify-between gap-2 px-5 pt-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-emerald-800/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {CATEGORY_LABEL[card.category]}
            </span>
            {card.theme !== 'general' && (
              <span className="inline-flex items-center rounded-full bg-amber-200/70 px-3 py-1 text-xs font-semibold text-emerald-950">
                {THEME_LABEL[card.theme]}
              </span>
            )}
            <span
              data-difficulty={card.difficulty}
              className={
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ' +
                DIFFICULTY_BADGE[card.difficulty]
              }
            >
              {DIFFICULTY_LABEL[card.difficulty]}
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
          {card.needsReview && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-300"
              title={card.sourceNote}
            >
              ⚠ Placeholder — needs scholarly review
            </span>
          )}
        </div>

        {/* Body */}
        <div className="px-5 pb-3 pt-4">
          <h2 className="text-xl font-bold leading-snug text-ink">{card.title}</h2>

          {card.arabic && (
            <p className="arabic mt-4 text-right text-2xl leading-loose text-emerald-900">
              {card.arabic}
            </p>
          )}

          {card.transliteration && (
            <p className="mt-2 text-sm italic text-emerald-800/80">
              {card.transliteration}
            </p>
          )}

          {card.translation && (
            <p className="mt-1 text-[15px] font-medium text-ink/80">
              “{card.translation}”
            </p>
          )}

          <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{card.body}</p>

          {(card.reference || card.attribution) && (
            <p className="mt-3 text-xs font-medium text-emerald-800/70">
              {card.reference}
              {card.reference && card.attribution ? ' · ' : ''}
              {card.attribution}
            </p>
          )}

          {/* Per-card review note */}
          {card.needsReview && (
            <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-900/90 ring-1 ring-amber-200">
              <span className="font-semibold">Needs review:</span> {card.sourceNote}
            </p>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2 border-t border-sand-200 px-4 py-3">
          <button
            type="button"
            aria-pressed={liked}
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => onToggleLike(card.id)}
            className={
              'flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition ' +
              (liked
                ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                : 'text-ink/60 hover:bg-sand-100')
            }
          >
            <span aria-hidden>{liked ? '❤️' : '🤍'}</span>
            {liked ? 'Liked' : 'Like'}
          </button>
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? 'Remove bookmark' : 'Save'}
            onClick={() => onToggleSave(card.id)}
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
          <ShareMenu
            text={snippet(
              `${card.title} — ${card.translation ?? card.body}`
            )}
          />
        </div>
      </div>
    </article>
  );
}
