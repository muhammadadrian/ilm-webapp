/**
 * Global, faceted search across the 1,896 Riyad us-Salihin hadith. This module
 * holds the pure matching logic + the facet definitions; the UI lives in
 * `components/GlobalSearch.tsx`.
 *
 * Four concrete facet modes plus a plain free-text mode:
 *   - all      → free text over narrator / english / arabic / reference /
 *                book / chapter.
 *   - emotion  → curated emotion chips mapped to keywords (the data has no
 *                emotion tags — see EMOTIONS), so a feeling surfaces relevant
 *                hadith by keyword overlap.
 *   - life     → common life-issue chips (marriage, money, parenting, …) mapped
 *                to keywords, so a life question surfaces relevant hadith.
 *   - scholar  → free text scoped to the narrator.
 *   - quran    → free text scoped to the reference field (e.g. "2:255") and the
 *                hadith text (many hadith cite verses).
 *
 * The old placeholder cards carried topic/theme tags; those cards are gone, so
 * the emotion/life facets now match hadith purely by keyword, and the pure
 * "Topic" facet (which had no hadith signal) has been removed.
 */

import type { Hadith } from './hadith';

export type Facet = 'all' | 'emotion' | 'life' | 'scholar' | 'quran';

export interface FacetMeta {
  key: Facet;
  label: string;
  /** Short helper text shown under the facet row. */
  hint: string;
}

export const FACETS: FacetMeta[] = [
  { key: 'all', label: 'All', hint: 'Free text across narrators, English, Arabic, references, books and chapters.' },
  { key: 'emotion', label: 'Emotion', hint: 'How are you feeling? Each emotion maps to a set of keywords.' },
  { key: 'life', label: 'Life issue', hint: 'Pick a life issue to surface hadith on that subject by keyword.' },
  { key: 'scholar', label: 'Narrator', hint: 'Search by the companion / narrator of the hadith.' },
  { key: 'quran', label: 'Quran verse', hint: 'Enter a reference like 2:255, or words from a verse.' },
];

/**
 * Emotion → keyword mapping. The dataset has no emotion tags, so each emotion
 * is expressed as a set of free keywords; a hadith matches an emotion if any of
 * its keywords appears in the hadith text.
 */
export interface EmotionDef {
  key: string;
  label: string;
  emoji: string;
  keywords: string[];
}

export const EMOTIONS: EmotionDef[] = [
  {
    key: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    keywords: ['anxiety', 'anxious', 'worry', 'worried', 'fear', 'calm', 'patience', 'ease', 'hardship', 'distress', 'grief'],
  },
  {
    key: 'grateful',
    label: 'Grateful',
    emoji: '🤲',
    keywords: ['gratitude', 'grateful', 'thankful', 'thanks', 'praise', 'blessing', 'blessings', 'contentment', 'provision'],
  },
  {
    key: 'angry',
    label: 'Angry',
    emoji: '😤',
    keywords: ['anger', 'angry', 'patience', 'restrain', 'forgive', 'forbear', 'gentle', 'temper', 'calm'],
  },
  {
    key: 'sad',
    label: 'Sad',
    emoji: '😢',
    keywords: ['grief', 'sorrow', 'sad', 'sadness', 'comfort', 'hope', 'relief', 'weep', 'ease'],
  },
  {
    key: 'hopeful',
    label: 'Hopeful',
    emoji: '🌅',
    keywords: ['hope', 'mercy', 'ease', 'forgiveness', 'reward', 'paradise', 'relief', 'repent'],
  },
  {
    key: 'fearful',
    label: 'Fearful',
    emoji: '😨',
    keywords: ['fear', 'trust', 'reliance', 'protect', 'protection', 'refuge', 'calm', 'safety'],
  },
  {
    key: 'lonely',
    label: 'Lonely',
    emoji: '🕊️',
    keywords: ['lonely', 'alone', 'loneliness', 'remembrance', 'companion', 'company', 'brother', 'gathering'],
  },
];

/**
 * Life-issue → keyword mapping. Each life issue is a set of keywords so hadith
 * on that subject surface for the same life question.
 */
