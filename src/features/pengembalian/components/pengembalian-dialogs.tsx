import { useState } from 'react'
import { useGetDatRekening } from '@/api'
import { Dialog, DialogContentLarge } from '@/components/ui/dialog'
import { DatRekeningItemTable } from '../referensi-rekening/ref-rekening-pengembalian-table'
import { PengembalianRekapExcel } from './pengembalian-export-excel-dialog'
import { PengembalianRekapPdf } from './pengembalian-export-pdf-dialog'
import { useRefPengembalian } from './pengembalian-provider'

export function UsersDialogs() {
  const { open, setOpen } = useRefPengembalian()
  const [detailPage, setDetailPage] = useState(1)
  const [detailPageSize, setDetailPageSize] = useState(10)
  const [detailSearch, setDetailSearch] = useState('')
  const { data, isLoading, isError } = useGetDatRekening({
    page: detailPage,
    perPage: detailPageSize,
    search: detailSearch,
    enabled: open === 'referensi', // fetch hanya ketika dialog dibuka
  })
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
      {/* {currentRow && ( */}
      <>
        <Dialog
          open={open === 'referensi'}
          onOpenChange={(state) => setOpen(state ? 'referensi' : null)}
        >
          <DialogContentLarge title='  Referensi Rekening Pengembalian'>
            {/* LOADING */}
            {isLoading && <p>Loading...</p>}

            {/* ERROR */}
            {isError && <p>Gagal memuat data</p>}

            {/* TABEL DETAIL */}
            {data && (
              <DatRekeningItemTable
                data={data.data ?? []}
                meta={data}
                search={detailSearch}
                onSearchChange={setDetailSearch}
                page={detailPage}
                pageSize={detailPageSize}
                onPageChange={setDetailPage}
                onPageSizeChange={setDetailPageSize}
              />
            )}
          </DialogContentLarge>
        </Dialog>
      </>
      {/* )} */}
    </>
  )
}
