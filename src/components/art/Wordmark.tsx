export function Wordmark({ className = '', light = false }: { className?: string; light?: boolean }) {
  return <svg className={className} viewBox="0 0 830 120" fill="currentColor" style={light ? { color: 'var(--sand)' } : undefined} role="img" aria-label="HackUTA">
    <g fillRule="evenodd">
      <path d="M0 0h34l-4 12v37h40V12L66 0h34l-4 12v96l4 12H66l4-12V70H30v38l4 12H0l4-12V12Z" />
      <path transform="translate(116)" d="m0 120 43-120h24l43 120H78L68 90H39l-10 30ZM46 69h16L54 43Z" />
      <path transform="translate(242)" d="M100 0H23L0 23v74l23 23h77V86H75v11H33V23h42v11h25Z" />
      <path transform="translate(360)" d="M0 0h34l-4 12v38L71 0h35L56 58l53 62H71L30 71v37l4 12H0l4-12V12Z" />
      <path transform="translate(480)" d="M0 0h34l-4 12v81l7 7h30l7-7V12L70 0h34l-4 12v89l-19 19H23L4 101V12Z" />
      <path transform="translate(600)" d="M0 0h105v31l-12-8H68v85l4 12H33l4-12V23H12L0 31Z" />
      <path transform="translate(720)" d="m0 120 43-120h24l43 120H78L68 90H39l-10 30ZM46 69h16L54 43Z" />
    </g>
  </svg>
}