export interface LifeIssueDef {
  key: string;
  label: string;
  emoji: string;
  keywords: string[];
}

export const LIFE_ISSUES: LifeIssueDef[] = [
  {
    key: 'marriage',
    label: 'Marriage',
    emoji: '💍',
    keywords: ['marriage', 'marry', 'spouse', 'husband', 'wife', 'married', 'women', 'woman'],
  },
  {
    key: 'money',
    label: 'Money & Rizq',
    emoji: '💰',
    keywords: ['money', 'wealth', 'provision', 'sustenance', 'rich', 'poverty', 'poor', 'spend', 'charity', 'income', 'debt'],
  },
  {
    key: 'parenting',
    label: 'Parenting',
    emoji: '👨‍👩‍👧',
    keywords: ['parent', 'child', 'children', 'family', 'father', 'mother', 'son', 'daughter', 'orphan'],
  },
  {
    key: 'youth',
    label: 'Youth',
    emoji: '🧑',
    keywords: ['youth', 'young', 'boy', 'student', 'grew'],
  },
  {
    key: 'business',
    label: 'Business ethics',
    emoji: '🤝',
    keywords: ['business', 'trade', 'work', 'honest', 'truthful', 'deal', 'sell', 'buy', 'fair', 'seller', 'buyer', 'wage'],
  },
  {
    key: 'productivity',
    label: 'Productivity',
    emoji: '⏳',
    keywords: ['time', 'work', 'deed', 'deeds', 'effort', 'strive', 'moderation', 'consistent'],
  },
];

// ── Haystack (lower-cased once per item at match time) ──
// Exported so the tap-to-explain related-items logic (lib/explain.ts) can reuse
// the exact same field set + normalisation used by global search.

export function hadithHaystack(h: Hadith): string {
  return [h.narrator, h.english, h.arabic, h.reference, h.book.name, h.chapter.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

// ── Unified result shape ──

export type SearchResult = { kind: 'hadith'; hadith: Hadith };

/**
 * True when the current facet + query + selection constitutes an "active"
 * search worth running.
 */
export function isActiveSearch(facet: Facet, query: string, selection: string | null): boolean {
  if (query.trim().length > 0) return true;
  // Emotion/life become active once a chip is chosen.
  if ((facet === 'emotion' || facet === 'life') && selection) return true;
  return false;
}

/** Match hadith for the given facet/query/selection. */
export function matchHadith(
  hadiths: Hadith[],
  facet: Facet,
  query: string,
  selection: string | null
): Hadith[] {
  const q = query.trim().toLowerCase();
  switch (facet) {
    case 'emotion': {
      const def = EMOTIONS.find((e) => e.key === selection);
      if (!def) return q ? hadiths.filter((h) => hadithHaystack(h).includes(q)) : [];
      let res = hadiths.filter((h) => {
        const hay = hadithHaystack(h);
        return def.keywords.some((k) => hay.includes(k));
      });
      if (q) res = res.filter((h) => hadithHaystack(h).includes(q));
      return res;
    }
    case 'life': {
      const def = LIFE_ISSUES.find((l) => l.key === selection);
      if (!def) return q ? hadiths.filter((h) => hadithHaystack(h).includes(q)) : [];
      let res = hadiths.filter((h) => {
        const hay = hadithHaystack(h);
        return def.keywords.some((k) => hay.includes(k));
      });
      if (q) res = res.filter((h) => hadithHaystack(h).includes(q));
      return res;
    }
    case 'scholar': {
      if (!q) return [];
      return hadiths.filter((h) => h.narrator.toLowerCase().includes(q));
    }
    case 'quran': {
      if (!q) return [];
      return hadiths.filter(
        (h) => h.reference.toLowerCase().includes(q) || hadithHaystack(h).includes(q)
      );
    }
    case 'all':
    default:
      return q ? hadiths.filter((h) => hadithHaystack(h).includes(q)) : [];
  }
}

/** Short plain-text snippet for a result row. */
export function excerpt(text: string, max = 140): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + '…';
}
