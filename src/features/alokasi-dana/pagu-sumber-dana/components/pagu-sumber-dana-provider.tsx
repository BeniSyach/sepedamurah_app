import React, { useState } from 'react'
import { type PaguSumberDana } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefPaguSumberDanaDialogType = 'add' | 'edit' | 'delete'

type RefPaguSumberDanaContextType = {
  open: RefPaguSumberDanaDialogType | null
  setOpen: (str: RefPaguSumberDanaDialogType | null) => void
  currentRow: PaguSumberDana | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PaguSumberDana | null>>
}

const RefPaguSumberDanaContext =
  React.createContext<RefPaguSumberDanaContextType | null>(null)

export function PaguSumberDanaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefPaguSumberDanaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PaguSumberDana | null>(null)

  return (
    <RefPaguSumberDanaContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefPaguSumberDanaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefPaguSumberDana = () => {
  const refPaguSumberDanaContext = React.useContext(RefPaguSumberDanaContext)

  if (!refPaguSumberDanaContext) {
    throw new Error(
      'useRefPaguSumberDana has to be used within <RefPaguSumberDanaContext>'
    )
  }

  return refPaguSumberDanaContext
}
