import React, { useState } from 'react'
import { type LaporanDPA } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefLaporanDPADialogType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'lihat'
  | 'download'
  | 'periksa'

type RefLaporanDPAContextType = {
  open: RefLaporanDPADialogType | null
  setOpen: (str: RefLaporanDPADialogType | null) => void
  currentRow: LaporanDPA | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LaporanDPA | null>>
}

const RefLaporanDPAContext =
  React.createContext<RefLaporanDPAContextType | null>(null)

export function LaporanDPAProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefLaporanDPADialogType>(null)
  const [currentRow, setCurrentRow] = useState<LaporanDPA | null>(null)

  return (
    <RefLaporanDPAContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefLaporanDPAContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefLaporanDPA = () => {
  const refLaporanDPAContext = React.useContext(RefLaporanDPAContext)

  if (!refLaporanDPAContext) {
    throw new Error(
      'useRefLaporanDPA has to be used within <RefLaporanDPAContext>'
    )
  }

  return refLaporanDPAContext
}
