import { useMemo, useState } from 'react';
import { useFriends } from '../lib/friends';
import { formatDuration } from '../lib/screenTime';

interface Props {
  /** The current user's real, tracked on-screen time in ms. */
  youMs: number;
}

interface Row {
  key: string;
  name: string;
  screenTimeMs: number;
  you: boolean;
}

/**
 * Friends ranking. Ranks the current user ("You", real tracked time)
 * against added friends (demo time) by total on-screen time, longest
 * first. Add friends by email; the list persists in localStorage.
 */
export default function Ranking({ youMs }: Props) {
  const { friends, addFriend, removeFriend } = useFriends();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo<Row[]>(() => {
    const all: Row[] = [
      { key: '__you__', name: 'You', screenTimeMs: youMs, you: true },
      ...friends.map((f) => ({
        key: f.email,
        name: f.name,
        screenTimeMs: f.screenTimeMs,
        you: false,
      })),
    ];
    return all.sort((a, b) => b.screenTimeMs - a.screenTimeMs);
  }, [friends, youMs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = addFriend(email);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setEmail('');
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 pt-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
          Ranking
        </p>
        <h2 className="mt-1 text-2xl font-bold">Time on screen</h2>
        <p className="mt-1 text-sm text-white/60">
          Ranked by total time spent learning — longest first.
        </p>
      </div>

      {/* Add a friend by email */}
      <div className="px-4 pt-5">
        <form onSubmit={handleSubmit} className="mx-auto max-w-md">
          <label
            htmlFor="friend-email"
            className="block text-sm font-semibold text-white/80"
          >
            Add a friend by email
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="friend-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="friend@example.com"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'friend-email-error' : undefined}
              className="flex-1 rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 ring-1 ring-white/15 focus:outline-none focus:ring-white/40"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-900 shadow transition hover:bg-sand-100"
            >
              Add
            </button>
          </div>
          {error && (
            <p
              id="friend-email-error"
              role="alert"
              className="mt-2 text-[13px] font-medium text-amber-300"
            >
              {error}
            </p>
          )}
        </form>
      </div>

      {/* Leaderboard */}
      <div className="px-4 pb-6 pt-5">
        <ol className="mx-auto max-w-md space-y-2">
          {rows.map((row, i) => (
            <li
              key={row.key}
              className={
                'flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ' +
                (row.you
                  ? 'bg-white/15 ring-white/25'
                  : 'bg-white/5 ring-white/10')
              }
            >
              <span className="w-6 text-center text-sm font-bold text-white/60">
                {i + 1}
              </span>
              <span className="flex flex-1 items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {row.name}
                </span>
                {row.you && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
                    You
                  </span>
                )}
              </span>
              <span className="text-sm font-bold text-amber-300">
                {formatDuration(row.screenTimeMs)}
              </span>
              {!row.you && (
                <button
                  type="button"
                  onClick={() => removeFriend(row.key)}
                  aria-label={`Remove ${row.name}`}
                  className="-mr-1 shrink-0 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
                >
                  <span aria-hidden className="block text-base leading-none">
                    ×
                  </span>
                </button>
              )}
            </li>
          ))}
        </ol>

        {friends.length === 0 && (
          <p className="mx-auto mt-4 max-w-md text-center text-sm text-white/60">
            It&rsquo;s just you so far. Add a friend by email to start a
            friendly leaderboard.
          </p>
        )}

        <p className="mx-auto mt-5 flex max-w-md items-start justify-center gap-1.5 text-center text-[11px] leading-snug text-white/50">
          <span aria-hidden className="pt-px">
            ⓘ
          </span>
          <span>
            Your time is tracked live on this device. Friend activity is
            sample data until a backend is connected.
          </span>
        </p>
      </div>
    </div>
  );
}
