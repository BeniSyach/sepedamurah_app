import React, { useState } from 'react'
import { type Kegiatan } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type KegiatanDialogType = 'create' | 'update' | 'delete' | 'import'

type KegiatanContextType = {
  open: KegiatanDialogType | null
  setOpen: (str: KegiatanDialogType | null) => void
  currentRow: Kegiatan | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Kegiatan | null>>
}

const KegiatanContext = React.createContext<KegiatanContextType | null>(null)

export function RefKegiatanProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<KegiatanDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Kegiatan | null>(null)

  return (
    <KegiatanContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </KegiatanContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefKegiatan = () => {
  const kegiatanContext = React.useContext(KegiatanContext)

  if (!kegiatanContext) {
    throw new Error('useKegiatan has to be used within <KegiatanContext>')
  }

  return kegiatanContext
}
