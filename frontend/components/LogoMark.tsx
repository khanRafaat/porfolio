/** Brand mark: gradient tile + KR monogram. Same artwork as app/icon.svg. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="0.55" stopColor="#c026d3" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="lm-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="26" fill="url(#lm-bg)" />
      <rect width="100" height="52" rx="26" fill="url(#lm-sheen)" />
      {/* K — two strokes */}
      <path
        d="M30 28 L30 72"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M52 30 L33 50 L52 70"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* R suggested by a mirrored chevron — reads as code brackets too */}
      <path
        d="M62 30 L81 50 L62 70"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
      <circle cx="50" cy="84" r="4.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}
