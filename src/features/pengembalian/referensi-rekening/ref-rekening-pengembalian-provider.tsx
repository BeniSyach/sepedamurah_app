import React, { useState } from 'react'
import { type DatRekeningItem } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefDatRekeningItemDialogType = 'add' | 'edit' | 'delete'

type RefDatRekeningItemContextType = {
  open: RefDatRekeningItemDialogType | null
  setOpen: (str: RefDatRekeningItemDialogType | null) => void
  currentRow: DatRekeningItem | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DatRekeningItem | null>>
}

const RefDatRekeningItemContext =
  React.createContext<RefDatRekeningItemContextType | null>(null)

export function DatRekeningItemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefDatRekeningItemDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DatRekeningItem | null>(null)

  return (
    <RefDatRekeningItemContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefDatRekeningItemContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefDatRekeningItem = () => {
  const refDatRekeningItemContext = React.useContext(RefDatRekeningItemContext)

  if (!refDatRekeningItemContext) {
    throw new Error(
      'useRefDatRekeningItem has to be used within <RefDatRekeningItemContext>'
    )
  }

  return refDatRekeningItemContext
}
