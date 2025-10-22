import React, { useState } from 'react'
import { type SumberDana } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefSumberDanaDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefSumberDanaContextType = {
  open: RefSumberDanaDialogType | null
  setOpen: (str: RefSumberDanaDialogType | null) => void
  currentRow: SumberDana | null
  setCurrentRow: React.Dispatch<React.SetStateAction<SumberDana | null>>
}

const RefSumberDanaContext =
  React.createContext<RefSumberDanaContextType | null>(null)

export function SumberDanaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefSumberDanaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<SumberDana | null>(null)

  return (
    <RefSumberDanaContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefSumberDanaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefSumberDana = () => {
  const refSumberDanaContext = React.useContext(RefSumberDanaContext)

  if (!refSumberDanaContext) {
    throw new Error(
      'useRefSumberDana has to be used within <RefSumberDanaContext>'
    )
  }

  return refSumberDanaContext
}
