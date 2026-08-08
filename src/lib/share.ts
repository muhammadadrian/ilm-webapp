/**
 * Helpers for sharing a card to social platforms.
 *
 * The shared payload is a short human-readable `text` (card title + a brief
 * snippet, or for a hadith its reference + a short English snippet) followed by
 * the public app link. Per-platform links use each platform's standard
 * web share-intent URL; Instagram deliberately has none (see ShareMenu), so it
 * is handled via the Web Share API or clipboard fallback instead.
 */

/** Public, shareable app link (GitHub Pages deployment). */
export const APP_URL = 'https://muhammadadrian.github.io/ilm-webapp/';

/**
 * Collapse whitespace and trim `text` to at most `max` characters, appending an
 * ellipsis when truncated. Keeps shared snippets short and tidy.
 */
export function snippet(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '').trimEnd() + '…';
}

/** The full copy/share payload: the descriptive text followed by the app link. */
export function sharePayload(text: string, url: string = APP_URL): string {
  return `${text} ${url}`;
}

export interface ShareLinks {
  whatsapp: string;
  telegram: string;
  facebook: string;
}

/**
 * Build the per-platform web share-intent URLs for a given text + link.
 * (Instagram is intentionally excluded — it has no arbitrary-content web
 * share intent.)
 */
export function shareLinks(text: string, url: string = APP_URL): ShareLinks {
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
  };
}
