import { UsersActionDialog } from './laporan-realisasi-sumber-dana-action-dialog'
import { useRefPengembalian } from './laporan-realisasi-sumber-dana-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPengembalian()
  return (
    <>
      <UsersActionDialog
        key='pengembalian-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`pengembalian-edit-${currentRow.no_sts}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
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
