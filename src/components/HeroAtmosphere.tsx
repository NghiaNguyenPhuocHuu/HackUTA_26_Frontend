import { Dithering, type PaperShaderElement } from '@paper-design/shaders-react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'

type HeroAtmosphereHandle = {
  update: (progress: number, storm: number) => void
}

type HeroAtmosphereProps = {
  motionEnabled: boolean
  storm: number
}

export const HeroAtmosphere = forwardRef<HeroAtmosphereHandle, HeroAtmosphereProps>(function HeroAtmosphere({ motionEnabled, storm }, ref) {
  const shaderRef = useRef<PaperShaderElement>(null)
  const stateRef = useRef({ progress: 0, storm })

  const update = useCallback((progress: number, storm: number) => {
    stateRef.current = { progress, storm }
    const shader = shaderRef.current?.paperShaderMount
    if (!shader) return
    shader.setSpeed(motionEnabled ? .07 + storm * .31 : 0)
    shader.setUniforms({
      u_pxSize: 6 - storm * 2.4,
      u_offsetX: (progress - .5) * .12,
      u_scale: .72 - storm * .08,
    })
  }, [motionEnabled])

  useImperativeHandle(ref, () => ({ update }), [update])

  useEffect(() => {
    const element = shaderRef.current
    if (!element) return
    const hero = element.closest<HTMLElement>('.od-hero')
    let canvas: HTMLCanvasElement | null = null

    const hide = () => {
      element.dataset.renderer = 'pending'
      hero?.removeAttribute('data-weather-renderer')
    }

    const onLost = (event: Event) => {
      event.preventDefault()
      hide()
    }

    const onRestored = () => {
      markReady()
    }

    const bindCanvas = (next: HTMLCanvasElement) => {
      if (canvas === next) return
      canvas?.removeEventListener('webglcontextlost', onLost)
      canvas?.removeEventListener('webglcontextrestored', onRestored)
      canvas = next
      canvas.addEventListener('webglcontextlost', onLost)
      canvas.addEventListener('webglcontextrestored', onRestored)
    }

    const markReady = () => {
      const nextCanvas = element.querySelector('canvas')
      const ready = Boolean(element.paperShaderMount && nextCanvas)
      if (ready && nextCanvas) {
        bindCanvas(nextCanvas)
        element.dataset.renderer = 'webgl'
        hero?.setAttribute('data-weather-renderer', 'paper-webgl')
        update(stateRef.current.progress, stateRef.current.storm)
      }
      return ready
    }

    let frame = 0
    const waitForMount = () => {
      if (!markReady()) frame = requestAnimationFrame(waitForMount)
    }
    waitForMount()
    return () => {
      cancelAnimationFrame(frame)
      canvas?.removeEventListener('webglcontextlost', onLost)
      canvas?.removeEventListener('webglcontextrestored', onRestored)
      hide()
    }
  }, [update])

  useEffect(() => {
    stateRef.current.storm = storm
    update(stateRef.current.progress, storm)
  }, [storm, update])

  return (
    <Dithering
      ref={shaderRef}
      className="od-weather-shader"
      data-renderer="pending"
      colorBack="#d8cbb8"
      colorFront="#305873"
      shape="warp"
      type="8x8"
      size={6}
      speed={motionEnabled ? .07 : 0}
      frame={1260}
      scale={.72}
      rotation={4}
      offsetY={-.12}
      width="100%"
      height="100%"
      minPixelRatio={1}
      maxPixelCount={1_200_000}
      aria-hidden="true"
    />
  )
})
