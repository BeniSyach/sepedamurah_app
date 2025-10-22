import { createFileRoute } from '@tanstack/react-router'
import { SettingsAccount } from '@/features/profile/account'

export const Route = createFileRoute('/_authenticated/profile/account')({
  component: SettingsAccount,
})
