import React, { useState } from 'react'
import { type AksesRefRekonsiliasiGajiSkpdGroup } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefAksesRefRekonsiliasiGajiSkpdGroupDialogType = 'add' | 'edit' | 'delete'

type RefAksesRefRekonsiliasiGajiSkpdGroupContextType = {
  open: RefAksesRefRekonsiliasiGajiSkpdGroupDialogType | null
  setOpen: (str: RefAksesRefRekonsiliasiGajiSkpdGroupDialogType | null) => void
  currentRow: AksesRefRekonsiliasiGajiSkpdGroup | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<AksesRefRekonsiliasiGajiSkpdGroup | null>
  >
}

const RefAksesRefRekonsiliasiGajiSkpdGroupContext =
  React.createContext<RefAksesRefRekonsiliasiGajiSkpdGroupContextType | null>(
    null
  )

export function AksesRefRekonsiliasiGajiSkpdGroupProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefAksesRefRekonsiliasiGajiSkpdGroupDialogType>(null)
  const [currentRow, setCurrentRow] =
    useState<AksesRefRekonsiliasiGajiSkpdGroup | null>(null)

  return (
    <RefAksesRefRekonsiliasiGajiSkpdGroupContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefAksesRefRekonsiliasiGajiSkpdGroupContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefAksesRefRekonsiliasiGajiSkpdGroup = () => {
  const refAksesRefRekonsiliasiGajiSkpdGroupContext = React.useContext(
    RefAksesRefRekonsiliasiGajiSkpdGroupContext
  )

  if (!refAksesRefRekonsiliasiGajiSkpdGroupContext) {
    throw new Error(
      'useRefAksesRefRekonsiliasiGajiSkpdGroup has to be used within <RefAksesRefRekonsiliasiGajiSkpdGroupContext>'
    )
  }

  return refAksesRefRekonsiliasiGajiSkpdGroupContext
}
