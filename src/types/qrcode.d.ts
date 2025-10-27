declare module 'qrcode' {
  interface ToOptions {
    errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high'
    type?: 'image/png' | 'image/jpeg' | 'image/webp'
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
  }

  function toDataURL(text: string, options?: ToOptions): Promise<string>

  function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: ToOptions
  ): Promise<HTMLCanvasElement>

  export default {
    toDataURL,
    toCanvas,
  }
}
