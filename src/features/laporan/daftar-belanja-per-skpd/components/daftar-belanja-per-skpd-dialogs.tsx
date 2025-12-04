import { DetailPerSKPD } from './daftar-belanja-per-skpd-action-dialog'
import { useRefDaftarBelanjaSKPD } from './daftar-belanja-per-skpd-provider'

export function DaftarBelanjaPerSKPDDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefDaftarBelanjaSKPD()
  return (
    <>
      {currentRow && (
        <>
          <DetailPerSKPD
            key={`daftar-belanja-per-skpd-${currentRow.nm_opd}`}
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
