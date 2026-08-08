import { useEffect, useMemo, useState } from 'react';
import {
  loadCollection,
  groupBooks,
  groupChapters,
  searchHadiths,
  type Hadith as HadithType,
  type HadithCollection,
} from '../lib/hadith';

/**
 * Browsable + searchable Riyad us-Salihin section.
 *
 * The 1896 hadith live here in their own book → chapter → hadith hierarchy
 * (kept out of the curated daily feed so they don't swamp the short cards).
 * The collection is lazy-fetched from a static asset the first time this
 * component mounts. Grading is NEVER shown as authoritative — every card
 * carries a neutral "grading not verified here" note.
 */
export default function Hadith() {
  const [data, setData] = useState<HadithCollection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [book, setBook] = useState<number | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    loadCollection()
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      alive = false;
    };
  }, []);

  const hadiths = data?.hadiths ?? [];
  const q = query.trim();

  const searchResults = useMemo(
    () => (q ? searchHadiths(hadiths, q) : []),
    [hadiths, q]
  );
  const books = useMemo(() => groupBooks(hadiths), [hadiths]);
  const chapters = useMemo(
    () => (book !== null ? groupChapters(hadiths, book) : []),
    [hadiths, book]
  );
  const chapterHadiths = useMemo(
    () =>
      book !== null && chapter !== null
        ? hadiths.filter(
            (h) => h.book.number === book && h.chapter.number === chapter
          )
        : [],
    [hadiths, book, chapter]
  );

  const currentBook = books.find((b) => b.number === book);
  const currentChapter = chapters.find((c) => c.number === chapter);

  // ── Loading / error states ──
  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <span className="text-3xl" aria-hidden>
          ⚠
        </span>
        <p className="mt-3 font-semibold">Could not load the collection</p>
        <p className="mt-1 text-sm text-white/60">{error}</p>
      </div>
    );
  }

  if (!data) {
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
          {data.collection} ({data.collectionArabic}) by {data.author} ·{' '}
          {data.totalHadiths.toLocaleString()} hadith, sourced from sunnah.com
        </p>
      </div>

      {/* ── Body ── */}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {q ? (
          <SearchResults
            results={searchResults}
            total={hadiths.length}
            query={q}
          />
        ) : chapter !== null && currentBook && currentChapter ? (
          <ChapterView
            bookName={currentBook.name}
            chapter={currentChapter}
            hadiths={chapterHadiths}
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
  onBack,
  onBooks,
}: {
  bookName: string;
  chapter: ReturnType<typeof groupChapters>[number];
  hadiths: HadithType[];
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
          <HadithCard key={h.hadithNumber} hadith={h} />
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
}: {
  results: HadithType[];
  total: number;
  query: string;
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
            <HadithCard key={h.hadithNumber} hadith={h} showBook />
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

// ── Hadith card (matches the app's sand/emerald card language) ──

function HadithCard({
  hadith,
  showBook = false,
}: {
  hadith: HadithType;
  showBook?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-3xl bg-sand-50 shadow-xl shadow-emerald-950/20 ring-1 ring-black/5">
      {/* Header: reference badge (+ book/chapter when in search results) */}
      <div className="flex flex-wrap items-center gap-1.5 px-5 pt-5">
        <span className="inline-flex items-center rounded-full bg-emerald-800/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
          {hadith.reference}
        </span>
        {showBook && (
          <span className="inline-flex items-center rounded-full bg-amber-200/70 px-3 py-1 text-xs font-semibold text-emerald-950">
            {hadith.book.name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-5 pb-3 pt-4">
        <p className="arabic text-right text-2xl leading-loose text-emerald-900">
          {hadith.arabic}
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
          {hadith.narrator && (
            <span className="font-medium text-emerald-800">
              {hadith.narrator}{' '}
            </span>
          )}
          {hadith.english}
        </p>

        <p className="mt-4 text-xs font-medium leading-relaxed text-emerald-800/70">
          {hadith.reference} · {hadith.book.name} · {hadith.chapter.name}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={hadith.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 underline-offset-2 hover:underline"
          >
            View on sunnah.com
            <span aria-hidden>↗</span>
          </a>
        </div>

        {/* Grading is NOT authoritative — the upstream blanket "Sahih" is unverified. */}
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-900/90 ring-1 ring-amber-200">
          <span className="font-semibold">Grading not verified here.</span>{' '}
          Confirm the authentication on sunnah.com before relying on it.
        </p>
      </div>
    </article>
  );
}
