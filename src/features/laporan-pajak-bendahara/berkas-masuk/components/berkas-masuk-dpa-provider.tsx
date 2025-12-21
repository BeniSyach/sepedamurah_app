import React, { useState } from 'react'
import { type LaporanPajakBendahara } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefLaporanPajakBendaharaDialogType = 'lihat' | 'periksa'

type RefLaporanPajakBendaharaContextType = {
  open: RefLaporanPajakBendaharaDialogType | null
  setOpen: (str: RefLaporanPajakBendaharaDialogType | null) => void
  currentRow: LaporanPajakBendahara | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<LaporanPajakBendahara | null>
  >
}

const RefLaporanPajakBendaharaContext =
  React.createContext<RefLaporanPajakBendaharaContextType | null>(null)

export function LaporanPajakBendaharaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefLaporanPajakBendaharaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LaporanPajakBendahara | null>(
    null
  )

  return (
    <RefLaporanPajakBendaharaContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefLaporanPajakBendaharaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefLaporanPajakBendahara = () => {
  const refLaporanPajakBendaharaContext = React.useContext(
    RefLaporanPajakBendaharaContext
  )

  if (!refLaporanPajakBendaharaContext) {
    throw new Error(
      'useRefLaporanPajakBendahara has to be used within <RefLaporanPajakBendaharaContext>'
    )
  }

  return refLaporanPajakBendaharaContext
}
