import React, { useState } from 'react'
import { type PermohonanSpd } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefPermohonanSpdDialogType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'periksa'
  | 'download'
  | 'lihat'

type RefPermohonanSpdContextType = {
  open: RefPermohonanSpdDialogType | null
  setOpen: (str: RefPermohonanSpdDialogType | null) => void
  currentRow: PermohonanSpd | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PermohonanSpd | null>>
}

const RefPermohonanSpdContext =
  React.createContext<RefPermohonanSpdContextType | null>(null)

export function PermohonanSpdProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefPermohonanSpdDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PermohonanSpd | null>(null)

  return (
    <RefPermohonanSpdContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefPermohonanSpdContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefPermohonanSpd = () => {
  const refPermohonanSpdContext = React.useContext(RefPermohonanSpdContext)

  if (!refPermohonanSpdContext) {
    throw new Error(
      'useRefPermohonanSpd has to be used within <RefPermohonanSpdContext>'
    )
  }

  return refPermohonanSpdContext
}
