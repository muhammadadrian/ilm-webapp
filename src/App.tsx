import { useMemo, useState } from 'react';
import { SEED_CARDS } from './data/seed';
import type { Category } from './types';
import { usePersistentSet, usePersistentFlag } from './lib/storage';
import { dailyPick, todayLabel } from './lib/daily';
import InsightCard from './components/InsightCard';
import CategoryBar from './components/CategoryBar';
import Login from './components/Login';
import Onboarding from './components/Onboarding';

type View = 'today' | 'feed' | 'saved';

export default function App() {
  const [view, setView] = useState<View>('feed');
  const [active, setActive] = useState<Category | 'all'>('all');

  const saves = usePersistentSet('ilm.saved');
  const likes = usePersistentSet('ilm.liked');
  const [verifyOpen, setVerifyOpen] = useState(false);

  const [loggedIn, setLoggedIn] = usePersistentFlag('ilm.loggedIn');
  const [onboarded, setOnboarded] = usePersistentFlag('ilm.onboarded');

  const resetApp = () => {
    setOnboarded(false);
    setLoggedIn(false);
    setView('feed');
  };

  const pick = useMemo(() => dailyPick(SEED_CARDS), []);

  const feedCards = useMemo(() => {
    if (active === 'all') return SEED_CARDS;
    return SEED_CARDS.filter((c) => c.category === active);
  }, [active]);

  const savedCards = useMemo(
    () => SEED_CARDS.filter((c) => saves.ids.includes(c.id)),
    [saves.ids]
  );

  const cardProps = (id: string) => ({
    saved: saves.has(id),
    liked: likes.has(id),
    onToggleSave: saves.toggle,
    onToggleLike: likes.toggle,
  });

  // ── Stage gating (localStorage-backed) ──
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />;

  return (
    <div className="flex h-[100dvh] flex-col bg-emerald-900 text-white">
      {/* ── Header ── */}
      <header className="shrink-0 bg-gradient-to-b from-emerald-950 to-emerald-900 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold leading-tight">Ilm</h1>
            <p className="text-[11px] text-white/60">
              1 minute of Islamic knowledge, daily
            </p>
          </div>
          <nav className="flex gap-1 rounded-full bg-white/10 p-1 text-xs font-semibold">
            {(
              [
                ['today', 'Today'],
                ['feed', 'Feed'],
                ['saved', `Saved${saves.count ? ` (${saves.count})` : ''}`],
              ] as Array<[View, string]>
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                aria-pressed={view === key}
                className={
                  'rounded-full px-3 py-1.5 transition ' +
                  (view === key
                    ? 'bg-white text-emerald-900'
                    : 'text-white/70 hover:text-white')
                }
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Category chips only relevant to the feed */}
        {view === 'feed' && (
          <CategoryBar active={active} onSelect={setActive} />
        )}
      </header>

      {/* ── Persistent placeholder-content banner ── */}
      <div className="flex shrink-0 items-center gap-2 bg-amber-100 px-4 py-2 text-[11px] leading-snug text-amber-900">
        <span aria-hidden className="self-start pt-px">
          ⚠
        </span>
        <p className="flex-1">
          <span className="font-bold">Placeholder / demo content.</span> None of
          these cards are scholarly-verified. Every entry must be reviewed and
          sourced by a qualified person before use.
        </p>
        <button
          type="button"
          onClick={() => setVerifyOpen(true)}
          className="shrink-0 rounded-md bg-amber-900 px-2.5 py-1 font-semibold text-amber-50 hover:bg-amber-800"
        >
          Verify Now
        </button>
      </div>

      {/* ── Verification modal ── */}
      {verifyOpen && <VerifyModal onClose={() => setVerifyOpen(false)} />}

      {/* ── Content ── */}
      <main className="min-h-0 flex-1">
        {view === 'today' && <TodayView />}
        {view === 'feed' && (
          <FeedView key={active} />
        )}
        {view === 'saved' && <SavedView />}
      </main>
    </div>
  );

  // ── Views (declared as closures so they share state/handlers) ──

  function TodayView() {
    return (
      <div className="h-full overflow-y-auto">
        <div className="px-4 pt-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Today · {todayLabel()}
          </p>
          <h2 className="mt-1 text-2xl font-bold">Your 1-minute pick</h2>
          <p className="mt-1 text-sm text-white/60">
            A single insight, chosen for today.
          </p>
        </div>
        {pick ? (
          <InsightCard card={pick} {...cardProps(pick.id)} />
        ) : (
          <p className="p-8 text-center text-white/70">No content available.</p>
        )}
      </div>
    );
  }

  function FeedView() {
    if (feedCards.length === 0) {
      return (
        <p className="p-8 text-center text-white/70">
          No cards in this category yet.
        </p>
      );
    }
    return (
      <div className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto scroll-smooth">
        {feedCards.map((card) => (
          <InsightCard key={card.id} card={card} fill {...cardProps(card.id)} />
        ))}
      </div>
    );
  }

  function SavedView() {
    if (savedCards.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <span className="text-4xl" aria-hidden>
            🔖
          </span>
          <p className="mt-3 font-semibold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-white/60">
            Tap “Save” on any card and it will appear here.
          </p>
          <button
            type="button"
            onClick={() => setView('feed')}
            className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-900"
          >
            Browse the feed
          </button>
          <ResetLink onReset={resetApp} />
        </div>
      );
    }
    return (
      <div className="h-full overflow-y-auto py-2">
        {savedCards.map((card) => (
          <InsightCard key={card.id} card={card} {...cardProps(card.id)} />
        ))}
        <div className="pb-6 pt-2 text-center">
          <ResetLink onReset={resetApp} />
        </div>
      </div>
    );
  }
}

