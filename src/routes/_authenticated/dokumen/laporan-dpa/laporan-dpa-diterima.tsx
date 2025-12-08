import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-dpa/laporan-dpa-diterima',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_authenticated/dokumen/laporan-dpa/laporan-dpa-diterima"!</div>
  )
}
