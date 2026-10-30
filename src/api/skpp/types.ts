import type { SkppData } from '@/features/skpp/types'

export interface SkppResponse {
  success: boolean
  message: string
  data: SkppData[]
  meta?: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from?: number
    to?: number
  }
}

export interface SingleSkppResponse {
  success: boolean
  message: string
  data: SkppData
}
