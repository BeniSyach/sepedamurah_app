declare module 'react-google-recaptcha' {
  import * as React from 'react'

  export interface ReCAPTCHAProps {
    sitekey: string
    onChange?: (token: string | null) => void
    onExpired?: () => void
    theme?: 'light' | 'dark'
    size?: 'compact' | 'normal' | 'invisible'
  }

  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {}
}
