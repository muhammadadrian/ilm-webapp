interface Props {
  onLogin: () => void;
}

/**
 * Login / sign-in screen. UI-only: every button simply advances the flow.
 * No real OAuth is performed and no network call is faked.
 */
export default function Login({ onLogin }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col bg-gradient-to-b from-emerald-950 to-emerald-900 text-white">
      {/* Brand / hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/15">
          <span className="arabic text-4xl font-bold text-sand-100">علم</span>
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">Ilm</h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
          1-minute of Islamic knowledge for the modern Muslim.
        </p>
      </div>

      {/* Sign-in options */}
      <div className="shrink-0 px-6 pb-8">
        <div className="mx-auto w-full max-w-md space-y-3">
          {/* Apple */}
          <button
            type="button"
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-black px-4 py-3 text-[15px] font-semibold text-white ring-1 ring-white/10 transition hover:bg-neutral-900"
          >
            <AppleLogo />
            Continue with Apple
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50"
          >
            <GoogleLogo />
            Continue with Google
          </button>

          {/* Microsoft */}
          <button
            type="button"
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50"
          >
            <MicrosoftLogo />
            Continue with Microsoft
          </button>

          {/* Guest */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={onLogin}
              className="text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Continue as guest
            </button>
          </div>

          {/* Honest demo note */}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-snug text-white/50">
            <span aria-hidden>ⓘ</span>
            Demo login — SSO not yet connected to a backend.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Inline brand logos (no external icon deps) ── */

function AppleLogo() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 3-.75.87-1.98 1.53-3.07 1.44-.14-1.09.42-2.24 1.1-2.99.76-.85 2.08-1.48 3.09-1.45zM20.9 17.1c-.55 1.27-.81 1.84-1.52 2.97-.99 1.57-2.39 3.53-4.12 3.54-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.98-1.73-.03-3.06-1.79-4.05-3.36C-.02 16.9-.29 11.28 2.11 8.32c1.06-1.34 2.73-2.19 4.29-2.19 1.59 0 2.59 1.02 3.9 1.02 1.27 0 2.05-1.02 3.89-1.02 1.4 0 2.88.76 3.94 2.08-3.46 1.9-2.9 6.84.77 8.89z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 23 23">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}
