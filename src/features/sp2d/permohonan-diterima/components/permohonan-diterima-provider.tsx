import React, { useState } from 'react'
import { type Sp2dItem } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefSp2dItemDialogType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'kirimsp2d'
  | 'periksa'
  | 'download'
  | 'lihat'
  | 'downloadTTE'
  | 'kirimbank'
  | 'publish'

type RefSp2dItemContextType = {
  open: RefSp2dItemDialogType | null
  setOpen: (str: RefSp2dItemDialogType | null) => void
  currentRow: Sp2dItem | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Sp2dItem | null>>
}

const RefSp2dItemContext = React.createContext<RefSp2dItemContextType | null>(
  null
)

export function Sp2dItemProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RefSp2dItemDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Sp2dItem | null>(null)

  return (
    <RefSp2dItemContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefSp2dItemContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefSp2dItem = () => {
  const refSp2dItemContext = React.useContext(RefSp2dItemContext)

  if (!refSp2dItemContext) {
    throw new Error('useRefSp2dItem has to be used within <RefSp2dItemContext>')
  }

  return refSp2dItemContext
}
