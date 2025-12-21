import React, { useState } from 'react'
import { type LaporanAssetBendahara } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefLaporanAssetBendaharaDialogType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'lihat'
  | 'download'
  | 'periksa'

type RefLaporanAssetBendaharaContextType = {
  open: RefLaporanAssetBendaharaDialogType | null
  setOpen: (str: RefLaporanAssetBendaharaDialogType | null) => void
  currentRow: LaporanAssetBendahara | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<LaporanAssetBendahara | null>
  >
}

const RefLaporanAssetBendaharaContext =
  React.createContext<RefLaporanAssetBendaharaContextType | null>(null)

export function LaporanAssetBendaharaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefLaporanAssetBendaharaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LaporanAssetBendahara | null>(
    null
  )

  return (
    <RefLaporanAssetBendaharaContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefLaporanAssetBendaharaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefLaporanAssetBendahara = () => {
  const refLaporanAssetBendaharaContext = React.useContext(
    RefLaporanAssetBendaharaContext
  )

  if (!refLaporanAssetBendaharaContext) {
    throw new Error(
      'useRefLaporanAssetBendahara has to be used within <RefLaporanAssetBendaharaContext>'
    )
  }

  return refLaporanAssetBendaharaContext
}
