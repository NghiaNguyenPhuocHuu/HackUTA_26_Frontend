import { useId } from 'react'

export function Waves({ className = '', tone = 'ink' }: { className?: string; tone?: 'ink' | 'clay' }) {
  const id = useId().replaceAll(':', '')
  return <svg className={className} viewBox="0 0 1440 240" preserveAspectRatio="none" fill="none" style={{ color: `var(--${tone})` }} aria-hidden="true">
    <defs><pattern id={id} width="160" height="52" patternUnits="userSpaceOnUse"><path d="M-80 34C-40 34-40 10 0 10s40 24 80 24 40-24 80-24 40 24 80 24" stroke="currentColor" strokeWidth="2" /><path d="M0 43c40 0 40-24 80-24s40 24 80 24" stroke="currentColor" strokeWidth="1" opacity=".35" /></pattern></defs>
    <path d="M0 14C160 14 200 36 360 22S610 0 820 19s430 9 620-5v226H0Z" fill={`url(#${id})`} />
  </svg>
}
