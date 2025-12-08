import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dokumen/laporan-dpa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/dokumen/laporan-dpa"!</div>
}
