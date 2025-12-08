import React, { useState } from 'react'
import { type AksesDPAGroup } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefAksesDPAGroupDialogType = 'add' | 'edit' | 'delete'

type RefAksesDPAGroupContextType = {
  open: RefAksesDPAGroupDialogType | null
  setOpen: (str: RefAksesDPAGroupDialogType | null) => void
  currentRow: AksesDPAGroup | null
  setCurrentRow: React.Dispatch<React.SetStateAction<AksesDPAGroup | null>>
}

const RefAksesDPAGroupContext =
  React.createContext<RefAksesDPAGroupContextType | null>(null)

export function AksesDPAGroupProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefAksesDPAGroupDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AksesDPAGroup | null>(null)

  return (
    <RefAksesDPAGroupContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefAksesDPAGroupContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefAksesDPAGroup = () => {
  const refAksesDPAGroupContext = React.useContext(RefAksesDPAGroupContext)

  if (!refAksesDPAGroupContext) {
    throw new Error(
      'useRefAksesDPAGroup has to be used within <RefAksesDPAGroupContext>'
    )
  }

  return refAksesDPAGroupContext
}
