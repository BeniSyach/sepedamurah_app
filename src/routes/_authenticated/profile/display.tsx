import { createFileRoute } from '@tanstack/react-router'
import { SettingsDisplay } from '@/features/profile/display'

export const Route = createFileRoute('/_authenticated/profile/display')({
  component: SettingsDisplay,
})
