import { useEffect, useState } from 'react';
import type { Card } from '../types';

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
 * The text spoken for a card: title + body, plus the translation when
 * present (Arabic script itself is left to the on-screen card).
 */
export function narrationText(card: Card): string {
  const parts = [card.title, card.body];
  if (card.translation) parts.push(card.translation);
  return parts.join('. ');
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
