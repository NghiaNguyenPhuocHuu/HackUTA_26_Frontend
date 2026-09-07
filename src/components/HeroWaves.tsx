import { WaveBackground } from '@redesigner/wave.js'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

type HeroWavesHandle = {
  update: (storm: number) => void
}

type HeroWavesProps = {
  motionEnabled: boolean
  storm: number
}

export const HeroWaves = forwardRef<HeroWavesHandle, HeroWavesProps>(function HeroWaves({ motionEnabled, storm }, ref) {
  const hostRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<WaveBackground | null>(null)
  const stormRef = useRef(storm)

  const update = (storm: number) => {
    stormRef.current = storm
    const wave = waveRef.current
    if (!wave) return
    wave.setParam('speed', .2 + storm * .5)
    wave.setParam('amplitude', .026 + storm * .09)
    wave.setParam('frequency', 7.2 - storm * 1.2)
    wave.setParam('randomness', .2 + storm * .48)
    wave.setParam('thicknessRandom', .12 + storm * .42)
  }

  useImperativeHandle(ref, () => ({ update }), [])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const wave = new WaveBackground(host, {
      renderer: motionEnabled ? 'auto' : 'none',
      colors: ['#102f46', '#1a3a52', '#305873', '#637d8d'],
      colorOpacities: [1, 1, .88, .62],
      waveCount: 12,
      speed: .2,
      amplitude: .026,
      frequency: 7.2,
      opacity: .92,
      thickness: 2,
      blur: 1,
      concentration: 2.8,
      randomness: .2,
      thicknessRandom: .12,
      verticalOffset: .22,
      splitFill: true,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      maxFPS: 45,
    })
    waveRef.current = wave
    host.dataset.renderer = wave.renderMode
    const hero = host.closest<HTMLElement>('.od-hero')
    hero?.setAttribute('data-water-renderer', wave.renderMode)
    update(stormRef.current)

    const canvas = host.querySelector('canvas')
    const hide = () => {
      host.dataset.renderer = 'pending'
      hero?.removeAttribute('data-water-renderer')
    }
    const onLost = (event: Event) => {
      event.preventDefault()
      hide()
    }
    const onRestored = () => {
      host.dataset.renderer = wave.renderMode
      hero?.setAttribute('data-water-renderer', wave.renderMode)
      update(stormRef.current)
    }
    canvas?.addEventListener('webglcontextlost', onLost)
    canvas?.addEventListener('webglcontextrestored', onRestored)

    return () => {
      waveRef.current = null
      canvas?.removeEventListener('webglcontextlost', onLost)
      canvas?.removeEventListener('webglcontextrestored', onRestored)
      hide()
      wave.destroy()
    }
  }, [motionEnabled])

  useEffect(() => {
    stormRef.current = storm
    update(storm)
  }, [storm])

  return <div ref={hostRef} className="od-webgl-water" data-renderer="pending" aria-hidden="true" />
})
