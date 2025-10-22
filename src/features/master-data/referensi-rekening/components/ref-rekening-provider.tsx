import React, { useState } from 'react'
import { type Rekening } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefRekeningDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefRekeningContextType = {
  open: RefRekeningDialogType | null
  setOpen: (str: RefRekeningDialogType | null) => void
  currentRow: Rekening | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Rekening | null>>
}

const RefRekeningContext = React.createContext<RefRekeningContextType | null>(
  null
)

export function RekeningProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RefRekeningDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Rekening | null>(null)

  return (
    <RefRekeningContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefRekeningContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefRekening = () => {
  const refRekeningContext = React.useContext(RefRekeningContext)

  if (!refRekeningContext) {
    throw new Error('useRefRekening has to be used within <RefRekeningContext>')
  }

  return refRekeningContext
}
