import React, { useState } from 'react'
import { type JenisSpm } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefJenisSpmDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefJenisSpmContextType = {
  open: RefJenisSpmDialogType | null
  setOpen: (str: RefJenisSpmDialogType | null) => void
  currentRow: JenisSpm | null
  setCurrentRow: React.Dispatch<React.SetStateAction<JenisSpm | null>>
}

const RefJenisSpmContext = React.createContext<RefJenisSpmContextType | null>(
  null
)

export function JenisSpmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RefJenisSpmDialogType>(null)
  const [currentRow, setCurrentRow] = useState<JenisSpm | null>(null)

  return (
    <RefJenisSpmContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefJenisSpmContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefJenisSpm = () => {
  const refJenisSpmContext = React.useContext(RefJenisSpmContext)

  if (!refJenisSpmContext) {
    throw new Error('useRefJenisSpm has to be used within <RefJenisSpmContext>')
  }

  return refJenisSpmContext
}
