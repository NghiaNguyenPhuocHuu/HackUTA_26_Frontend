import { useEffect, useState } from 'react'

export function useMotionPreference() {
  const [motionEnabled, setMotionEnabled] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off'
  }, [motionEnabled])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionEnabled(!media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return { motionEnabled }
}
