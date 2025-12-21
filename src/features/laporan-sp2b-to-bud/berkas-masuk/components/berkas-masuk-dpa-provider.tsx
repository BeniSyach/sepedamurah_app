import React, { useState } from 'react'
import { type LaporanSp2bToBUD } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefLaporanSp2bToBUDDialogType = 'lihat' | 'periksa'

type RefLaporanSp2bToBUDContextType = {
  open: RefLaporanSp2bToBUDDialogType | null
  setOpen: (str: RefLaporanSp2bToBUDDialogType | null) => void
  currentRow: LaporanSp2bToBUD | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LaporanSp2bToBUD | null>>
}

const RefLaporanSp2bToBUDContext =
  React.createContext<RefLaporanSp2bToBUDContextType | null>(null)

export function LaporanSp2bToBUDProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefLaporanSp2bToBUDDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LaporanSp2bToBUD | null>(null)

  return (
    <RefLaporanSp2bToBUDContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefLaporanSp2bToBUDContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefLaporanSp2bToBUD = () => {
  const refLaporanSp2bToBUDContext = React.useContext(
    RefLaporanSp2bToBUDContext
  )

  if (!refLaporanSp2bToBUDContext) {
    throw new Error(
      'useRefLaporanSp2bToBUD has to be used within <RefLaporanSp2bToBUDContext>'
    )
  }

  return refLaporanSp2bToBUDContext
}
