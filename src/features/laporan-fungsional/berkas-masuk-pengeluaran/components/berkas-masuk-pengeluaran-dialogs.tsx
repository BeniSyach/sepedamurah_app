import { UsersActionDialog } from './berkas-masuk-pengeluaran-action-dialog'
import { useRefLaporanFungsional } from './berkas-masuk-pengeluaran-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefLaporanFungsional()
  return (
    <>
      {currentRow && (
        <>
          <UsersActionDialog
            key={`berkas-masuk-pengeluaran-edit-${currentRow.id}`}
            open={open === 'periksa'}
            onOpenChange={() => {
              setOpen('periksa')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UsersActionDialog
            key={`berkas-masuk-pengeluaran-lihat-${currentRow.id}`}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
