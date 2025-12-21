import React, { useState } from 'react'
import { type RefAssetBendahara } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefRefAssetBendaharaDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefRefAssetBendaharaContextType = {
  open: RefRefAssetBendaharaDialogType | null
  setOpen: (str: RefRefAssetBendaharaDialogType | null) => void
  currentRow: RefAssetBendahara | null
  setCurrentRow: React.Dispatch<React.SetStateAction<RefAssetBendahara | null>>
}

const RefRefAssetBendaharaContext =
  React.createContext<RefRefAssetBendaharaContextType | null>(null)

export function RefAssetBendaharaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefRefAssetBendaharaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RefAssetBendahara | null>(null)

  return (
    <RefRefAssetBendaharaContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefRefAssetBendaharaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefRefAssetBendahara = () => {
  const refRefAssetBendaharaContext = React.useContext(
    RefRefAssetBendaharaContext
  )

  if (!refRefAssetBendaharaContext) {
    throw new Error(
      'useRefRefAssetBendahara has to be used within <RefRefAssetBendaharaContext>'
    )
  }

  return refRefAssetBendaharaContext
}
