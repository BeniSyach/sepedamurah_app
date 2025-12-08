import React, { useState } from 'react'
import { type RefDpa } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefRefDpaDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefRefDpaContextType = {
  open: RefRefDpaDialogType | null
  setOpen: (str: RefRefDpaDialogType | null) => void
  currentRow: RefDpa | null
  setCurrentRow: React.Dispatch<React.SetStateAction<RefDpa | null>>
}

const RefRefDpaContext = React.createContext<RefRefDpaContextType | null>(null)

export function RefDpaProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RefRefDpaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RefDpa | null>(null)

  return (
    <RefRefDpaContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefRefDpaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefRefDpa = () => {
  const refRefDpaContext = React.useContext(RefRefDpaContext)

  if (!refRefDpaContext) {
    throw new Error('useRefRefDpa has to be used within <RefRefDpaContext>')
  }

  return refRefDpaContext
}
