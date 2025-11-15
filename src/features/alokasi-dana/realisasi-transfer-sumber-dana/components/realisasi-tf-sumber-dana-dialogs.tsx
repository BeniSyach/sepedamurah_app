import { useState } from 'react'
import { useGetRealisasiTransferSumberSumberDana } from '@/api'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Dialog, DialogContentLarge, DialogTitle } from '@/components/ui/dialog'
import { RealisasiTransferSumberDanaTable } from '../detail-transfer-sd/components/detail-transfer-sd-table'
import { UsersActionDialog } from './realisasi-tf-sumber-dana-action-dialog'
import { useRefRekapSumberDanaItem } from './realisasi-tf-sumber-dana-provider'

export function UsersDialogs({ tahun }: { tahun: string | number }) {
  const { open, setOpen, currentRow } = useRefRekapSumberDanaItem()
  const [detailPage, setDetailPage] = useState(1)
  const [detailPageSize, setDetailPageSize] = useState(10)
  const [detailSearch, setDetailSearch] = useState('')
  // 🔥 GET API DETAIL
  const { data, isLoading, isError } = useGetRealisasiTransferSumberSumberDana({
    page: detailPage,
    perPage: detailPageSize,
    search: detailSearch,
    tahun: tahun,
    kd_ref1: currentRow?.kd_ref1,
    kd_ref2: currentRow?.kd_ref2,
    kd_ref3: currentRow?.kd_ref3,
    kd_ref4: currentRow?.kd_ref4,
    kd_ref5: currentRow?.kd_ref5,
    kd_ref6: currentRow?.kd_ref6,
    enabled: open === 'detail', // fetch hanya ketika dialog dibuka
  })

  return (
    <>
      <UsersActionDialog
        key='realisasi-tf-sd-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          {/* Dialog untuk TABEL DETAIL */}
          <Dialog
            open={open === 'detail'}
            onOpenChange={(state) => setOpen(state ? 'detail' : null)}
          >
            <DialogContentLarge>
              <AlertDialogHeader>
                <DialogTitle className='py-2'>
                  Detail Realisasi Transfer
                </DialogTitle>
              </AlertDialogHeader>

              {/* LOADING */}
              {isLoading && <p>Loading...</p>}

              {/* ERROR */}
              {isError && <p>Gagal memuat data</p>}

              {/* TABEL DETAIL */}
              {data && (
                <RealisasiTransferSumberDanaTable
                  data={data.data ?? []}
                  meta={data.meta}
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
      )}
    </>
  )
}
