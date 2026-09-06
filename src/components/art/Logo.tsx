type LogoProps = {
  className?: string
  variant?: 'light' | 'dark' | 'adaptive'
}

const sources = {
  light: '/images/hackuta-logo.png',
  dark: '/images/hackuta-logo-white.png',
} as const

export function Logo({ className = '', variant = 'light' }: LogoProps) {
  if (variant === 'adaptive') {
    return (
      <span className={`site-logo-stack ${className}`.trim()}>
        <img
          src={sources.light}
          alt="HackUTA"
          className="site-logo-variant site-logo-variant-light"
          width={52}
          height={52}
          decoding="sync"
        />
        <img
          src={sources.dark}
          alt=""
          className="site-logo-variant site-logo-variant-dark"
          width={52}
          height={52}
          decoding="sync"
        />
      </span>
    )
  }

  return (
    <img
      src={sources[variant]}
      alt="HackUTA"
      className={className}
      width={52}
      height={52}
      decoding="sync"
    />
  )
}
