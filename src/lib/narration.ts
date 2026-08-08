import { useEffect, useState } from 'react';
import type { Hadith } from './hadith';

/**
 * Narration via the Web Speech API (speechSynthesis).
 *
 * Uses whatever text-to-speech voice the device provides — no audio is
 * bundled and no network call is made. Guards for browsers/headless
 * environments where speechSynthesis is unavailable.
 */

export function speechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  );
}

/**
 * Picks a calm male-sounding English voice where possible, falling back
 * to the first English voice, then the first available voice.
 */
export function pickCalmVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  const english = voices.filter((v) =>
    (v.lang || '').toLowerCase().startsWith('en')
  );
  const pool = english.length > 0 ? english : voices;

  const maleHints = [
    'google uk english male',
    'male',
    'daniel',
    'alex',
    'fred',
    'arthur',
    'oliver',
    'george',
  ];

  const male = pool.find((v) => {
    const name = (v.name || '').toLowerCase();
    return maleHints.some((hint) => name.includes(hint));
  });

  return male ?? pool[0] ?? null;
}

/**
 * The text spoken for a hadith: its reference, then the narrator + English
 * translation, then the Arabic. The device voice reads the English cleanly; the
 * Arabic is appended so the original wording is voiced where the device has an
 * Arabic voice (it is simply skipped by voices that cannot pronounce it).
 */
export function narrationText(hadith: Hadith): string {
  const parts = [hadith.reference];
  const english = [hadith.narrator, hadith.english].filter(Boolean).join(' ').trim();
  if (english) parts.push(english);
  if (hadith.arabic) parts.push(hadith.arabic);
  return parts.filter(Boolean).join('. ');
}

/**
 * Loads the device's TTS voices, handling the async `voiceschanged`
 * event (voices are often not ready on first synchronous read).
 */
export function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!speechSupported()) return;
    const synth = window.speechSynthesis;

    const load = () => {
      const list = synth.getVoices();
      if (list.length > 0) setVoices(list);
    };

    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, []);

  return voices;
}
