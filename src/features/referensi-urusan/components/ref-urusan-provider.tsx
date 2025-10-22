import React, { useState } from 'react'
import { type Urusan } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type UrusanDialogType = 'create' | 'update' | 'delete' | 'import'

type UrusanContextType = {
  open: UrusanDialogType | null
  setOpen: (str: UrusanDialogType | null) => void
  currentRow: Urusan | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Urusan | null>>
}

const UrusanContext = React.createContext<UrusanContextType | null>(null)

export function RefUrusanProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UrusanDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Urusan | null>(null)

  return (
    <UrusanContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UrusanContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefUrusan = () => {
  const urusanContext = React.useContext(UrusanContext)

  if (!urusanContext) {
    throw new Error('useUrusan has to be used within <UrusanContext>')
  }

  return urusanContext
}
