import { RekapExcelLRABelanja } from './laporan-realisasi-belanja-export-excel-dialog'
import { RekapPDFLRABelanja } from './laporan-realisasi-belanja-export-pdf-dialog'
import { useRefPengembalian } from './laporan-realisasi-belanja-provider'

export function UsersDialogs() {
  const { open, setOpen } = useRefPengembalian()
  return (
    <>
      <RekapPDFLRABelanja
        key='LRA-Belanja-pdf'
        open={open === 'export-pdf'}
        onOpenChange={() => setOpen('export-pdf')}
      />
      <RekapExcelLRABelanja
        key='LRA-Belanja-excel'
        open={open === 'export-excel'}
        onOpenChange={() => setOpen('export-excel')}
      />
    </>
  )
}
