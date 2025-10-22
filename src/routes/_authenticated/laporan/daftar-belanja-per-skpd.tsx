import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute(
  '/_authenticated/laporan/daftar-belanja-per-skpd'
)({
  component: ComingSoon,
})
