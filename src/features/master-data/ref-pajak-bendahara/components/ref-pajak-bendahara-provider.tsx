import React, { useState } from 'react'
import { type RefPajakBendahara } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefRefPajakBendaharaDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefRefPajakBendaharaContextType = {
  open: RefRefPajakBendaharaDialogType | null
  setOpen: (str: RefRefPajakBendaharaDialogType | null) => void
  currentRow: RefPajakBendahara | null
  setCurrentRow: React.Dispatch<React.SetStateAction<RefPajakBendahara | null>>
}

const RefRefPajakBendaharaContext =
  React.createContext<RefRefPajakBendaharaContextType | null>(null)

export function RefPajakBendaharaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefRefPajakBendaharaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RefPajakBendahara | null>(null)

  return (
    <RefRefPajakBendaharaContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefRefPajakBendaharaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefRefPajakBendahara = () => {
  const refRefPajakBendaharaContext = React.useContext(
    RefRefPajakBendaharaContext
  )

  if (!refRefPajakBendaharaContext) {
    throw new Error(
      'useRefRefPajakBendahara has to be used within <RefRefPajakBendaharaContext>'
    )
  }

  return refRefPajakBendaharaContext
}
