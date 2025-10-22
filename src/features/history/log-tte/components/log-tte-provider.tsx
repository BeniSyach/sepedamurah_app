import React, { useState } from 'react'
import { type LogTTE } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefLogTTEDialogType = 'delete'

type RefLogTTEContextType = {
  open: RefLogTTEDialogType | null
  setOpen: (str: RefLogTTEDialogType | null) => void
  currentRow: LogTTE | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LogTTE | null>>
}

const RefLogTTEContext = React.createContext<RefLogTTEContextType | null>(null)

export function LogTTEProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RefLogTTEDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LogTTE | null>(null)

  return (
    <RefLogTTEContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefLogTTEContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefLogTTE = () => {
  const refLogTTEContext = React.useContext(RefLogTTEContext)

  if (!refLogTTEContext) {
    throw new Error('useRefLogTTE has to be used within <RefLogTTEContext>')
  }

  return refLogTTEContext
}
