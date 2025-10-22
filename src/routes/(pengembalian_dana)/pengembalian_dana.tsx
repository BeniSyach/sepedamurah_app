import { createFileRoute } from '@tanstack/react-router'
import PengembalianDanaForm from '@/features/pengembalian_dana'

export const Route = createFileRoute('/(pengembalian_dana)/pengembalian_dana')({
  component: PengembalianDanaForm,
})
