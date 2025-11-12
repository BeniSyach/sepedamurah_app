import { PengembalianRekapExcel } from './pengembalian-export-excel-dialog'
import { PengembalianRekapPdf } from './pengembalian-export-pdf-dialog'
import { useRefPengembalian } from './pengembalian-provider'

export function UsersDialogs() {
  const { open, setOpen } = useRefPengembalian()
  return (
    <>
      <PengembalianRekapExcel
        key='pengembalian-excel'
        open={open === 'export_excel'}
        onOpenChange={() => setOpen('export_excel')}
      />

      <PengembalianRekapPdf
        key='pengembalian-pdf'
        open={open === 'export_pdf'}
        onOpenChange={() => setOpen('export_pdf')}
      />
    </>
  )
}
