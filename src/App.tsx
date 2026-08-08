import { useEffect, useMemo, useRef, useState } from 'react';
import type { Difficulty } from './types';
import { usePersistentSet, usePersistentFlag } from './lib/storage';
import { dailyPick, todayLabel } from './lib/daily';
import {
  useHadiths,
  searchHadiths,
  hadithId,
  type Hadith as HadithType,
} from './lib/hadith';
import DifficultyBar from './components/DifficultyBar';
import HadithCard from './components/HadithCard';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Ranking from './components/Ranking';
import Listen from './components/Listen';
import Hadith, { type HadithCardProps } from './components/Hadith';
import Profile from './components/Profile';
import GlobalSearch from './components/GlobalSearch';
import TapToExplain from './components/TapToExplain';
import { useScreenTime } from './lib/screenTime';
import { usePoints } from './lib/points';

type View =
  | 'today'
  | 'feed'
  | 'saved'
  | 'ranking'
  | 'listen'
  | 'hadith'
  | 'profile';

/** Views that render hadith and therefore need the collection loaded first. */
const DATA_VIEWS: View[] = ['today', 'feed', 'saved', 'listen', 'hadith'];

export default function App() {
  const [view, setView] = useState<View>('feed');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>(
    'all'
  );
  const [query, setQuery] = useState('');

  // Global faceted search (top-right icon, every screen).
  const [searchOpen, setSearchOpen] = useState(false);
  // A hadith to focus when navigating to the Hadith section from search.
  const [focusHadith, setFocusHadith] = useState<number | null>(null);

  // Bookmarked hadith (persisted by hadith number as a string id).
  const saves = usePersistentSet('ilm.saved');

  const [loggedIn, setLoggedIn] = usePersistentFlag('ilm.loggedIn');
  const [onboarded, setOnboarded] = usePersistentFlag('ilm.onboarded');

  // Track the current user's on-screen time only once the feed is reached.
  const screenMs = useScreenTime(loggedIn && onboarded);
  // Difficulty-weighted knowledge points earned by reading hadith.
  const { points, readCount, hasRead, awardRead } = usePoints();

  // The whole app is built on the Riyad us-Salihin collection — load it up
  // front (the fetch is memoised, so it happens at most once).
  const { collection, hadiths, loading, error } = useHadiths();

  const resetApp = () => {
    setOnboarded(false);
    setLoggedIn(false);
    setView('feed');
  };

  // ── Derived hadith lists ──
  const q = query.trim();
  const searched = useMemo(
    () => (q ? searchHadiths(hadiths, q) : hadiths),
    [hadiths, q]
  );
  const feedHadiths = useMemo(
    () =>
      activeDifficulty === 'all'
        ? searched
        : searched.filter((h) => h.difficulty === activeDifficulty),
    [searched, activeDifficulty]
  );
  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { all: searched.length };
    for (const h of searched) {
      counts[h.difficulty] = (counts[h.difficulty] ?? 0) + 1;
    }
    return counts;
  }, [searched]);

  const todayHadith = useMemo(() => dailyPick(hadiths), [hadiths]);

  const savedHadiths = useMemo(
    () => hadiths.filter((h) => saves.has(hadithId(h))),
    [hadiths, saves.ids] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Per-hadith save + read-tracking props, shared by every hadith surface.
  const hadithProps = (h: HadithType): HadithCardProps => ({
    saved: saves.has(hadithId(h)),
    onToggleSave: saves.toggle,
    read: hasRead(hadithId(h)),
    onRead: () => awardRead(hadithId(h), h.difficulty),
  });

  // ── Stage gating (localStorage-backed) ──
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />;

  const needsData = DATA_VIEWS.includes(view);

  return (
    <div className="flex h-[100dvh] flex-col bg-emerald-900 text-white">
      {/* ── Header ── */}
      <header className="shrink-0 bg-gradient-to-b from-emerald-950 to-emerald-900 px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold leading-tight">Ilm</h1>
            <p className="text-[11px] text-white/60">
              1 minute of Islamic knowledge, daily
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* Global search entry point — present on every screen */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              title="Search hadith"
              data-testid="global-search-button"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg ring-1 ring-white/15 transition hover:bg-white/20"
            >
              <span aria-hidden>🔍</span>
            </button>
            {/* Knowledge points (profile area) */}
            <button
              type="button"
              onClick={() => setView('ranking')}
              aria-label={`${points} knowledge points from ${readCount} hadith read — view ranking`}
              title={`${points} knowledge points · ${readCount} hadith read`}
              className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-right ring-1 ring-white/15 transition hover:bg-white/20"
            >
              <span className="flex items-baseline gap-1">
                <span aria-hidden className="text-amber-300">
                  ★
                </span>
                <span
                  data-testid="points-total"
                  className="text-sm font-bold text-white"
                >
                  {points.toLocaleString()}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                  pts
                </span>
              </span>
            </button>
          </div>
        </div>
        <nav className="no-scrollbar mt-3 flex gap-1 overflow-x-auto rounded-full bg-white/10 p-1 text-xs font-semibold">
          {(
            [
              ['today', 'Today'],
              ['feed', 'Feed'],
              ['hadith', 'Hadith'],
              ['saved', `Saved${saves.count ? ` (${saves.count})` : ''}`],
              ['ranking', 'Ranking'],
              ['listen', 'Listen'],
              ['profile', 'Profile'],
            ] as Array<[View, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={
                'shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 transition ' +
                (view === key
                  ? 'bg-white text-emerald-900'
                  : 'text-white/70 hover:text-white')
              }
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Search + filters only relevant to the feed */}
        {view === 'feed' && (
          <>
            {/* Free-text search box */}
            <div className="relative mt-3">
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-emerald-950/50"
              >
                🔍
              </span>
              <input
                type="search"
                inputMode="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hadith — English, Arabic, reference…"
                aria-label="Search hadith"
                className="w-full rounded-full bg-white/90 py-2 pl-9 pr-9 text-sm text-emerald-950 placeholder:text-emerald-950/40 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-amber-300"
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

            {/* Difficulty-level chips */}
            <div className="pt-2">
              <DifficultyBar
                active={activeDifficulty}
                onSelect={setActiveDifficulty}
                counts={difficultyCounts}
              />
            </div>
          </>
        )}
      </header>

      {/* ── Content ── */}
      <main className="min-h-0 flex-1">
        {needsData && error ? (
          <LoadError message={error} />
        ) : needsData && loading ? (
          <Loading />
        ) : (
          <>
            {view === 'today' && <TodayView />}
            {view === 'feed' && (
              <HadithFeed
                hadiths={feedHadiths}
                cardProps={hadithProps}
                hasActiveFilters={!!q || activeDifficulty !== 'all'}
                query={q}
                onClearFilters={() => {
                  setQuery('');
                  setActiveDifficulty('all');
                }}
              />
            )}
            {view === 'hadith' && collection && (
              <Hadith
                hadiths={hadiths}
                collectionMeta={collection}
                cardProps={hadithProps}
                focusHadithNumber={focusHadith}
              />
            )}
            {view === 'saved' && <SavedView />}
            {view === 'ranking' && (
              <Ranking youMs={screenMs} youPoints={points} />
            )}
            {view === 'listen' && <Listen hadiths={hadiths} />}
            {view === 'profile' && (
              <Profile points={points} screenMs={screenMs} />
            )}
          </>
        )}
      </main>

      {/* ── Global faceted search overlay (reachable from every screen) ── */}
      {searchOpen && (
        <GlobalSearch
          hadiths={hadiths}
          onClose={() => setSearchOpen(false)}
          onOpenHadith={(n) => {
            setSearchOpen(false);
            setFocusHadith(n);
            setView('hadith');
          }}
        />
      )}

      {/* ── Tap-to-explain: selection bubble + explanation/related panel ──
          Mounted at the root so it works across the feed, saved, today, and the
          hadith browse section. Related items reuse the same keyword matching
          as the global search. */}
      <TapToExplain
        hadiths={hadiths}
        onOpenHadith={(n) => {
          setSearchOpen(false);
          setFocusHadith(n);
          setView('hadith');
        }}
      />
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
          <h2 className="mt-1 text-2xl font-bold">Your 1-minute hadith</h2>
          <p className="mt-1 text-sm text-white/60">
            A single narration from Riyad us-Salihin, chosen for today.
          </p>
        </div>
        {todayHadith ? (
          <div className="px-1 py-4">
            <HadithCard hadith={todayHadith} showBook {...hadithProps(todayHadith)} />
          </div>
        ) : (
          <p className="p-8 text-center text-white/70">No hadith available.</p>
        )}
      </div>
    );
  }

  function SavedView() {
    if (savedHadiths.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <span className="text-4xl" aria-hidden>
            🔖
          </span>
          <p className="mt-3 font-semibold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-white/60">
            Tap “Save” on any hadith and it will appear here.
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
      <div className="h-full space-y-4 overflow-y-auto px-1 py-4">
        {savedHadiths.map((h) => (
          <HadithCard key={h.hadithNumber} hadith={h} showBook {...hadithProps(h)} />
        ))}
        <div className="pb-6 pt-2 text-center">
          <ResetLink onReset={resetApp} />
        </div>
      </div>
    );
  }
}

// ── Feed (top-level so pagination + scroll survive App re-renders) ──

const FEED_PAGE = 20;

function HadithFeed({
  hadiths,
  cardProps,
  hasActiveFilters,
  query,
  onClearFilters,
}: {
  hadiths: HadithType[];
  cardProps: (h: HadithType) => HadithCardProps;
  hasActiveFilters: boolean;
  query: string;
  onClearFilters: () => void;
}) {
  const [visible, setVisible] = useState(FEED_PAGE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset the window whenever the filtered list changes (new search/filter).
  useEffect(() => {
    setVisible(FEED_PAGE);
  }, [hadiths]);

  // Grow the window as the sentinel scrolls into view (lazy pagination over the
  // full 1,896-hadith collection).
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((v) => Math.min(v + FEED_PAGE, hadiths.length));
        }
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hadiths.length]);

  if (hadiths.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <span className="text-3xl" aria-hidden>
          🔍
        </span>
        <p className="mt-3 font-semibold">No hadith match</p>
        <p className="mt-1 text-sm text-white/60">
          {query
            ? `Nothing found for “${query}”. Try another word or clear the filters.`
            : 'Try a different difficulty level.'}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-900"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  const shown = hadiths.slice(0, visible);
  return (
    <div className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto scroll-smooth">
      {shown.map((h) => (
        <HadithCard key={h.hadithNumber} hadith={h} fill showBook {...cardProps(h)} />
      ))}
      {visible < hadiths.length && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-8 text-sm text-white/50"
        >
          <span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            aria-hidden
          />
          Loading more hadith…
        </div>
      )}
    </div>
  );
}

// ── Loading / error states for the hadith-backed views ──

function Loading() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"
        aria-hidden
      />
      <p className="mt-4 font-semibold">Loading Riyad us-Salihin…</p>
      <p className="mt-1 text-sm text-white/60">
        1,896 hadith · sourced from sunnah.com
      </p>
    </div>
  );
}

function LoadError({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <span className="text-3xl" aria-hidden>
        ⚠
      </span>
      <p className="mt-3 font-semibold">Could not load the collection</p>
      <p className="mt-1 text-sm text-white/60">{message}</p>
    </div>
  );
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
