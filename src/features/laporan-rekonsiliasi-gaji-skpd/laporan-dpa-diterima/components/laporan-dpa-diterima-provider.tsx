import React, { useState } from 'react'
import { type LaporanRekonsiliasiGajiSKPD } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefLaporanRekonsiliasiGajiSKPDDialogType =
  | 'lihat'
  | 'download'
  | 'periksa'
  | 'add'
  | 'downloadBerkasTTE'

type RefLaporanRekonsiliasiGajiSKPDContextType = {
  open: RefLaporanRekonsiliasiGajiSKPDDialogType | null
  setOpen: (str: RefLaporanRekonsiliasiGajiSKPDDialogType | null) => void
  currentRow: LaporanRekonsiliasiGajiSKPD | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<LaporanRekonsiliasiGajiSKPD | null>
  >
}

const RefLaporanRekonsiliasiGajiSKPDContext =
  React.createContext<RefLaporanRekonsiliasiGajiSKPDContextType | null>(null)

export function LaporanRekonsiliasiGajiSKPDProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefLaporanRekonsiliasiGajiSKPDDialogType>(null)
  const [currentRow, setCurrentRow] =
    useState<LaporanRekonsiliasiGajiSKPD | null>(null)

  return (
    <RefLaporanRekonsiliasiGajiSKPDContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefLaporanRekonsiliasiGajiSKPDContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefLaporanRekonsiliasiGajiSKPD = () => {
  const refLaporanRekonsiliasiGajiSKPDContext = React.useContext(
    RefLaporanRekonsiliasiGajiSKPDContext
  )

  if (!refLaporanRekonsiliasiGajiSKPDContext) {
    throw new Error(
      'useRefLaporanRekonsiliasiGajiSKPD has to be used within <RefLaporanRekonsiliasiGajiSKPDContext>'
    )
  }

  return refLaporanRekonsiliasiGajiSKPDContext
}
