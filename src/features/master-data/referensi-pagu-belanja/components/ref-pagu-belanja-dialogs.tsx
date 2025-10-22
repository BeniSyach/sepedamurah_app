import { UsersActionDialog } from './ref-pagu-belanja-action-dialog'
import { RefPaguBelanjasDeleteDialog } from './ref-pagu-belanja-delete-dialog'
import { useRefPaguBelanja } from './ref-pagu-belanja-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPaguBelanja()
  return (
    <>
      <UsersActionDialog
        key='pagu-belanja-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`pagu-belanja-edit-${currentRow.id_pb}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <RefPaguBelanjasDeleteDialog
            key={`pagu-belanja-delete-${currentRow.id_pb}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
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
