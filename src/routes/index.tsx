import { createFileRoute } from '@tanstack/react-router'
import { CompanyProfile } from '@/features/home'

export const Route = createFileRoute('/')({
  component: CompanyProfile,
})
