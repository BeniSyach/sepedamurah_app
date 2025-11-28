import React, { useState } from 'react'
import { type BatasWaktu } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefBatasWaktuDialogType = 'add' | 'edit' | 'delete' | 'reset'

type RefBatasWaktuContextType = {
  open: RefBatasWaktuDialogType | null
  setOpen: (str: RefBatasWaktuDialogType | null) => void
  currentRow: BatasWaktu | null
  setCurrentRow: React.Dispatch<React.SetStateAction<BatasWaktu | null>>
}

const RefBatasWaktuContext =
  React.createContext<RefBatasWaktuContextType | null>(null)

export function BatasWaktuProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefBatasWaktuDialogType>(null)
  const [currentRow, setCurrentRow] = useState<BatasWaktu | null>(null)

  return (
    <RefBatasWaktuContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefBatasWaktuContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefBatasWaktu = () => {
  const refBatasWaktuContext = React.useContext(RefBatasWaktuContext)

  if (!refBatasWaktuContext) {
    throw new Error(
      'useRefBatasWaktu has to be used within <RefBatasWaktuContext>'
    )
  }

  return refBatasWaktuContext
}
