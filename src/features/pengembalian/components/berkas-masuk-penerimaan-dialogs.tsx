import { UsersActionDialog } from './berkas-masuk-penerimaan-action-dialog'
import { useRefPengembalian } from './berkas-masuk-penerimaan-provider'

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