// ── Reset link (re-runs the login → onboarding flow for demos) ──

function ResetLink({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="mt-5 text-xs font-medium text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
    >
      Reset app (replay login &amp; onboarding)
    </button>
  );
}

// ── Verification modal ──

function VerifyModal({ onClose }: { onClose: () => void }) {
  const items: Array<[string, string]> = [
    [
      'Quran / Tafsir',
      'Confirm the ayah reference and replace explanations with a cited scholarly tafsir (e.g. Ibn Kathir, Tabari).',
    ],
    [
      'Hadith',
      'Replace with a sourced, authenticated narration including collection and grading.',
    ],
    [
      'Scholar quotes',
      'Supply a verifiable source and correct attribution.',
    ],
    [
      'Fiqh',
      'Confirm rulings and note the madhhab; rulings differ.',
    ],
    [
      'Duas / Aqidah / Adab / Seerah / Vocab / Reflections',
      'Verify wording, Arabic, and translation.',
    ],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-title"
    >
      <div
        className="my-auto w-full max-w-md rounded-2xl bg-stone-50 text-stone-800 shadow-xl ring-1 ring-emerald-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 px-5 pb-3 pt-4">
          <div>
            <h2 id="verify-title" className="text-lg font-bold text-emerald-900">
              Verify this content
            </h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Review before anything is shared or relied upon.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 shrink-0 rounded-full p-1.5 text-stone-500 hover:bg-stone-200 hover:text-stone-800"
          >
            <span aria-hidden className="block text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-stone-700">
            Every card in this app is{' '}
            <span className="font-semibold">placeholder demo content</span>. Before
            any of it is used, shared, or relied upon, it must be reviewed and
            sourced by a qualified person. Here is what to check for each type of
            content:
          </p>

          <ul className="mt-4 space-y-3">
            {items.map(([label, detail]) => (
              <li
                key={label}
                className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5"
              >
                <p className="text-sm font-semibold text-emerald-900">{label}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-stone-600">
                  {detail}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-4 rounded-xl bg-amber-100 px-3.5 py-2.5 text-[12px] leading-snug text-amber-900">
            This review workflow is itself a placeholder — real verification
            tooling can be wired up later.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-stone-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
