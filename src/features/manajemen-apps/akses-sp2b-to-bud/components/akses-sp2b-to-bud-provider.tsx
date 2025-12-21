import React, { useState } from 'react'
import { type AksesSp2bToBUDGroup } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefAksesSp2bToBUDGroupDialogType = 'add' | 'edit' | 'delete'

type RefAksesSp2bToBUDGroupContextType = {
  open: RefAksesSp2bToBUDGroupDialogType | null
  setOpen: (str: RefAksesSp2bToBUDGroupDialogType | null) => void
  currentRow: AksesSp2bToBUDGroup | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<AksesSp2bToBUDGroup | null>
  >
}

const RefAksesSp2bToBUDGroupContext =
  React.createContext<RefAksesSp2bToBUDGroupContextType | null>(null)

export function AksesSp2bToBUDGroupProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefAksesSp2bToBUDGroupDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AksesSp2bToBUDGroup | null>(null)

  return (
    <RefAksesSp2bToBUDGroupContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefAksesSp2bToBUDGroupContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefAksesSp2bToBUDGroup = () => {
  const refAksesSp2bToBUDGroupContext = React.useContext(
    RefAksesSp2bToBUDGroupContext
  )

  if (!refAksesSp2bToBUDGroupContext) {
    throw new Error(
      'useRefAksesSp2bToBUDGroup has to be used within <RefAksesSp2bToBUDGroupContext>'
    )
  }

  return refAksesSp2bToBUDGroupContext
}
