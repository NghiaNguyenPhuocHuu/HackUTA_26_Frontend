declare module '@redesigner/wave.js' {
  export type WaveRenderer = 'auto' | 'webgl2' | 'canvas2d' | 'css' | 'none'

  export type WaveOptions = {
    renderer?: WaveRenderer
    theme?: string
    colors?: string[]
    colorOpacities?: number[]
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
    setParam(name: string, value: number): void
    setColors(colors: string[]): void
    setColorOpacities(opacities: number[]): void
    destroy(): void
  }
}
