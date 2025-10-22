import React, { useState } from 'react'
import { type MasterSkpd } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefMasterSkpdDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefMasterSkpdContextType = {
  open: RefMasterSkpdDialogType | null
  setOpen: (str: RefMasterSkpdDialogType | null) => void
  currentRow: MasterSkpd | null
  setCurrentRow: React.Dispatch<React.SetStateAction<MasterSkpd | null>>
}

const RefMasterSkpdContext =
  React.createContext<RefMasterSkpdContextType | null>(null)

export function MasterSkpdProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefMasterSkpdDialogType>(null)
  const [currentRow, setCurrentRow] = useState<MasterSkpd | null>(null)

  return (
    <RefMasterSkpdContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefMasterSkpdContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefMasterSkpd = () => {
  const refMasterSkpdContext = React.useContext(RefMasterSkpdContext)

  if (!refMasterSkpdContext) {
    throw new Error(
      'useRefMasterSkpd has to be used within <RefMasterSkpdContext>'
    )
  }

  return refMasterSkpdContext
}
