import React, { useState } from 'react'
import { type Persetujuan } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefPersetujuanDialogType = 'add' | 'edit' | 'delete'

type RefPersetujuanContextType = {
  open: RefPersetujuanDialogType | null
  setOpen: (str: RefPersetujuanDialogType | null) => void
  currentRow: Persetujuan | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Persetujuan | null>>
}

const RefPersetujuanContext =
  React.createContext<RefPersetujuanContextType | null>(null)

export function PersetujuanProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefPersetujuanDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Persetujuan | null>(null)

  return (
    <RefPersetujuanContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefPersetujuanContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefPersetujuan = () => {
  const refPersetujuanContext = React.useContext(RefPersetujuanContext)

  if (!refPersetujuanContext) {
    throw new Error(
      'useRefPersetujuan has to be used within <RefPersetujuanContext>'
    )
  }

  return refPersetujuanContext
}
