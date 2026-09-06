type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src="/images/hackuta-logo.png"
      alt="HackUTA"
      className={className}
      width={52}
      height={52}
      decoding="async"
    />
  )
}
