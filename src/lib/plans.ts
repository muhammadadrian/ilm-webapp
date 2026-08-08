/**
 * Monetization / support options shown as plan cards on the Profile page.
 *
 * Three kinds:
 *   free    — the current free tier (default current plan)
 *   premium — paid subscription tiers; choosing one flips the existing
 *             `ilm.premium` gate on (mock, consistent with the Listen toggle)
 *   give    — charitable giving (Waqf / sponsor-a-student), NOT a personal
 *             subscription; framed as ongoing charity (sadaqah jariyah)
 *
 * All actions are UI-only for the prototype — no payment is connected.
 */

export type PlanKind = 'free' | 'premium' | 'give';

export interface Plan {
  id: string;
  kind: PlanKind;
  title: string;
  description: string;
  /** Label for the primary action button in its default (not-chosen) state. */
  action: string;
  icon: string;
}

/** localStorage key recording which plan the user last chose (display only). */
export const PLAN_KEY = 'ilm.plan';

export const PLANS: Plan[] = [
  {
    id: 'free',
    kind: 'free',
    title: 'Free core library',
    description: 'The full daily feed, hadith, saves and ranking — always free.',
    action: 'Current plan',
    icon: '📖',
  },
  {
    id: 'premium-deep-dives',
    kind: 'premium',
    title: 'Premium deep dives',
    description: 'Long-form tafsir and topic explainers that go beyond the 1-minute card.',
    action: 'Upgrade',
    icon: '🕮',
  },
  {
    id: 'audio-reflections',
    kind: 'premium',
    title: 'Audio reflections',
    description: 'Narrated reflections with background listening — commute and learn.',
    action: 'Upgrade',
    icon: '🎧',
  },
  {
    id: 'scholar-commentary',
    kind: 'premium',
    title: 'Scholar commentary packs',
    description: 'Curated commentary sets from qualified scholars on key topics.',
    action: 'Upgrade',
    icon: '🧕',
  },
  {
    id: 'offline-library',
    kind: 'premium',
    title: 'Offline library',
    description: 'Download cards and audio to keep learning without a connection.',
    action: 'Upgrade',
    icon: '⬇️',
  },
  {
    id: 'family-plan',
    kind: 'premium',
    title: 'Family plan',
    description: 'Premium for up to six family members under one household.',
    action: 'Upgrade',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'waqf',
    kind: 'give',
    title: 'Waqf / sponsorship support',
    description:
      'Endow ongoing knowledge as a sadaqah jariyah — a continuing charity whose reward flows on.',
    action: 'Give',
    icon: '🕌',
  },
  {
    id: 'sponsor-student',
    kind: 'give',
    title: 'Sponsor a student',
    description:
      'Fund free Premium access for students of knowledge who cannot afford it.',
    action: 'Sponsor',
    icon: '🤲',
  },
];

/** All premium plan ids, for gating logic. */
export const PREMIUM_PLAN_IDS = PLANS.filter((p) => p.kind === 'premium').map(
  (p) => p.id
);
