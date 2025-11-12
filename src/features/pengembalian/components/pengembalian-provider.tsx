import React, { useState } from 'react'
import { type Pengembalian } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefPengembalianDialogType = 'export_excel' | 'export_pdf' | 'referensi'

type RefPengembalianContextType = {
  open: RefPengembalianDialogType | null
  setOpen: (str: RefPengembalianDialogType | null) => void
  currentRow: Pengembalian | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Pengembalian | null>>
}

const RefPengembalianContext =
  React.createContext<RefPengembalianContextType | null>(null)

export function PengembalianProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefPengembalianDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Pengembalian | null>(null)

  return (
    <RefPengembalianContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefPengembalianContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefPengembalian = () => {
  const refPengembalianContext = React.useContext(RefPengembalianContext)

  if (!refPengembalianContext) {
    throw new Error(
      'useRefPengembalian has to be used within <RefPengembalianContext>'
    )
  }

  return refPengembalianContext
}
