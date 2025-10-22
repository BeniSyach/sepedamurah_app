import { UsersActionDialog } from './realisasi-tf-sumber-dana-action-dialog'
import { RefRealisasiTransferSumberDanasDeleteDialog } from './realisasi-tf-sumber-dana-delete-dialog'
import { useRefRealisasiTransferSumberDana } from './realisasi-tf-sumber-dana-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useRefRealisasiTransferSumberDana()
  return (
    <>
      <UsersActionDialog
        key='master-skpd-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`master-skpd-edit-${currentRow.kd_ref1}-${currentRow.kd_ref2}-${currentRow.kd_ref3}-${currentRow.kd_ref4}-${currentRow.kd_ref5}-${currentRow.kd_ref6}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <RefRealisasiTransferSumberDanasDeleteDialog
            key={`master-skpd-delete-${currentRow.kd_ref1}-${currentRow.kd_ref2}-${currentRow.kd_ref3}-${currentRow.kd_ref4}-${currentRow.kd_ref5}-${currentRow.kd_ref6}`}
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
