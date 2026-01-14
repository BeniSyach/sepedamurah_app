import React, { useState } from 'react'
import { type RefRekonsiliasiGajiSkpd } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefRefRekonsiliasiGajiSkpdDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefRefRekonsiliasiGajiSkpdContextType = {
  open: RefRefRekonsiliasiGajiSkpdDialogType | null
  setOpen: (str: RefRefRekonsiliasiGajiSkpdDialogType | null) => void
  currentRow: RefRekonsiliasiGajiSkpd | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<RefRekonsiliasiGajiSkpd | null>
  >
}

const RefRefRekonsiliasiGajiSkpdContext =
  React.createContext<RefRefRekonsiliasiGajiSkpdContextType | null>(null)

export function RefRekonsiliasiGajiSkpdProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefRefRekonsiliasiGajiSkpdDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RefRekonsiliasiGajiSkpd | null>(
    null
  )

  return (
    <RefRefRekonsiliasiGajiSkpdContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefRefRekonsiliasiGajiSkpdContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefRefRekonsiliasiGajiSkpd = () => {
  const refRefRekonsiliasiGajiSkpdContext = React.useContext(
    RefRefRekonsiliasiGajiSkpdContext
  )

  if (!refRefRekonsiliasiGajiSkpdContext) {
    throw new Error(
      'useRefRefRekonsiliasiGajiSkpd has to be used within <RefRefRekonsiliasiGajiSkpdContext>'
    )
  }

  return refRefRekonsiliasiGajiSkpdContext
}
