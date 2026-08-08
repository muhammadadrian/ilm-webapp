/**
 * Lazy loader + types for the Riyad us-Salihin hadith collection.
 *
 * The full collection (1896 hadith, ~2.6 MB) is a STATIC asset served from
 * `public/data/riyadussalihin.json`. It is deliberately NOT imported into the
 * JS bundle — it is fetched on demand the first time the Hadith section opens,
 * so the initial app load stays fast. The fetch respects Vite's configured
 * `base` (`/ilm-webapp/`) via `import.meta.env.BASE_URL`.
 *
 * Content is sourced from sunnah.com (via a GitHub mirror). The upstream data
 * stamps every record grade="Sahih" with an empty graded_by — that is a blanket
 * scraper default, NOT verified per-hadith grading, so grading is never shown
 * as authoritative anywhere in the UI.
 */

export interface Hadith {
  hadithNumber: number;
  book: { number: number; name: string };
  chapter: { number: number; name: string };
  arabic: string;
  english: string;
  narrator: string;
  reference: string; // e.g. "Riyad as-Salihin 1"
  sourceUrl: string; // sunnah.com permalink
}

export interface HadithCollection {
  collection: string;
  collectionArabic: string;
  author: string;
  totalHadiths: number;
  source: string;
  hadiths: Hadith[];
}

let cache: HadithCollection | null = null;
let inFlight: Promise<HadithCollection> | null = null;

/**
 * Fetch (and memoise) the full collection. Safe to call repeatedly — the
 * network request happens at most once per page load.
 */
export function loadCollection(): Promise<HadithCollection> {
  if (cache) return Promise.resolve(cache);
  if (inFlight) return inFlight;

  const url = `${import.meta.env.BASE_URL}data/riyadussalihin.json`;
  inFlight = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load hadith collection (${res.status})`);
      return res.json() as Promise<HadithCollection>;
    })
    .then((data) => {
      cache = data;
      inFlight = null;
      return data;
    })
    .catch((err) => {
      inFlight = null;
      throw err;
    });

  return inFlight;
}

/** Distinct books in collection order. */
export interface BookGroup {
  number: number;
  name: string;
  chapterCount: number;
  hadithCount: number;
}

export function groupBooks(hadiths: Hadith[]): BookGroup[] {
  const order: number[] = [];
  const map = new Map<number, { name: string; chapters: Set<number>; count: number }>();
  for (const h of hadiths) {
    let entry = map.get(h.book.number);
    if (!entry) {
      entry = { name: h.book.name, chapters: new Set(), count: 0 };
      map.set(h.book.number, entry);
      order.push(h.book.number);
    }
    entry.chapters.add(h.chapter.number);
    entry.count += 1;
  }
  return order.map((n) => {
    const e = map.get(n)!;
    return { number: n, name: e.name, chapterCount: e.chapters.size, hadithCount: e.count };
  });
}

export interface ChapterGroup {
  number: number;
  name: string;
  hadithCount: number;
}

export function groupChapters(hadiths: Hadith[], bookNumber: number): ChapterGroup[] {
  const order: number[] = [];
  const map = new Map<number, { name: string; count: number }>();
  for (const h of hadiths) {
    if (h.book.number !== bookNumber) continue;
    let entry = map.get(h.chapter.number);
    if (!entry) {
      entry = { name: h.chapter.name, count: 0 };
      map.set(h.chapter.number, entry);
      order.push(h.chapter.number);
    }
    entry.count += 1;
  }
  return order.map((n) => {
    const e = map.get(n)!;
    return { number: n, name: e.name, hadithCount: e.count };
  });
}

/** Case-insensitive search across Arabic, English, and reference. */
export function searchHadiths(hadiths: Hadith[], query: string): Hadith[] {
  const q = query.trim().toLowerCase();
  if (!q) return hadiths;
  return hadiths.filter(
    (h) =>
      h.english.toLowerCase().includes(q) ||
      h.reference.toLowerCase().includes(q) ||
      h.arabic.includes(query.trim())
  );
}
