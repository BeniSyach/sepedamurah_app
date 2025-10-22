import { UsersActionDialog } from './berkas-masuk-sp2d-action-dialog'
import { useRefSp2dItem } from './berkas-masuk-sp2d-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSp2dItem()
  return (
    <>
      {currentRow && (
        <>
          <UsersActionDialog
            key={`berkas-masuk-sp2d-edit-${currentRow.id_sp2d}`}
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
