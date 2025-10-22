import { createFileRoute } from '@tanstack/react-router'
import { SettingsNotifications } from '@/features/profile/notifications'

export const Route = createFileRoute('/_authenticated/profile/notifications')({
  component: SettingsNotifications,
})
