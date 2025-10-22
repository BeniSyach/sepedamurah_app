import React, { useState } from 'react'
import { type SubKegiatan } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type SubKegiatansDialogType = 'create' | 'update' | 'delete' | 'import'

type SubKegiatansContextType = {
  open: SubKegiatansDialogType | null
  setOpen: (str: SubKegiatansDialogType | null) => void
  currentRow: SubKegiatan | null
  setCurrentRow: React.Dispatch<React.SetStateAction<SubKegiatan | null>>
}

const SubKegiatansContext = React.createContext<SubKegiatansContextType | null>(
  null
)

export function RefSubKegiatanProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<SubKegiatansDialogType>(null)
  const [currentRow, setCurrentRow] = useState<SubKegiatan | null>(null)

  return (
    <SubKegiatansContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SubKegiatansContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefSubKegiatan = () => {
  const subKegiatansContext = React.useContext(SubKegiatansContext)

  if (!subKegiatansContext) {
    throw new Error(
      'useSubKegiatans has to be used within <SubKegiatansContext>'
    )
  }

  return subKegiatansContext
}
