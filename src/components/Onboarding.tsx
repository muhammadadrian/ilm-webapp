import { useRef, useState } from 'react';

interface Props {
  onDone: () => void;
}

const SCREEN_COUNT = 5;

/**
 * Onboarding carousel: 5 screens, swipeable + Next/Back + progress dots + Skip.
 * Everything not yet wired to a backend (share/donate/volunteer) is clearly
 * labelled as a demo, matching the app's honesty about placeholder content.
 */
export default function Onboarding({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goNext = () => setIndex((i) => Math.min(i + 1, SCREEN_COUNT - 1));
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -40) goNext();
    else if (delta > 40) goBack();
    touchStartX.current = null;
  };

  const isLast = index === SCREEN_COUNT - 1;

  return (
    <div className="flex h-[100dvh] flex-col bg-gradient-to-b from-emerald-950 to-emerald-900 text-white">
      {/* Top bar: progress + skip */}
      <div className="flex shrink-0 items-center justify-between px-5 pt-5">
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
            <span
              key={i}
              className={
                'h-1.5 rounded-full transition-all ' +
                (i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30')
              }
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-semibold text-white/70 hover:text-white"
        >
          Skip
        </button>
      </div>

      {/* Slide */}
      <div
        className="flex min-h-0 flex-1 items-center justify-center px-6"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-full max-w-md">
          {index === 0 && <StreakScreen />}
          {index === 1 && <RankingScreen />}
          {index === 2 && <ShareScreen />}
          {index === 3 && <DonateScreen />}
          {index === 4 && <VolunteerScreen />}
        </div>
      </div>

      {/* Nav controls */}
      <div className="shrink-0 px-6 pb-8">
        <div className="mx-auto flex w-full max-w-md items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={index === 0}
            className={
              'rounded-xl px-4 py-3 text-sm font-semibold transition ' +
              (index === 0
                ? 'invisible'
                : 'text-white/70 hover:bg-white/10 hover:text-white')
            }
          >
            Back
          </button>
          <div className="flex-1" />
          {isLast ? (
            <button
              type="button"
              onClick={onDone}
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-900 shadow-lg transition hover:bg-sand-100"
            >
              Get started
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-emerald-900 shadow-lg transition hover:bg-sand-100"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shared layout for a slide ── */

function Slide({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/15">
        {icon}
      </div>
      <h2 className="mt-6 text-2xl font-bold leading-tight">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-white/70">
        {children}
      </div>
    </div>
  );
}

const DemoNote = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] leading-snug text-white/50">
    <span aria-hidden>ⓘ</span>
    {children}
  </p>
);

/* ── Screen 1: Streak & pause ── */

function StreakScreen() {
  return (
    <Slide
      icon={<span className="text-6xl leading-none">🔥</span>}
      title="Keep your daily streak"
    >
      <div className="mx-auto mb-4 mt-1 inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-4 py-2 text-amber-300 ring-1 ring-amber-400/30">
        <span aria-hidden className="text-xl">🔥</span>
        <span className="text-lg font-bold">7-day streak</span>
      </div>
      <p>
        Learn a little every day and watch your streak grow. Miss a day? A{' '}
        <span className="font-semibold text-white">streak freeze</span> keeps it
        safe so one busy day doesn&rsquo;t set you back to zero.
      </p>
    </Slide>
  );
}

/* ── Screen 2: Ranking with friends ── */

function RankingScreen() {
  const rows = [
    { name: 'Amina K.', points: 1240, you: false },
    { name: 'Yusuf R.', points: 1180, you: false },
    { name: 'You', points: 1090, you: true },
    { name: 'Bilal S.', points: 970, you: false },
  ];
  return (
    <Slide
      icon={<span className="text-6xl leading-none">🏆</span>}
      title="Climb the ranks with friends"
    >
      <div className="mx-auto mt-2 max-w-xs space-y-2 text-left">
        {rows.map((r, i) => (
          <div
            key={r.name}
            className={
              'flex items-center gap-3 rounded-xl px-3 py-2 ring-1 ' +
              (r.you
                ? 'bg-white/15 ring-white/25'
                : 'bg-white/5 ring-white/10')
            }
          >
            <span className="w-5 text-center text-sm font-bold text-white/60">
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-semibold text-white">
              {r.name}
            </span>
            <span className="text-sm font-bold text-amber-300">
              {r.points.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4">
        Compete on a friendly leaderboard and cheer each other on.
      </p>
      <DemoNote>Demo leaderboard — friend ranking not yet connected.</DemoNote>
    </Slide>
  );
}

/* ── Screen 3: Share pahala & rizq ── */

function ShareScreen() {
  const [note, setNote] = useState<string | null>(null);

  const handleShare = async () => {
    const shareData = {
      title: 'Ilm',
      text: '1-minute of Islamic knowledge for the modern Muslim.',
      url: typeof location !== 'undefined' ? location.href : '',
    };
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await navigator.share(shareData);
      } else {
        setNote('Sharing isn’t available on this device.');
      }
    } catch {
      /* user dismissed the share sheet — no-op */
    }
  };

  return (
    <Slide
      icon={<span className="text-6xl leading-none">🤲</span>}
      title="Share pahala & rizq"
    >
      <p>
        Sharing beneficial knowledge spreads reward (pahala) and provision
        (rizq). Invite a friend and you both keep learning together.
      </p>
      <button
        type="button"
        onClick={handleShare}
        className="mt-5 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-emerald-900 shadow transition hover:bg-sand-100"
      >
        Share the app
      </button>
      {note && <DemoNote>{note}</DemoNote>}
    </Slide>
  );
}

/* ── Screen 4: Donate to the developers ── */

function DonateScreen() {
  const [open, setOpen] = useState(false);
  return (
    <Slide
      icon={<span className="text-6xl leading-none">💚</span>}
      title="Support the developers"
    >
      <p>
        Ilm is built by a small team. A donation helps keep the lights on and
        the content growing, in shaa Allah.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-emerald-900 shadow transition hover:bg-sand-100"
      >
        Donate
      </button>
      {open && (
        <p className="mx-auto mt-4 max-w-xs rounded-xl bg-white/10 px-4 py-3 text-[13px] leading-snug text-white/80 ring-1 ring-white/15">
          Coming soon — donations are not yet connected to a payment provider.
        </p>
      )}
    </Slide>
  );
}

/* ── Screen 5: Scholars — volunteer to verify ── */

function VolunteerScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <Slide
      icon={<span className="text-6xl leading-none">📖</span>}
      title="Scholars: help us verify"
    >
        <p>
        The hadith come from Riyad us-Salihin via sunnah.com, but their grading
        is not verified here. If you&rsquo;re a scholar or student of knowledge,
        volunteer to help review and confirm sourcing.
      </p>
      {submitted ? (
        <p className="mx-auto mt-4 max-w-xs rounded-xl bg-white/10 px-4 py-3 text-[13px] leading-snug text-white/80 ring-1 ring-white/15">
          JazakAllahu khayran — we&rsquo;ll be in touch. (Demo only; nothing was
          submitted.)
        </p>
      ) : (
        <form
          className="mx-auto mt-5 flex max-w-xs flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 ring-1 ring-white/15 focus:outline-none focus:ring-white/40"
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-emerald-900 shadow transition hover:bg-sand-100"
          >
            Volunteer to verify
          </button>
        </form>
      )}
      <DemoNote>UI only — no form is submitted to a backend yet.</DemoNote>
    </Slide>
  );
}
