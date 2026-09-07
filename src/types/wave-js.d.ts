declare module '@redesigner/wave.js' {
  export type WaveRenderer = 'auto' | 'webgl2' | 'canvas2d' | 'css' | 'none'

  export type WaveParameters = {
    waveCount?: number
    speed?: number
    amplitude?: number
    frequency?: number
    opacity?: number
    thickness?: number
    blur?: number
    concentration?: number
    randomness?: number
    thicknessRandom?: number
    verticalOffset?: number
    rotation?: number
    lmLiquid?: number
    bloomThreshold?: number
    bloomIntensity?: number
    lumenIntensity?: number
    twistAmount?: number
  }

  export type WaveOptions = WaveParameters & {
    renderer?: WaveRenderer
    theme?: string
    colors?: string[]
    colorOpacities?: number[]
    splitFill?: boolean
    glass?: boolean
    liquidMetal?: boolean
    bloom?: boolean
    lumen?: boolean
    twist?: boolean
    pixelRatio?: number
    maxFPS?: number
  }

  export class WaveBackground {
    constructor(container: HTMLElement | string, options?: WaveOptions)
    readonly renderMode: Exclude<WaveRenderer, 'auto'>
    setParam(name: keyof WaveParameters, value: number): void
    setColors(colors: string[]): void
    setColorOpacities(opacities: number[]): void
    destroy(): void
  }
}
