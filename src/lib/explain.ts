/**
 * Tap-to-explain logic — the pure, UI-free core behind the "Explain this
 * passage" feature. Two independent concerns live here:
 *
 *   1. explainPassage()  — the EXPLANATION half. There is deliberately NO model
 *      / API key in this static client (shipping one would be insecure), so
 *      this returns an honest, clearly-labelled DEMO placeholder. It is written
 *      as an async function around a single seam (see the TODO in
 *      `explainPassage`) so a real server-side model call can drop straight in
 *      later without touching any component. The placeholder NEVER fabricates
 *      hadith, tafsir, or scholar attributions and NEVER asserts a ruling.
 *
 *   2. findRelated()     — the REAL half. Given the selected passage plus the
 *      card/hadith it came from, it surfaces genuinely related items from the
 *      app using the SAME tagging + keyword system as global search: it reuses
 *      cardHaystack/hadithHaystack from lib/search.ts and scores candidates on
 *      shared theme, shared content-type, and keyword overlap.
 */

import type { Card, Category, Theme } from '../types';
import { THEME_LABEL, CATEGORY_LABEL } from '../types';
import type { Hadith } from './hadith';
import { cardHaystack, hadithHaystack, excerpt } from './search';

// ─────────────────────────────────────────────────────────────────────────
//  1. EXPLANATION (demo placeholder + backend seam)
// ─────────────────────────────────────────────────────────────────────────

export interface ExplainContext {
  /** 'card' or 'hadith' — what the passage was selected from. */
  kind: 'card' | 'hadith';
  /** Human-readable reference for the source (e.g. "Quran 94:5-6"). */
  reference?: string;
  /** Topic theme of the source card, when it is a card. */
  theme?: Theme;
}

export interface ExplainResult {
  passage: string;
  /** A plain-terms restatement (generic in demo mode). */
  plain: string;
  /** A neutral, clearly-labelled practical-application framing (demo mode). */
  application: string;
  /** Always true here — flips to false only once a real backend is wired in. */
  isDemo: boolean;
}

/**
 * Produce an explanation for a highlighted passage.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  TODO(backend seam): wire the real model here.                          │
 * │                                                                         │
 * │  This static client has no API key and must never carry one. When a     │
 * │  backend exists, replace the `demoExplanation(...)` return below with a │
 * │  call to YOUR server, which holds the key and does the inference, e.g.: │
 * │                                                                         │
 * │    const res = await fetch('/api/explain', {                            │
 * │      method: 'POST',                                                     │
 * │      headers: { 'content-type': 'application/json' },                   │
 * │      body: JSON.stringify({ passage, context }),                        │
 * │    });                                                                   │
 * │    if (!res.ok) throw new Error(`explain failed (${res.status})`);      │
 * │    const data = await res.json();                                        │
 * │    return { ...data, isDemo: false };                                    │
 * │                                                                         │
 * │  The function is already async + Promise-returning so nothing in the    │
 * │  UI has to change when that swap happens. Keep the "not a scholarly     │
 * │  ruling" framing in the product regardless of the source.               │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export async function explainPassage(
  passage: string,
  context: ExplainContext
): Promise<ExplainResult> {
  // --- BEGIN placeholder (remove when the backend seam above is live) ---
  void context; // context is passed straight through to the real backend later
  return demoExplanation(passage);
  // --- END placeholder ---
}

/**
 * Honest, generic placeholder. It only echoes the highlighted text and offers a
 * neutral framing. It does NOT invent meanings, rulings, sources, or scholar
 * attributions — that is exactly what the real model (behind the backend seam)
 * would provide.
 */
