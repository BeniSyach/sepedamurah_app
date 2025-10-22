import React, { useState } from 'react'
import { type AksesOperator } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefAksesOperatorDialogType = 'add' | 'edit' | 'delete'

type RefAksesOperatorContextType = {
  open: RefAksesOperatorDialogType | null
  setOpen: (str: RefAksesOperatorDialogType | null) => void
  currentRow: AksesOperator | null
  setCurrentRow: React.Dispatch<React.SetStateAction<AksesOperator | null>>
}

const RefAksesOperatorContext =
  React.createContext<RefAksesOperatorContextType | null>(null)

export function AksesOperatorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefAksesOperatorDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AksesOperator | null>(null)

  return (
    <RefAksesOperatorContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefAksesOperatorContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefAksesOperator = () => {
  const refAksesOperatorContext = React.useContext(RefAksesOperatorContext)

  if (!refAksesOperatorContext) {
    throw new Error(
      'useRefAksesOperator has to be used within <RefAksesOperatorContext>'
    )
  }

  return refAksesOperatorContext
}
