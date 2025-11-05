import { createFileRoute } from '@tanstack/react-router'
import { LaporanPembukuan } from '@/features/laporan/laporan-pembukuan'

export const Route = createFileRoute('/_authenticated/laporan/buku-laporan')({
  component: LaporanPembukuan,
})
