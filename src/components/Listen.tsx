import { useCallback, useEffect, useRef, useState } from 'react';
import type { Card } from '../types';
import { CATEGORY_LABEL } from '../types';
import {
  narrationText,
  pickCalmVoice,
  speechSupported,
  useVoices,
} from '../lib/narration';
import { createAmbience } from '../lib/ambience';
import type { AmbiencePlayer } from '../lib/ambience';
import { usePersistentFlag, usePersistentNumber } from '../lib/storage';

interface Props {
  cards: Card[];
}

/**
 * Commuter audio mode — a "Listen" experience that narrates the knowledge
 * cards with a calm voice over synthesized nature ambience, auto-advancing
 * through the deck. Background/lock-screen playback is premium-gated in a
 * YouTube-Premium style (mocked, no real payment).
 *
 * Everything is client-side and guarded so headless / unsupported browsers
 * render the UI without crashing (audio simply stays silent).
 */
export default function Listen({ cards }: Props) {
  const voices = useVoices();
  const canSpeak = speechSupported();

  const [premium, setPremium] = usePersistentFlag('ilm.premium');
  const [ambienceOn, setAmbienceOn] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('ilm.ambienceOn');
      return raw === null ? true : raw === '1';
    } catch {
      return true;
    }
  });
  const [ambienceVol, setAmbienceVol] = usePersistentNumber('ilm.ambienceVol', 0.25);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lockedNote, setLockedNote] = useState(false);

  // Refs mirror state so the speechSynthesis callbacks (which capture a
  // stale closure) always see the latest values.
  const playingRef = useRef(playing);
  const indexRef = useRef(index);
  const premiumRef = useRef(premium);
  const cancelingRef = useRef(false);
  const ambienceRef = useRef<AmbiencePlayer | null>(null);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    premiumRef.current = premium;
  }, [premium]);

  const current = cards[index];

  // ── Ambience lifecycle ──────────────────────────────────────────────
  useEffect(() => {
    ambienceRef.current = createAmbience(ambienceVol);
    return () => {
      ambienceRef.current?.dispose();
      ambienceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ambienceSupported = ambienceRef.current?.supported ?? false;

  // Start/stop the bed to follow play + toggle state.
  useEffect(() => {
    const amb = ambienceRef.current;
    if (!amb) return;
    if (playing && ambienceOn) amb.start();
    else amb.stop();
  }, [playing, ambienceOn]);

  useEffect(() => {
    ambienceRef.current?.setVolume(ambienceVol);
  }, [ambienceVol]);

  useEffect(() => {
    try {
      localStorage.setItem('ilm.ambienceOn', ambienceOn ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [ambienceOn]);

  // ── Narration ────────────────────────────────────────────────────────
  const stopSpeech = useCallback(() => {
    if (!canSpeak) return;
    cancelingRef.current = true;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
    // Release the guard on the next tick, after the (possible) onend fires.
    window.setTimeout(() => {
      cancelingRef.current = false;
    }, 0);
  }, [canSpeak]);

  const speakIndex = useCallback(
    (i: number) => {
      if (!canSpeak) return;
      const card = cards[i];
      if (!card) return;

      cancelingRef.current = true;
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
      cancelingRef.current = false;

      const utter = new SpeechSynthesisUtterance(narrationText(card));
      const voice = pickCalmVoice(voices);
      if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang;
      } else {
        utter.lang = 'en-US';
      }
      utter.rate = 0.9; // calm delivery
      utter.pitch = 0.9;

      utter.onend = () => {
        if (cancelingRef.current) return;
        if (!playingRef.current) return;
        const next = indexRef.current + 1;
        if (next < cards.length) {
          indexRef.current = next;
          setIndex(next);
          speakIndex(next);
        } else {
          playingRef.current = false;
          setPlaying(false);
        }
      };

      try {
        window.speechSynthesis.speak(utter);
      } catch {
        /* ignore */
      }
    },
    [canSpeak, cards, voices]
  );

  // ── Transport controls ───────────────────────────────────────────────
  const play = useCallback(() => {
    setLockedNote(false);
    playingRef.current = true;
    setPlaying(true);
    if (ambienceOn) ambienceRef.current?.start();
    speakIndex(indexRef.current);
  }, [ambienceOn, speakIndex]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    stopSpeech();
    ambienceRef.current?.stop();
  }, [stopSpeech]);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(cards.length - 1, i));
      indexRef.current = clamped;
      setIndex(clamped);
      if (playingRef.current) speakIndex(clamped);
    },
    [cards.length, speakIndex]
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  // Stop any narration if the component unmounts.
  useEffect(() => {
    return () => {
      if (canSpeak) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* ignore */
        }
      }
    };
  }, [canSpeak]);

  // ── MediaSession (lock-screen / notification controls) ────────────────
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }
    const ms = navigator.mediaSession;
    try {
      if (typeof MediaMetadata !== 'undefined' && current) {
        ms.metadata = new MediaMetadata({
          title: current.title,
          artist: 'Ilm · Listen',
          album: CATEGORY_LABEL[current.category],
        });
      }
      ms.setActionHandler('play', () => play());
      ms.setActionHandler('pause', () => pause());
      ms.setActionHandler('nexttrack', () => next());
      ms.setActionHandler('previoustrack', () => prev());
    } catch {
      /* some handlers unsupported — ignore */
    }
    try {
      ms.playbackState = playing ? 'playing' : 'paused';
    } catch {
      /* ignore */
    }
  }, [current, playing, play, pause, next, prev]);

  // ── Premium-gated background / lock behaviour ─────────────────────────
  // Uses document.hidden (visibilitychange) as a proxy for the screen
  // locking or the app being backgrounded.
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) return;
      // Premium users: keep playing (rely on MediaSession / the browser).
      if (premiumRef.current) return;
      // Free users: pause and leave a note for when they return.
      if (playingRef.current) {
        playingRef.current = false;
        setPlaying(false);
        stopSpeech();
        ambienceRef.current?.stop();
        setLockedNote(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () =>
      document.removeEventListener('visibilitychange', onVisibility);
  }, [stopSpeech]);

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-md px-4 pb-8 pt-4">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Listen · Commuter mode
          </p>
          <h2 className="mt-1 text-2xl font-bold">Hands-free knowledge</h2>
          <p className="mt-1 text-sm text-white/60">
            Sit back and let the cards be narrated to you, one after another.
          </p>
        </div>

        {/* Premium status row */}
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              Account
              {premium && (
                <span
                  data-testid="premium-badge"
                  className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-950"
                >
                  ★ Premium
                </span>
              )}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-white/50">
              {premium
                ? 'Background listening unlocked (demo tier).'
                : 'Free tier — background listening is Premium-only.'}
            </p>
          </div>
          <button
            type="button"
            data-testid="premium-toggle"
            onClick={() => {
              setPremium(!premium);
              if (!premium) setLockedNote(false);
            }}
            className={
              'shrink-0 rounded-full px-4 py-2 text-sm font-bold shadow transition ' +
              (premium
                ? 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15'
                : 'bg-amber-400 text-emerald-950 hover:bg-amber-300')
            }
          >
            {premium ? 'Cancel Premium' : 'Upgrade to Premium'}
          </button>
        </div>
        <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-white/45">
          <span aria-hidden>ⓘ</span>
          Demo upgrade, no payment connected.
        </p>

        {/* Locked-while-free note */}
        {lockedNote && !premium && (
          <div
            data-testid="locked-note"
            role="status"
            className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 text-[13px] leading-snug text-amber-900"
          >
            <span className="font-bold">Playback paused when your screen locked.</span>{' '}
            Upgrade to Premium for background listening.
          </div>
        )}

        {/* Player */}
        <div className="mt-5 rounded-3xl bg-sand-50 p-5 text-ink shadow-xl shadow-emerald-950/20 ring-1 ring-black/5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800/70">
            {current ? CATEGORY_LABEL[current.category] : 'Nothing to play'} ·{' '}
            {cards.length > 0 ? `${index + 1} / ${cards.length}` : '0 / 0'}
          </p>
          <p
            data-testid="now-playing"
            className="mt-1 text-lg font-bold leading-snug text-ink"
          >
            {current ? current.title : 'No cards available'}
          </p>

          {/* Transport */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous card"
              onClick={prev}
              disabled={index === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-800/10 text-lg text-emerald-900 transition hover:bg-emerald-800/20 disabled:opacity-40"
            >
              ⏮
            </button>
            <button
              type="button"
              data-testid="play-toggle"
              aria-label={playing ? 'Pause' : 'Play'}
              aria-pressed={playing}
              onClick={() => (playing ? pause() : play())}
              disabled={!current}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-800 text-2xl text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-40"
            >
              {playing ? '⏸' : '▶'}
            </button>
            <button
              type="button"
              aria-label="Next card"
              onClick={next}
              disabled={index >= cards.length - 1}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-800/10 text-lg text-emerald-900 transition hover:bg-emerald-800/20 disabled:opacity-40"
            >
              ⏭
            </button>
          </div>

          {!canSpeak && (
            <p
              data-testid="no-voice-note"
              className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-center text-[12px] font-medium text-amber-900 ring-1 ring-amber-200"
            >
              Narration voice unavailable on this device.
            </p>
          )}
          {canSpeak && voices.length === 0 && (
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-center text-[12px] font-medium text-amber-900 ring-1 ring-amber-200">
              Loading a narration voice… if none appears, no voice is
              installed on this device.
            </p>
          )}
        </div>

        {/* Ambience */}
        <div className="mt-5 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Nature ambience</p>
              <p className="mt-0.5 text-[11px] text-white/50">
                Plays gently under the narration.
              </p>
            </div>
            <button
              type="button"
              data-testid="ambience-toggle"
              role="switch"
              aria-checked={ambienceOn}
              aria-label="Toggle nature ambience"
              onClick={() => setAmbienceOn((v) => !v)}
              className={
                'relative h-7 w-12 shrink-0 rounded-full transition ' +
                (ambienceOn ? 'bg-amber-400' : 'bg-white/20')
              }
            >
              <span
                className={
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ' +
                  (ambienceOn ? 'left-[22px]' : 'left-0.5')
                }
              />
            </button>
          </div>

          <div className="mt-4">
            <label
              htmlFor="ambience-volume"
              className="flex items-center justify-between text-[11px] font-medium text-white/60"
            >
              <span>Volume</span>
              <span>{Math.round(ambienceVol * 100)}%</span>
            </label>
            <input
              id="ambience-volume"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={ambienceVol}
              disabled={!ambienceOn}
              onChange={(e) => setAmbienceVol(Number(e.target.value))}
              className="mt-1 w-full accent-amber-400 disabled:opacity-40"
            />
          </div>

          <p className="mt-3 rounded-xl bg-amber-100 px-3 py-2 text-[11px] leading-snug text-amber-900">
            <span className="font-bold">Placeholder ambience</span> — synthesized
            in-browser (filtered noise). Swap in a real, licensed nature track
            later.
          </p>
          {!ambienceSupported && (
            <p className="mt-2 text-[11px] leading-snug text-white/45">
              Web Audio is unavailable here, so the ambience stays silent.
            </p>
          )}
        </div>

        {/* Background-playback / premium explainer */}
        <div className="mt-5 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            Background listening
            <span
              className={
                'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ' +
                (premium
                  ? 'bg-amber-400 text-emerald-950'
                  : 'bg-white/15 text-white/80')
              }
            >
              {premium ? 'Unlocked' : 'Premium only'}
            </span>
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70">
            {premium
              ? 'Keep listening when your screen locks or you switch apps — playback will not auto-pause.'
              : 'On the free tier, playback pauses when your screen locks. Upgrade to Premium to keep listening in the background.'}
          </p>
        </div>

        {/* Honesty notes */}
        <div className="mt-6 space-y-1.5 text-[11px] leading-snug text-white/45">
          <p className="flex items-start gap-1.5">
            <span aria-hidden>ⓘ</span>
            Narration uses your device&rsquo;s built-in text-to-speech voice — no
            audio is recorded or downloaded.
          </p>
          <p className="flex items-start gap-1.5">
            <span aria-hidden>ⓘ</span>
            The ambience is a placeholder synthesized in the browser, not a real
            nature recording.
          </p>
          <p className="flex items-start gap-1.5">
            <span aria-hidden>ⓘ</span>
            Fully locked-screen background audio depends on your browser and is
            really a native-app capability; this web demo keeps playing where the
            browser allows.
          </p>
        </div>
      </div>
    </div>
  );
}
