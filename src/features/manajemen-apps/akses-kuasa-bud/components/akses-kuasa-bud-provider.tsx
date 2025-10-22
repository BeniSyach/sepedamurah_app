import React, { useState } from 'react'
import { type AksesKuasaBud } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefAksesKuasaBudDialogType = 'add' | 'edit' | 'delete'

type RefAksesKuasaBudContextType = {
  open: RefAksesKuasaBudDialogType | null
  setOpen: (str: RefAksesKuasaBudDialogType | null) => void
  currentRow: AksesKuasaBud | null
  setCurrentRow: React.Dispatch<React.SetStateAction<AksesKuasaBud | null>>
}

const RefAksesKuasaBudContext =
  React.createContext<RefAksesKuasaBudContextType | null>(null)

export function AksesKuasaBudProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefAksesKuasaBudDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AksesKuasaBud | null>(null)

  return (
    <RefAksesKuasaBudContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefAksesKuasaBudContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefAksesKuasaBud = () => {
  const refAksesKuasaBudContext = React.useContext(RefAksesKuasaBudContext)

  if (!refAksesKuasaBudContext) {
    throw new Error(
      'useRefAksesKuasaBud has to be used within <RefAksesKuasaBudContext>'
    )
  }

  return refAksesKuasaBudContext
}
