import { UsersActionDialog } from './permohonan-spd-bud-tte-action-dialog'
import { useRefPermohonanSpd } from './permohonan-spd-bud-tte-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()
  return (
    <>
      {currentRow && (
        <>
          <UsersActionDialog
            key={`akses-kuasa-bud-periksa-${currentRow.id}`}
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
            key={`akses-kuasa-bud-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UsersActionDialog
            key={`akses-kuasa-bud-tolak-${currentRow.id}`}
            open={open === 'tolak'}
            onOpenChange={() => {
              setOpen('tolak')
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
