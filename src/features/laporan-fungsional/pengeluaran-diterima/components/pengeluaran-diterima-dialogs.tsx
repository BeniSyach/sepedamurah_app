import { UsersActionDialog } from './pengeluaran-diterima-action-dialog'
import { useRefLaporanFungsional } from './pengeluaran-diterima-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefLaporanFungsional()
  return (
    <>
      <UsersActionDialog
        key='Fungsional-pengeluaran-diterima-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`Fungsional-pengeluaran-diterima-lihat-${currentRow.id}`}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UsersActionDialog
            key={`Fungsional-pengeluaran-diterima-periksa-${currentRow.id}`}
            open={open === 'periksa'}
            onOpenChange={() => {
              setOpen('periksa')
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
