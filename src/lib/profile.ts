import { useCallback, useEffect, useState } from 'react';

/**
 * Profile state helpers, all persisted to localStorage so a demo profile
 * survives reloads with no backend.
 *
 * Storage keys (all under the app's `ilm.` namespace):
 *   ilm.profile.name    display name (string)
 *   ilm.profile.bio     short bio (string)
 *   ilm.profile.avatar  downscaled avatar as a data: URL (string)
 *   ilm.profile.links   social/web links (JSON array of ProfileLink)
 */

export const AVATAR_KEY = 'ilm.profile.avatar';
export const LINKS_KEY = 'ilm.profile.links';
export const NAME_KEY = 'ilm.profile.name';
export const BIO_KEY = 'ilm.profile.bio';

/** Longest edge (px) an avatar is downscaled to before storing. */
export const AVATAR_MAX_PX = 256;
/** Max accepted source image size (5 MB) before we refuse to read it. */
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export type LinkKind = 'instagram' | 'twitter' | 'youtube' | 'website';

export interface ProfileLink {
  id: string;
  kind: LinkKind;
  url: string;
}

export interface LinkKindMeta {
  key: LinkKind;
  label: string;
  icon: string;
  placeholder: string;
}

/** Known link kinds, with an emoji icon and label for rendering. */
export const LINK_KINDS: LinkKindMeta[] = [
  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/username' },
  { key: 'twitter', label: 'X / Twitter', icon: '𝕏', placeholder: 'https://x.com/username' },
  { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: 'https://youtube.com/@channel' },
  { key: 'website', label: 'Website', icon: '🌐', placeholder: 'https://example.com' },
];

export const LINK_KIND_META: Record<LinkKind, LinkKindMeta> = LINK_KINDS.reduce(
  (acc, k) => {
    acc[k.key] = k;
    return acc;
  },
  {} as Record<LinkKind, LinkKindMeta>
);

/**
 * Basic URL validation for user-supplied social links. Accepts only http(s)
 * URLs with a host; tolerates a missing scheme by assuming https://.
 * Returns the normalized URL string, or null when it cannot be parsed.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    // Require a dotted host (or localhost) so "abc" is rejected.
    if (!u.hostname || (!u.hostname.includes('.') && u.hostname !== 'localhost')) {
      return null;
    }
    return u.toString();
  } catch {
    return null;
  }
}

function readLinks(): ProfileLink[] {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is ProfileLink =>
        !!l &&
        typeof l.id === 'string' &&
        typeof l.url === 'string' &&
        typeof l.kind === 'string'
    );
  } catch {
    return [];
  }
}

/**
 * Hook managing the persisted list of social/web links. Validates URLs on add
 * and keeps the list in localStorage.
 */
export function useProfileLinks(): {
  links: ProfileLink[];
  addLink: (kind: LinkKind, url: string) => string | null;
  removeLink: (id: string) => void;
} {
  const [links, setLinks] = useState<ProfileLink[]>(() => readLinks());

  useEffect(() => {
    try {
      localStorage.setItem(LINKS_KEY, JSON.stringify(links));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [links]);

  const addLink = useCallback((kind: LinkKind, url: string): string | null => {
    const normalized = normalizeUrl(url);
    if (!normalized) return 'Enter a valid web address (https://…).';
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    setLinks((prev) => [...prev, { id, kind, url: normalized }]);
    return null;
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { links, addLink, removeLink };
}

/**
 * Reads an image File, downscales it so its longest edge is at most
 * AVATAR_MAX_PX, and resolves with a compact JPEG data: URL suitable for
 * localStorage. Falls back to the raw FileReader data URL if the canvas
 * pipeline is unavailable (e.g. headless without 2d context).
 *
 * Rejects if the file is not an image, exceeds AVATAR_MAX_BYTES, or cannot be
 * read/decoded.
 */
export function fileToAvatarDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'));
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      reject(new Error('Image is too large — please pick one under 5 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const dataUrl = String(reader.result ?? '');
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode that image.'));
      img.onload = () => {
        try {
          const { width, height } = img;
          const scale = Math.min(1, AVATAR_MAX_PX / Math.max(width, height));
          const w = Math.max(1, Math.round(width * scale));
          const h = Math.max(1, Math.round(height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // No canvas support — store the original data URL as a fallback.
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
