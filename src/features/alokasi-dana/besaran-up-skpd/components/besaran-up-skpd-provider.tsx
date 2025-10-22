import React, { useState } from 'react'
import { type UpSkpd } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefUpSkpdDialogType = 'add' | 'edit' | 'delete'

type RefUpSkpdContextType = {
  open: RefUpSkpdDialogType | null
  setOpen: (str: RefUpSkpdDialogType | null) => void
  currentRow: UpSkpd | null
  setCurrentRow: React.Dispatch<React.SetStateAction<UpSkpd | null>>
}

const RefUpSkpdContext = React.createContext<RefUpSkpdContextType | null>(null)

export function UpSkpdProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RefUpSkpdDialogType>(null)
  const [currentRow, setCurrentRow] = useState<UpSkpd | null>(null)

  return (
    <RefUpSkpdContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefUpSkpdContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefUpSkpd = () => {
  const refUpSkpdContext = React.useContext(RefUpSkpdContext)

  if (!refUpSkpdContext) {
    throw new Error('useRefUpSkpd has to be used within <RefUpSkpdContext>')
  }

  return refUpSkpdContext
}
