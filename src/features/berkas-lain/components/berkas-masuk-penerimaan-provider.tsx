import React, { useState } from 'react'
import { type BerkasLain } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefBerkasLainDialogType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'lihat'
  | 'berkasTTE'
  | 'TTEBerkas'

type RefBerkasLainContextType = {
  open: RefBerkasLainDialogType | null
  setOpen: (str: RefBerkasLainDialogType | null) => void
  currentRow: BerkasLain | null
  setCurrentRow: React.Dispatch<React.SetStateAction<BerkasLain | null>>
}

const RefBerkasLainContext =
  React.createContext<RefBerkasLainContextType | null>(null)

export function BerkasLainProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefBerkasLainDialogType>(null)
  const [currentRow, setCurrentRow] = useState<BerkasLain | null>(null)

  return (
    <RefBerkasLainContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefBerkasLainContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefBerkasLain = () => {
  const refBerkasLainContext = React.useContext(RefBerkasLainContext)

  if (!refBerkasLainContext) {
    throw new Error(
      'useRefBerkasLain has to be used within <RefBerkasLainContext>'
    )
  }

  return refBerkasLainContext
}
