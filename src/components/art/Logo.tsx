type LogoProps = {
  className?: string
  variant?: 'light' | 'dark'
}

const sources = {
  light: '/images/hackuta-logo.png',
  dark: '/images/hackuta-logo-white.png',
} as const

export function Logo({ className = '', variant = 'light' }: LogoProps) {
  return (
    <img
      src={sources[variant]}
      alt="HackUTA"
      className={className}
      width={52}
      height={52}
      decoding="async"
    />
  )
}
