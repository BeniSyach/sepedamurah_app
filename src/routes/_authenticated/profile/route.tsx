import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/profile'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Settings,
})
