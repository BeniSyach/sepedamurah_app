import React, { useState } from 'react'
import { type RefSp2dbToBUD } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefRefSp2dbToBUDDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefRefSp2dbToBUDContextType = {
  open: RefRefSp2dbToBUDDialogType | null
  setOpen: (str: RefRefSp2dbToBUDDialogType | null) => void
  currentRow: RefSp2dbToBUD | null
  setCurrentRow: React.Dispatch<React.SetStateAction<RefSp2dbToBUD | null>>
}

const RefRefSp2dbToBUDContext =
  React.createContext<RefRefSp2dbToBUDContextType | null>(null)

export function RefSp2dbToBUDProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefRefSp2dbToBUDDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RefSp2dbToBUD | null>(null)

  return (
    <RefRefSp2dbToBUDContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefRefSp2dbToBUDContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefRefSp2dbToBUD = () => {
  const refRefSp2dbToBUDContext = React.useContext(RefRefSp2dbToBUDContext)

  if (!refRefSp2dbToBUDContext) {
    throw new Error(
      'useRefRefSp2dbToBUD has to be used within <RefRefSp2dbToBUDContext>'
    )
  }

  return refRefSp2dbToBUDContext
}
