import React, { useState } from 'react'
import { type DaftarBelanjaSKPD } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefDaftarBelanjaSKPDDialogType = 'lihat' | 'export'

type RefDaftarBelanjaSKPDContextType = {
  open: RefDaftarBelanjaSKPDDialogType | null
  setOpen: (str: RefDaftarBelanjaSKPDDialogType | null) => void
  currentRow: DaftarBelanjaSKPD | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DaftarBelanjaSKPD | null>>
}

const RefDaftarBelanjaSKPDContext =
  React.createContext<RefDaftarBelanjaSKPDContextType | null>(null)

export function DaftarBelanjaSKPDProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefDaftarBelanjaSKPDDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DaftarBelanjaSKPD | null>(null)

  return (
    <RefDaftarBelanjaSKPDContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefDaftarBelanjaSKPDContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefDaftarBelanjaSKPD = () => {
  const refDaftarBelanjaSKPDContext = React.useContext(
    RefDaftarBelanjaSKPDContext
  )

  if (!refDaftarBelanjaSKPDContext) {
    throw new Error(
      'useRefDaftarBelanjaSKPD has to be used within <RefDaftarBelanjaSKPDContext>'
    )
  }

  return refDaftarBelanjaSKPDContext
}
