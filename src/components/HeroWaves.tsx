import { WaveBackground } from '@redesigner/wave.js'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export type HeroWavesHandle = {
  update: (storm: number) => void
}

type HeroWavesProps = { motionEnabled: boolean }

export const HeroWaves = forwardRef<HeroWavesHandle, HeroWavesProps>(function HeroWaves({ motionEnabled }, ref) {
  const hostRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<WaveBackground | null>(null)
  const stormRef = useRef(0)

  const update = (storm: number) => {
    stormRef.current = storm
    const wave = waveRef.current
    if (!wave) return
    wave.setParam('speed', .2 + storm * .5)
    wave.setParam('amplitude', .026 + storm * .09)
    wave.setParam('frequency', 5.6 - storm * 1.2)
    wave.setParam('randomness', .2 + storm * .48)
    wave.setParam('thicknessRandom', .12 + storm * .42)
  }

  useImperativeHandle(ref, () => ({ update }), [])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const wave = new WaveBackground(host, {
      renderer: motionEnabled ? 'auto' : 'none',
      colors: ['#191511', '#2d1c15', '#70402f', '#d37a54'],
      colorOpacities: [1, 1, .88, .62],
      waveCount: 7,
      speed: .2,
      amplitude: .026,
      frequency: 5.6,
      opacity: .92,
      thickness: 2,
      blur: 1,
      concentration: 2.8,
      randomness: .2,
      thicknessRandom: .12,
      verticalOffset: -.04,
      splitFill: true,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      maxFPS: 45,
    })
    waveRef.current = wave
    host.dataset.renderer = wave.renderMode
    host.closest<HTMLElement>('.od-hero')?.setAttribute('data-water-renderer', wave.renderMode)
    update(stormRef.current)

    return () => {
      waveRef.current = null
      host.closest<HTMLElement>('.od-hero')?.removeAttribute('data-water-renderer')
      wave.destroy()
    }
  }, [motionEnabled])

  return <div ref={hostRef} className="od-webgl-water" data-renderer="pending" aria-hidden="true" />
})