function demoExplanation(passage: string): ExplainResult {
  const clean = passage.replace(/\s+/g, ' ').trim();
  return {
    passage: clean,
    plain:
      'In plain terms, this is the text you highlighted (shown above). A model ' +
      'connected through the backend would paraphrase it here in everyday ' +
      'language — this demo intentionally does not, so nothing is put in the ' +
      'text’s mouth.',
    application:
      'Practical application (demo): think about where words like these might ' +
      'fit into your day — as a reminder to return to, a line to reflect on, or ' +
      'something to look up properly with a qualified teacher. This is a neutral ' +
      'placeholder framing, not a ruling and not a sourced interpretation.',
    isDemo: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────
//  2. RELATED ITEMS (real — reuses the tagging + keyword system)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Very small English/Arabic-friendly stopword list so keyword overlap is driven
 * by content words, not glue words. Not exhaustive by design — it just trims the
 * highest-frequency noise.
 */
const STOPWORDS = new Set([
  'the', 'and', 'that', 'this', 'with', 'from', 'have', 'has', 'had', 'for',
  'not', 'are', 'was', 'were', 'you', 'your', 'his', 'her', 'him', 'she', 'they',
  'them', 'their', 'our', 'who', 'whom', 'whose', 'which', 'what', 'when', 'where',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'but', 'nor', 'yet', 'into', 'onto', 'upon', 'than', 'then', 'there', 'here',
  'been', 'being', 'does', 'did', 'done', 'also', 'such', 'some', 'any', 'all',
  'one', 'two', 'said', 'says', 'say', 'him', 'its', 'it’s', 'about', 'over',
  'under', 'after', 'before', 'because', 'while', 'each', 'every', 'other',
  'these', 'those', 'more', 'most', 'much', 'many', 'very', 'just', 'like',
]);

/**
 * Reduce free text to a de-duplicated set of lower-cased content keywords.
 * Keeps tokens of length >= 4 (covers meaningful English words and most useful
 * transliterated / Arabic tokens) that are not stopwords. `\p{L}\p{N}`
 * (unicode-aware) means Arabic letters survive, so Arabic selections can still
 * match Arabic haystacks.
 */
export function passageKeywords(text: string): string[] {
  const seen = new Set<string>();
  for (const raw of text.toLowerCase().split(/[^\p{L}\p{N}]+/u)) {
    const tok = raw.trim();
    if (tok.length < 4) continue;
    if (STOPWORDS.has(tok)) continue;
    seen.add(tok);
  }
  return [...seen];
}

export type RelatedSource =
  | { kind: 'card'; card: Card }
  | { kind: 'hadith'; hadith: Hadith };

export interface RelatedItem {
  kind: 'card' | 'hadith';
  card?: Card;
  hadith?: Hadith;
  /** Ranking score (higher = more related). */
  score: number;
  /** Human-readable "why this is related" chips. */
  reasons: string[];
}

const THEME_WEIGHT = 4;
const CATEGORY_WEIGHT = 2;
const SAME_BOOK_WEIGHT = 2;
const KEYWORD_CAP = 5; // don't let one very long passage dominate on overlap

/**
 * Find items genuinely related to a highlighted passage, using the selected
 * text AND the source card/hadith.
 *
 * Signal (all real, no fabrication):
 *   - shared topic THEME       (card source ↔ card candidate)  — strongest
 *   - shared content-type      (card source ↔ card candidate)
 *   - same book                (hadith source ↔ hadith candidate)
 *   - keyword overlap          (everything) — passage + source-title keywords
 *                              matched against the same haystacks global search
 *                              uses.
 *
 * Returns a mixed, score-sorted list (cards break ties ahead of hadith).
 */
export function findRelated(opts: {
  passage: string;
  source: RelatedSource;
  cards: Card[];
  hadiths: Hadith[];
  limit?: number;
}): RelatedItem[] {
  const { passage, source, cards, hadiths, limit = 8 } = opts;

  // Combine keywords from the highlighted passage with a few from the source's
  // own title/reference, so a very short selection still has signal.
  const extra =
    source.kind === 'card'
      ? `${source.card.title} ${source.card.reference ?? ''}`
      : `${source.hadith.narrator ?? ''} ${source.hadith.chapter.name}`;
  const keywords = [...new Set([...passageKeywords(passage), ...passageKeywords(extra)])];

  const sourceCardId = source.kind === 'card' ? source.card.id : null;
  const sourceHadithNo = source.kind === 'hadith' ? source.hadith.hadithNumber : null;
  const sourceTheme = source.kind === 'card' ? source.card.theme : null;
  const sourceCategory = source.kind === 'card' ? source.card.category : null;
  const sourceBook = source.kind === 'hadith' ? source.hadith.book.number : null;

  const items: RelatedItem[] = [];

  // ── Cards ──
  for (const c of cards) {
    if (c.id === sourceCardId) continue;
    let score = 0;
    const reasons: string[] = [];

    if (sourceTheme && sourceTheme !== 'general' && c.theme === sourceTheme) {
      score += THEME_WEIGHT;
      reasons.push(`Same theme · ${THEME_LABEL[c.theme as Theme]}`);
    }
    if (sourceCategory && c.category === sourceCategory) {
      score += CATEGORY_WEIGHT;
      reasons.push(`Same type · ${CATEGORY_LABEL[c.category as Category]}`);
    }

    const hay = cardHaystack(c);
    const shared = keywords.filter((k) => hay.includes(k));
    if (shared.length) {
      score += Math.min(shared.length, KEYWORD_CAP);
      reasons.push(keywordReason(shared));
    }

    if (score > 0) items.push({ kind: 'card', card: c, score, reasons });
  }

  // ── Hadith ──
  for (const h of hadiths) {
    if (h.hadithNumber === sourceHadithNo) continue;
    let score = 0;
    const reasons: string[] = [];

    if (sourceBook != null && h.book.number === sourceBook) {
      score += SAME_BOOK_WEIGHT;
      reasons.push(`Same book · ${h.book.name}`);
    }

    const hay = hadithHaystack(h);
    const shared = keywords.filter((k) => hay.includes(k));
    if (shared.length) {
      score += Math.min(shared.length, KEYWORD_CAP);
      reasons.push(keywordReason(shared));
    }

    if (score > 0) items.push({ kind: 'hadith', hadith: h, score, reasons });
  }

  items.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tie-break: cards before hadith (curated + navigable in-app).
    if (a.kind !== b.kind) return a.kind === 'card' ? -1 : 1;
    return 0;
  });

  return items.slice(0, limit);
}

/** "Shares “ease”, “hardship” +1 more" — a compact keyword-overlap reason. */
function keywordReason(shared: string[]): string {
  const shown = shared.slice(0, 3).map((k) => `“${k}”`);
  const more = shared.length - shown.length;
  return `Shares ${shown.join(', ')}${more > 0 ? ` +${more} more` : ''}`;
}

/** Re-export so the panel can render short snippets without a second import. */
export { excerpt };
