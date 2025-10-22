import React, { useState } from 'react'
import { type PaguBelanja } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefPaguBelanjaDialogType = 'add' | 'edit' | 'delete'

type RefPaguBelanjaContextType = {
  open: RefPaguBelanjaDialogType | null
  setOpen: (str: RefPaguBelanjaDialogType | null) => void
  currentRow: PaguBelanja | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PaguBelanja | null>>
}

const RefPaguBelanjaContext =
  React.createContext<RefPaguBelanjaContextType | null>(null)

export function PaguBelanjaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefPaguBelanjaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PaguBelanja | null>(null)

  return (
    <RefPaguBelanjaContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefPaguBelanjaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefPaguBelanja = () => {
  const refPaguBelanjaContext = React.useContext(RefPaguBelanjaContext)

  if (!refPaguBelanjaContext) {
    throw new Error(
      'useRefPaguBelanja has to be used within <RefPaguBelanjaContext>'
    )
  }

  return refPaguBelanjaContext
}
