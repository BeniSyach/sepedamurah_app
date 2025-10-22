import React, { useState } from 'react'
import { type RealisasiTransferSumberDana } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefRealisasiTransferSumberDanaDialogType = 'add' | 'edit' | 'delete'

type RefRealisasiTransferSumberDanaContextType = {
  open: RefRealisasiTransferSumberDanaDialogType | null
  setOpen: (str: RefRealisasiTransferSumberDanaDialogType | null) => void
  currentRow: RealisasiTransferSumberDana | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<RealisasiTransferSumberDana | null>
  >
}

const RefRealisasiTransferSumberDanaContext =
  React.createContext<RefRealisasiTransferSumberDanaContextType | null>(null)

export function RealisasiTransferSumberDanaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefRealisasiTransferSumberDanaDialogType>(null)
  const [currentRow, setCurrentRow] =
    useState<RealisasiTransferSumberDana | null>(null)

  return (
    <RefRealisasiTransferSumberDanaContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefRealisasiTransferSumberDanaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefRealisasiTransferSumberDana = () => {
  const refRealisasiTransferSumberDanaContext = React.useContext(
    RefRealisasiTransferSumberDanaContext
  )

  if (!refRealisasiTransferSumberDanaContext) {
    throw new Error(
      'useRefRealisasiTransferSumberDana has to be used within <RefRealisasiTransferSumberDanaContext>'
    )
  }

  return refRealisasiTransferSumberDanaContext
}
