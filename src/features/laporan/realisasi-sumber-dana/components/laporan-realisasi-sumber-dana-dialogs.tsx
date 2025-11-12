import { RekapExcelLRASD } from './laporan-realisasi-sumber-dana-export-excel-dialog'
import { RekapPDFLRASD } from './laporan-realisasi-sumber-dana-export-pdf-dialog'
import { useRefPengembalian } from './laporan-realisasi-sumber-dana-provider'

export function UsersDialogs() {
  const { open, setOpen } = useRefPengembalian()
  return (
    <>
      <RekapPDFLRASD
        key='LRASD-pdf'
        open={open === 'export-pdf'}
        onOpenChange={() => setOpen('export-pdf')}
      />

      <RekapExcelLRASD
        key='LRASD-excel'
        open={open === 'export-excel'}
        onOpenChange={() => setOpen('export-excel')}
      />
    </>
  )
}
