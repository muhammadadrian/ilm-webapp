import { useEffect, useRef, useState } from 'react';
import { APP_URL, sharePayload, shareLinks } from '../lib/share';

/**
 * Share action for a card. Renders a trigger button; tapping it opens a
 * bottom-sheet with the four social platforms plus "Copy link".
 *
 * Behaviour:
 *  - If the Web Share API is available, a primary "Share…" button offers the OS
 *    share sheet (which includes Instagram and everything installed).
 *  - WhatsApp / Telegram / Facebook open their standard web share-intent URLs
 *    in a new tab.
 *  - Instagram has NO web share-intent for arbitrary content, so it is honest:
 *    it uses the Web Share API when available, otherwise copies the text + link
 *    to the clipboard and shows a note to paste into a story or DM.
 *  - "Copy link" copies the text + link and confirms.
 *
 * @param text  Short descriptive text (card title + snippet, or hadith
 *              reference + snippet). The app link is appended automatically.
 * @param url   Link to share (defaults to the public app URL).
 */
interface Props {
  text: string;
  url?: string;
  /** 'bar' = full-width action-bar button; 'inline' = compact text button. */
  variant?: 'bar' | 'inline';
}

type Notice = null | 'copied' | 'instagram';

export default function ShareMenu({ text, url = APP_URL, variant = 'bar' }: Props) {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const payload = sharePayload(text, url);
  const links = shareLinks(text, url);
  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setNotice(null);
  };

  const flash = (kind: Exclude<Notice, null>) => {
    setNotice(kind);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 2600);
  };

  const copy = async (kind: Exclude<Notice, null>) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        // Fallback for older / non-secure contexts.
        const ta = document.createElement('textarea');
        ta.value = payload;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      flash(kind);
    } catch {
      flash(kind);
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: text, text, url });
      close();
    } catch {
      /* user cancelled or share failed — keep the sheet open */
    }
  };

  const instagram = () => {
    if (canNativeShare) {
      void nativeShare();
    } else {
      void copy('instagram');
    }
  };

  return (
    <>
      {variant === 'bar' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Share"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-ink/60 transition hover:bg-sand-100"
        >
          <ShareGlyph className="h-4 w-4" />
          Share
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Share"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 underline-offset-2 hover:underline"
        >
          <ShareGlyph className="h-3.5 w-3.5" />
          Share
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Share this card"
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-sand-50 text-ink shadow-2xl ring-1 ring-black/10 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 pb-2 pt-4">
              <div>
                <h2 className="text-base font-bold text-emerald-900">Share</h2>
                <p className="mt-0.5 text-xs text-ink/50">
                  Send this to a friend or your story.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="-mr-1 shrink-0 rounded-full p-1.5 text-ink/50 hover:bg-sand-200 hover:text-ink"
              >
                <span aria-hidden className="block text-xl leading-none">
                  ×
                </span>
              </button>
            </div>

            {/* Native share (OS share sheet — includes Instagram + everything installed) */}
            {canNativeShare && (
              <div className="px-5 pb-1 pt-1">
                <button
                  type="button"
                  onClick={nativeShare}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-800 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                >
                  <ShareGlyph className="h-4 w-4" />
                  Share…
                </button>
              </div>
            )}

            {/* Platform grid */}
            <div className="grid grid-cols-4 gap-2 px-5 pb-2 pt-3">
              <PlatformLink
                href={links.whatsapp}
                label="WhatsApp"
                brandClass="bg-[#25D366]"
                icon={<WhatsAppIcon />}
              />
              <PlatformLink
                href={links.telegram}
                label="Telegram"
                brandClass="bg-[#2AABEE]"
                icon={<TelegramIcon />}
              />
              <PlatformLink
                href={links.facebook}
                label="Facebook"
                brandClass="bg-[#1877F2]"
                icon={<FacebookIcon />}
              />
              <PlatformButton
                onClick={instagram}
                label={canNativeShare ? 'Instagram' : 'Instagram (copy)'}
                brandClass="bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]"
                icon={<InstagramIcon />}
              />
            </div>

            {/* Copy link */}
            <div className="px-5 pb-3 pt-1">
              <button
                type="button"
                onClick={() => copy('copied')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-900/10 transition hover:bg-sand-100"
              >
                <LinkIcon className="h-4 w-4" />
                Copy link
              </button>
            </div>

            {/* Notice */}
            {notice && (
              <p
                role="status"
                className="mx-5 mb-4 rounded-xl bg-emerald-800/10 px-3 py-2 text-center text-[12px] font-medium leading-snug text-emerald-900"
              >
                {notice === 'copied'
                  ? 'Link copied to clipboard.'
                  : 'Copied — paste into your Instagram story or DM.'}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Platform tiles ──

function PlatformLink({
  href,
  label,
  brandClass,
  icon,
}: {
  href: string;
  label: string;
  brandClass: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${label}`}
      className="flex flex-col items-center gap-1.5"
    >
      <span
        className={
          'flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm ' +
          brandClass
        }
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium text-ink/70">{label}</span>
    </a>
  );
}

function PlatformButton({
  onClick,
  label,
  brandClass,
  icon,
}: {
  onClick: () => void;
  label: string;
  brandClass: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Share on ${label}`}
      className="flex flex-col items-center gap-1.5"
    >
      <span
        className={
          'flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm ' +
          brandClass
        }
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium leading-tight text-ink/70">
        {label}
      </span>
    </button>
  );
}

// ── Icons (inline SVG, no dependencies) ──

function ShareGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .17 4l-6.1 3.53a3 3 0 1 0 0 4.94L15 20a3 3 0 1 0 1-2.32l-6.1-3.53a3.02 3.02 0 0 0 0-.3L16 10.3A3 3 0 0 0 18 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91a9.85 9.85 0 0 0-2.9-7.01A9.85 9.85 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.22 8.23Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7">
      <path d="M21.94 4.6 18.7 19.9c-.24 1.08-.88 1.34-1.79.84l-4.94-3.64-2.38 2.29c-.26.26-.48.48-.99.48l.35-5.02 9.13-8.25c.4-.35-.09-.55-.62-.2L5.58 13.06.7 11.53c-1.06-.33-1.08-1.06.22-1.57l19.05-7.34c.88-.33 1.65.2 1.36 1.57Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.55-.14-2.85-.14C11.93 2 10 3.66 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7">
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.6 1.77 1.15.56.56.9 1.11 1.16 1.77.24.64.4 1.36.46 2.43C21.99 8.94 22 9.28 22 12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.8-.46 2.43a4.9 4.9 0 0 1-1.16 1.77c-.55.56-1.11.9-1.77 1.16-.64.24-1.36.4-2.43.46-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.8-.22-2.43-.46a4.9 4.9 0 0 1-1.77-1.16 4.9 4.9 0 0 1-1.16-1.77c-.24-.64-.4-1.36-.46-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.8.46-2.43.26-.66.6-1.22 1.16-1.77.55-.56 1.11-.9 1.77-1.15.64-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.98.04-1.5.2-1.86.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.36-.3.88-.34 1.86-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.98.2 1.5.34 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.14.88.3 1.86.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.98-.04 1.5-.2 1.86-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.36.3-.88.34-1.86.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.98-.2-1.5-.34-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.14-.88-.3-1.86-.34-1.05-.05-1.37-.06-4.04-.06Zm0 3.07a5.13 5.13 0 1 1 0 10.26 5.13 5.13 0 0 1 0-10.26Zm0 8.46a3.33 3.33 0 1 0 0-6.66 3.33 3.33 0 0 0 0 6.66Zm5.34-8.66a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
    </svg>
  );
}
