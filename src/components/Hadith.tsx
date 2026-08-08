import { useEffect, useMemo, useState } from 'react';
import DifficultyBar from './DifficultyBar';
import HadithCard from './HadithCard';
import type { Difficulty } from '../types';
import {
  groupBooks,
  groupChapters,
  searchHadiths,
  type Hadith as HadithType,
} from '../lib/hadith';

/** Per-hadith save + read-tracking props supplied by App. */
export interface HadithCardProps {
  saved: boolean;
  onToggleSave: (id: string) => void;
  read: boolean;
  onRead: () => void;
}

/**
 * Browsable + searchable Riyad us-Salihin section.
 *
 * The collection is loaded once by App and passed in. Hadith are browsed in
 * their own book → chapter → hadith hierarchy, or found via full-text search.
 * Grading is NEVER shown as authoritative — every card carries a neutral
 * "grading not verified here" note.
 */
export default function Hadith({
  hadiths,
  collectionMeta,
  cardProps,
  focusHadithNumber = null,
}: {
  hadiths: HadithType[];
  collectionMeta: { collection: string; collectionArabic: string; author: string; totalHadiths: number };
  cardProps: (h: HadithType) => HadithCardProps;
  /** When set (e.g. from the global search), open and scroll to this hadith. */
  focusHadithNumber?: number | null;
}) {
  const [query, setQuery] = useState('');
  const [book, setBook] = useState<number | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [highlight, setHighlight] = useState<number | null>(null);

  // When asked to focus a specific hadith (from the global search), open its
  // book → chapter and clear any active query so the ChapterView renders it.
  useEffect(() => {
    if (focusHadithNumber == null) return;
    const h = hadiths.find((x) => x.hadithNumber === focusHadithNumber);
    if (!h) return;
    setQuery('');
    setDifficulty('all');
    setBook(h.book.number);
    setChapter(h.chapter.number);
    setHighlight(focusHadithNumber);
  }, [hadiths, focusHadithNumber]);

  // Scroll the focused hadith into view once its chapter is rendered, then
  // fade the highlight out.
  useEffect(() => {
    if (highlight == null || chapter == null) return;
    const el = document.getElementById(`hadith-${highlight}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const t = window.setTimeout(() => setHighlight(null), 2600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlight, chapter, book]);

  const q = query.trim();

  const byDifficulty = (list: HadithType[]) =>
    difficulty === 'all'
      ? list
      : list.filter((h) => h.difficulty === difficulty);

  const searchResults = useMemo(
    () => (q ? byDifficulty(searchHadiths(hadiths, q)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hadiths, q, difficulty]
  );
  const books = useMemo(() => groupBooks(hadiths), [hadiths]);
  const chapters = useMemo(
    () => (book !== null ? groupChapters(hadiths, book) : []),
    [hadiths, book]
  );
  const chapterHadiths = useMemo(
    () =>
      book !== null && chapter !== null
        ? byDifficulty(
            hadiths.filter(
              (h) => h.book.number === book && h.chapter.number === chapter
            )
          )
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hadiths, book, chapter, difficulty]
  );

  const currentBook = books.find((b) => b.number === book);
  const currentChapter = chapters.find((c) => c.number === chapter);

  return (
    <div className="flex h-full flex-col">
      {/* ── Search + attribution ── */}
      <div className="shrink-0 px-4 pt-3">
        <div className="relative">
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
            placeholder="Search Arabic, English or reference…"
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
        <p className="mt-2 text-[11px] leading-snug text-white/50">
          {collectionMeta.collection} ({collectionMeta.collectionArabic}) by{' '}
          {collectionMeta.author} · {collectionMeta.totalHadiths.toLocaleString()} hadith,
          sourced from sunnah.com
        </p>
        {/* Difficulty filter — narrows the hadith shown (search results and
            chapter view) by reading level. */}
        <div className="mt-2">
          <DifficultyBar active={difficulty} onSelect={setDifficulty} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {q ? (
          <SearchResults
            results={searchResults}
            total={hadiths.length}
            query={q}
            cardProps={cardProps}
          />
        ) : chapter !== null && currentBook && currentChapter ? (
          <ChapterView
            bookName={currentBook.name}
            chapter={currentChapter}
            hadiths={chapterHadiths}
            highlight={highlight}
            cardProps={cardProps}
            onBack={() => setChapter(null)}
            onBooks={() => {
              setBook(null);
              setChapter(null);
            }}
          />
        ) : book !== null && currentBook ? (
          <ChapterList
            book={currentBook}
            chapters={chapters}
            onOpen={(n) => setChapter(n)}
            onBack={() => setBook(null)}
          />
        ) : (
          <BookList books={books} onOpen={(n) => setBook(n)} />
        )}
      </div>
    </div>
  );
}

// ── Book list ──

function BookList({
  books,
  onOpen,
}: {
  books: ReturnType<typeof groupBooks>;
  onOpen: (n: number) => void;
}) {
  return (
    <>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">
        {books.length} books
      </p>
      <ul className="space-y-2">
        {books.map((b) => (
          <li key={b.number}>
            <button
              type="button"
              onClick={() => onOpen(b.number)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-left transition hover:bg-white/15"
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold">{b.name}</span>
                <span className="mt-0.5 block text-xs text-white/50">
                  {b.chapterCount} chapters · {b.hadithCount} hadith
                </span>
              </span>
              <span aria-hidden className="shrink-0 text-white/40">
                ›
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

// ── Chapter list ──

function ChapterList({
  book,
  chapters,
  onOpen,
  onBack,
}: {
  book: ReturnType<typeof groupBooks>[number];
  chapters: ReturnType<typeof groupChapters>;
  onOpen: (n: number) => void;
  onBack: () => void;
}) {
  return (
    <>
      <Breadcrumb items={[{ label: 'Books', onClick: onBack }, { label: book.name }]} />
      <p className="mb-2 mt-1 text-xs font-semibold uppercase tracking-widest text-white/50">
        {chapters.length} chapters
      </p>
      <ul className="space-y-2">
        {chapters.map((c) => (
          <li key={c.number}>
            <button
              type="button"
              onClick={() => onOpen(c.number)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-left transition hover:bg-white/15"
            >
              <span className="min-w-0">
                <span className="block font-medium leading-snug">{c.name}</span>
                <span className="mt-0.5 block text-xs text-white/50">
                  {c.hadithCount} hadith
                </span>
              </span>
              <span aria-hidden className="shrink-0 text-white/40">
                ›
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

// ── Chapter (hadith list) ──

function ChapterView({
  bookName,
  chapter,
  hadiths,
  highlight = null,
  cardProps,
  onBack,
  onBooks,
}: {
  bookName: string;
  chapter: ReturnType<typeof groupChapters>[number];
  hadiths: HadithType[];
  highlight?: number | null;
  cardProps: (h: HadithType) => HadithCardProps;
  onBack: () => void;
  onBooks: () => void;
}) {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Books', onClick: onBooks },
          { label: bookName, onClick: onBack },
          { label: chapter.name },
        ]}
      />
      <p className="mb-3 mt-1 text-xs font-semibold uppercase tracking-widest text-white/50">
        {hadiths.length} hadith
      </p>
      <div className="space-y-4">
        {hadiths.map((h) => (
          <HadithCard
            key={h.hadithNumber}
            hadith={h}
            highlighted={highlight === h.hadithNumber}
            {...cardProps(h)}
          />
        ))}
      </div>
    </>
  );
}

// ── Search results ──

function SearchResults({
  results,
  total,
  query,
  cardProps,
}: {
  results: HadithType[];
  total: number;
  query: string;
  cardProps: (h: HadithType) => HadithCardProps;
}) {
  return (
    <>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
        {results.length.toLocaleString()} of {total.toLocaleString()} match “
        {query}”
      </p>
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
          <span className="text-3xl" aria-hidden>
            🔍
          </span>
          <p className="mt-3 font-semibold">No hadith found</p>
          <p className="mt-1 text-sm text-white/60">
            Try another word, or clear the search to browse by book.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((h) => (
            <HadithCard key={h.hadithNumber} hadith={h} showBook {...cardProps(h)} />
          ))}
        </div>
      )}
    </>
  );
}

// ── Breadcrumb ──

function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; onClick?: () => void }>;
}) {
  return (
    <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-white/60">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.onClick ? (
            <button
              type="button"
              onClick={item.onClick}
              className="rounded font-semibold text-white/80 underline-offset-2 hover:text-white hover:underline"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-white/50">{item.label}</span>
          )}
          {i < items.length - 1 && (
            <span aria-hidden className="text-white/30">
              ›
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
