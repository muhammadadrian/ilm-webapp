import { useState } from 'react';
import { PLANS, PLAN_KEY, PREMIUM_PLAN_IDS } from '../lib/plans';
import type { Plan } from '../lib/plans';
import { usePersistentString } from '../lib/storage';

interface Props {
  /** The shared `ilm.premium` gate value (owned by the parent Profile). */
  premium: boolean;
  /** Setter for the shared premium gate, so cards flip it live. */
  setPremium: (value: boolean) => void;
}

/**
 * Monetization / support screen rendered as plan cards.
 *
 * Premium tiers share the single existing `ilm.premium` gate (the same flag the
 * Listen screen toggles): choosing any premium plan flips premium on and
 * records the chosen tier in `ilm.plan` for display. The Free plan turns
 * premium back off. Waqf and sponsor-a-student are charitable giving, not
 * subscriptions, and never touch the premium gate.
 *
 * Every action is UI-only — no payment is connected.
 */
export default function Plans({ premium, setPremium }: Props) {
  const [plan, setPlan] = usePersistentString(PLAN_KEY, 'free');
  const [gave, setGave] = useState<string | null>(null);

  // The plan currently treated as active for badge display.
  const currentPlanId = premium
    ? PREMIUM_PLAN_IDS.includes(plan)
      ? plan
      : '' // premium on but no specific tier (e.g. toggled from Listen)
    : 'free';

  const choosePremium = (id: string) => {
    setPremium(true);
    setPlan(id);
  };

  const chooseFree = () => {
    setPremium(false);
    setPlan('free');
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white/70">
          Plans &amp; support
        </h3>
        {premium && (
          <span
            data-testid="plans-premium-badge"
            className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-950"
          >
            ★ Premium active
          </span>
        )}
      </div>

      {/* Global demo disclaimer */}
      <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-amber-100 px-3 py-2 text-[11px] leading-snug text-amber-900">
        <span aria-hidden className="pt-px">
          ⓘ
        </span>
        <span>
          <span className="font-bold">Demo — payments not connected.</span> Every
          button here is UI-only; nothing is charged, subscribed, or donated.
        </span>
      </p>

      <ul data-testid="plan-list" className="mt-3 space-y-2.5">
        {PLANS.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            premium={premium}
            isCurrent={p.id === currentPlanId}
            gave={gave === p.id}
            onChoosePremium={() => choosePremium(p.id)}
            onChooseFree={chooseFree}
            onGive={() => setGave(p.id)}
          />
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-snug text-white/50">
        <span aria-hidden className="pt-px">
          🤲
        </span>
        <span>
          Waqf and sponsorship are ongoing charity (sadaqah jariyah), not a
          personal subscription — may Allah accept it. A real payment provider
          would be wired up before any of this goes live.
        </span>
      </p>
    </div>
  );
}

function PlanCard({
  plan,
  premium,
  isCurrent,
  gave,
  onChoosePremium,
  onChooseFree,
  onGive,
}: {
  plan: Plan;
  premium: boolean;
  isCurrent: boolean;
  gave: boolean;
  onChoosePremium: () => void;
  onChooseFree: () => void;
  onGive: () => void;
}) {
  return (
    <li
      data-testid={`plan-${plan.id}`}
      data-plan-kind={plan.kind}
      className={
        'rounded-2xl p-4 ring-1 transition ' +
        (isCurrent
          ? 'bg-white/15 ring-amber-300/50'
          : 'bg-white/5 ring-white/10')
      }
    >
      <div className="flex items-start gap-3">
        <span aria-hidden className="mt-0.5 text-2xl leading-none">
          {plan.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">
            {plan.title}
            {isCurrent && (
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-950">
                Current plan
              </span>
            )}
            {plan.kind === 'premium' && premium && !isCurrent && (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/80">
                Included
              </span>
            )}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-white/70">
            {plan.description}
          </p>

          {/* Action */}
          <div className="mt-3">
            <PlanAction
              plan={plan}
              premium={premium}
              isCurrent={isCurrent}
              onChoosePremium={onChoosePremium}
              onChooseFree={onChooseFree}
              onGive={onGive}
            />
          </div>

          {gave && plan.kind === 'give' && (
            <p
              data-testid={`give-note-${plan.id}`}
              role="status"
              className="mt-2 rounded-xl bg-white/10 px-3 py-2 text-[12px] leading-snug text-white/80 ring-1 ring-white/15"
            >
              JazakAllahu khayran for your intention. Demo only — no payment was
              taken.
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

function PlanAction({
  plan,
  premium,
  isCurrent,
  onChoosePremium,
  onChooseFree,
  onGive,
}: {
  plan: Plan;
  premium: boolean;
  isCurrent: boolean;
  onChoosePremium: () => void;
  onChooseFree: () => void;
  onGive: () => void;
}) {
  const primary =
    'rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-emerald-950 shadow transition hover:bg-amber-300';
  const secondary =
    'rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15';

  if (plan.kind === 'free') {
    if (!premium) {
      return (
        <span
          data-testid="plan-action-free"
          className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/60 ring-1 ring-white/15"
        >
          Current plan
        </span>
      );
    }
    return (
      <button
        type="button"
        data-testid="plan-action-free"
        onClick={onChooseFree}
        className={secondary}
      >
        Switch to Free
      </button>
    );
  }

  if (plan.kind === 'premium') {
    if (isCurrent) {
      return (
        <button
          type="button"
          data-testid={`plan-action-${plan.id}`}
          onClick={onChooseFree}
          className={secondary}
        >
          Cancel Premium
        </button>
      );
    }
    return (
      <button
        type="button"
        data-testid={`plan-action-${plan.id}`}
        onClick={onChoosePremium}
        className={premium ? secondary : primary}
      >
        {premium ? 'Switch to this' : plan.action}
      </button>
    );
  }

  // give
  return (
    <button
      type="button"
      data-testid={`plan-action-${plan.id}`}
      onClick={onGive}
      className={primary}
    >
      {plan.action}
    </button>
  );
}
