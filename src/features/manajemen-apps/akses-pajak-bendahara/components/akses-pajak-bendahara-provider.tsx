import React, { useState } from 'react'
import { type AksesPajakBendaharaGroup } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefAksesPajakBendaharaGroupDialogType = 'add' | 'edit' | 'delete'

type RefAksesPajakBendaharaGroupContextType = {
  open: RefAksesPajakBendaharaGroupDialogType | null
  setOpen: (str: RefAksesPajakBendaharaGroupDialogType | null) => void
  currentRow: AksesPajakBendaharaGroup | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<AksesPajakBendaharaGroup | null>
  >
}

const RefAksesPajakBendaharaGroupContext =
  React.createContext<RefAksesPajakBendaharaGroupContextType | null>(null)

export function AksesPajakBendaharaGroupProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefAksesPajakBendaharaGroupDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AksesPajakBendaharaGroup | null>(
    null
  )

  return (
    <RefAksesPajakBendaharaGroupContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefAksesPajakBendaharaGroupContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefAksesPajakBendaharaGroup = () => {
  const refAksesPajakBendaharaGroupContext = React.useContext(
    RefAksesPajakBendaharaGroupContext
  )

  if (!refAksesPajakBendaharaGroupContext) {
    throw new Error(
      'useRefAksesPajakBendaharaGroup has to be used within <RefAksesPajakBendaharaGroupContext>'
    )
  }

  return refAksesPajakBendaharaGroupContext
}
