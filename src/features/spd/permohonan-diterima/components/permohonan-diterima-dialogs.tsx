import { PermohonanSPDsActionDialog } from '../../permohonan-spd/components/permohonan-spd-action-dialog'
import { UsersActionDialog } from './permohonan-diterima-action-dialog'
import { useRefPermohonanSpd } from './permohonan-diterima-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()
  return (
    <>
      <UsersActionDialog
        key='akses-kuasa-bud-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <PermohonanSPDsActionDialog
            key={`spd-diterima-periksa-${currentRow.id}`}
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
