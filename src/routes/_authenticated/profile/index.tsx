import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from '@/features/profile/profile'

export const Route = createFileRoute('/_authenticated/profile/')({
  component: SettingsProfile,
})
