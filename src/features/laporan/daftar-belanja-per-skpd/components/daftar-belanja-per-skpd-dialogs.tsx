import { DetailPerSKPD } from './daftar-belanja-per-skpd-action-dialog'
import { useRefDaftarBelanjaSKPD } from './daftar-belanja-per-skpd-provider'

export function DaftarBelanjaPerSKPDDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefDaftarBelanjaSKPD()
  return (
    <>
      <DetailPerSKPD
        key='daftar-belanja-per-skpd-lihat'
        open={open === 'lihat'}
        onOpenChange={() => setOpen('lihat')}
      />

      {currentRow && (
        <>
          <DetailPerSKPD
            key={`daftar-belanja-per-skpd-${currentRow.nm_opd}`}
            open={open === 'export'}
            onOpenChange={() => {
              setOpen('export')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
          />
        </>
      )}
    </>
  )
}
