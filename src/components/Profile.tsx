import { useRef, useState } from 'react';
import {
  usePersistentFlag,
  usePersistentString,
} from '../lib/storage';
import {
  AVATAR_KEY,
  BIO_KEY,
  LINK_KINDS,
  LINK_KIND_META,
  NAME_KEY,
  fileToAvatarDataUrl,
  useProfileLinks,
} from '../lib/profile';
import type { LinkKind } from '../lib/profile';
import { formatDuration } from '../lib/screenTime';
import Plans from './Plans';

interface Props {
  /** Real, earned knowledge points (read-only stat). */
  points: number;
  /** Real, tracked on-screen time in ms (read-only stat). */
  screenMs: number;
}

/**
 * "My Profile" page.
 *
 * Editable (persisted to localStorage): avatar picture (downscaled to a small
 * JPEG data URL), display name, bio, and a list of social/web links.
 * Read-only stats: knowledge points, Premium status, screen time. Below the
 * profile sits the monetization / support plan cards (see Plans).
 *
 * Everything is client-side; no backend.
 */
export default function Profile({ points, screenMs }: Props) {
  // Premium is owned here (single source of truth) and shared with Plans so the
  // status badge and the plan cards stay in sync as premium is toggled.
  const [premium, setPremium] = usePersistentFlag('ilm.premium');

  const [name, setName] = usePersistentString(NAME_KEY, '');
  const [bio, setBio] = usePersistentString(BIO_KEY, '');
  const [avatar, setAvatar] = usePersistentString(AVATAR_KEY, '');
  const { links, addLink, removeLink } = useProfileLinks();

  const [editing, setEditing] = useState(false);

  // Draft state while editing; committed to storage on Save.
  const [draftName, setDraftName] = useState(name);
  const [draftBio, setDraftBio] = useState(bio);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // Link editor state
  const [linkKind, setLinkKind] = useState<LinkKind>('instagram');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);

  const startEdit = () => {
    setDraftName(name);
    setDraftBio(bio);
    setAvatarError(null);
    setEditing(true);
  };

  const save = () => {
    setName(draftName.trim());
    setBio(draftBio.trim());
    setEditing(false);
  };

  const handleAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Allow re-picking the same file later.
    e.target.value = '';
    if (!file) return;
    setAvatarError(null);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setAvatar(dataUrl);
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : 'Could not use that image.'
      );
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    const err = addLink(linkKind, linkUrl);
    if (err) {
      setLinkError(err);
      return;
    }
    setLinkError(null);
    setLinkUrl('');
  };

  const displayName = name.trim() || 'Your name';

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-md px-4 pb-10 pt-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            My Profile
          </p>
          <button
            type="button"
            data-testid={editing ? 'profile-save' : 'profile-edit'}
            onClick={editing ? save : startEdit}
            className={
              'rounded-full px-4 py-1.5 text-sm font-bold transition ' +
              (editing
                ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300'
                : 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15')
            }
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Avatar + identity */}
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-white/20">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Your profile"
                  data-testid="profile-avatar-img"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  data-testid="profile-avatar-placeholder"
                  className="text-4xl"
                >
                  🧑
                </span>
              )}
            </div>
            {editing && (
              <button
                type="button"
                data-testid="profile-avatar-pick"
                onClick={() => fileRef.current?.click()}
                aria-label="Change profile picture"
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-emerald-950 shadow ring-2 ring-emerald-900 transition hover:bg-amber-300"
              >
                <span aria-hidden>✎</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarPick}
              className="hidden"
              data-testid="profile-avatar-input"
            />
          </div>

          {editing && avatar && (
            <button
              type="button"
              onClick={() => setAvatar('')}
              className="mt-2 text-[12px] font-medium text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
            >
              Remove photo
            </button>
          )}
          {avatarError && (
            <p role="alert" className="mt-2 text-[12px] font-medium text-amber-300">
              {avatarError}
            </p>
          )}

          {/* Name */}
          {editing ? (
            <input
              type="text"
              data-testid="profile-name-input"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your name"
              aria-label="Display name"
              className="mt-4 w-full max-w-xs rounded-xl bg-white/10 px-4 py-2 text-center text-lg font-bold text-white placeholder-white/40 ring-1 ring-white/15 focus:outline-none focus:ring-white/40"
            />
          ) : (
            <h2
              data-testid="profile-name"
              className={
                'mt-4 text-xl font-bold ' +
                (name.trim() ? 'text-white' : 'text-white/40')
              }
            >
              {displayName}
            </h2>
          )}

          {/* Bio */}
          {editing ? (
            <textarea
              data-testid="profile-bio-input"
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              placeholder="A short bio — what are you learning?"
              aria-label="Bio"
              rows={3}
              className="mt-3 w-full resize-none rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 ring-1 ring-white/15 focus:outline-none focus:ring-white/40"
            />
          ) : bio.trim() ? (
            <p
              data-testid="profile-bio"
              className="mt-2 max-w-xs text-sm leading-relaxed text-white/70"
            >
              {bio}
            </p>
          ) : (
            <p
              data-testid="profile-bio"
              className="mt-2 text-sm italic text-white/40"
            >
              No bio yet.
            </p>
          )}
        </div>

        {/* Social links */}
        <div className="mt-5">
          {links.length > 0 && (
            <ul
              data-testid="profile-links"
              className="flex flex-wrap justify-center gap-2"
            >
              {links.map((l) => {
                const meta = LINK_KIND_META[l.kind];
                return (
                  <li key={l.id} className="flex items-center">
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pl-3 pr-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20"
                    >
                      <span aria-hidden>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </a>
                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeLink(l.id)}
                        aria-label={`Remove ${meta.label} link`}
                        className="-ml-1 rounded-full p-1 text-white/40 hover:text-white"
                      >
                        <span aria-hidden className="block text-base leading-none">
                          ×
                        </span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {editing && (
            <form
              onSubmit={handleAddLink}
              className="mx-auto mt-3 flex max-w-xs flex-col gap-2"
            >
              <div className="flex gap-2">
                <select
                  value={linkKind}
                  onChange={(e) => setLinkKind(e.target.value as LinkKind)}
                  aria-label="Link type"
                  className="shrink-0 rounded-xl bg-white/10 px-2 py-2 text-sm text-white ring-1 ring-white/15 focus:outline-none focus:ring-white/40"
                >
                  {LINK_KINDS.map((k) => (
                    <option key={k.key} value={k.key} className="text-emerald-950">
                      {k.icon} {k.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  inputMode="url"
                  data-testid="profile-link-url"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    if (linkError) setLinkError(null);
                  }}
                  placeholder={LINK_KIND_META[linkKind].placeholder}
                  aria-label="Link URL"
                  className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 ring-1 ring-white/15 focus:outline-none focus:ring-white/40"
                />
              </div>
              <button
                type="submit"
                data-testid="profile-link-add"
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15"
              >
                Add link
              </button>
              {linkError && (
                <p role="alert" className="text-[12px] font-medium text-amber-300">
                  {linkError}
                </p>
              )}
            </form>
          )}

          {!editing && links.length === 0 && (
            <p className="text-center text-[12px] italic text-white/40">
              No links yet — tap Edit to add your socials.
            </p>
          )}
        </div>

        {/* Read-only stats */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Stat
            label="Points"
            value={points.toLocaleString()}
            testid="profile-stat-points"
          />
          <Stat
            label="Screen time"
            value={formatDuration(screenMs)}
            testid="profile-stat-screentime"
          />
          <Stat
            label="Plan"
            value={premium ? 'Premium' : 'Free'}
            testid="profile-stat-plan"
            highlight={premium}
          />
        </div>

        {/* Plans / monetization */}
        <div className="mt-8">
          <Plans premium={premium} setPremium={setPremium} />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  testid,
  highlight,
}: {
  label: string;
  value: string;
  testid: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        'rounded-2xl px-2 py-3 text-center ring-1 ' +
        (highlight
          ? 'bg-amber-400/15 ring-amber-300/40'
          : 'bg-white/5 ring-white/10')
      }
    >
      <p
        data-testid={testid}
        className={
          'text-base font-bold ' + (highlight ? 'text-amber-300' : 'text-white')
        }
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
        {label}
      </p>
    </div>
  );
}
