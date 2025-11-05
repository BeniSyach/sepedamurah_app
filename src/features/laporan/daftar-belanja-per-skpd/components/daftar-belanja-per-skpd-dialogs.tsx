import { UsersActionDialog } from './daftar-belanja-per-skpd-action-dialog'
import { useRefDaftarBelanjaSKPD } from './daftar-belanja-per-skpd-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefDaftarBelanjaSKPD()
  return (
    <>
      <UsersActionDialog
        key='daftar-belanja-per-skpd-lihat'
        open={open === 'lihat'}
        onOpenChange={() => setOpen('lihat')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`daftar-belanja-per-skpd-${currentRow.nm_opd}`}
            open={open === 'export'}
            onOpenChange={() => {
              setOpen('export')
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
