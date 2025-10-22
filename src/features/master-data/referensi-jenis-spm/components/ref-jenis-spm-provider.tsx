import React, { useState } from 'react'
import { type CeklisKelengkapanDokumen } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefCeklisKelengkapanDokumenDialogType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'import'

type RefCeklisKelengkapanDokumenContextType = {
  open: RefCeklisKelengkapanDokumenDialogType | null
  setOpen: (str: RefCeklisKelengkapanDokumenDialogType | null) => void
  currentRow: CeklisKelengkapanDokumen | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<CeklisKelengkapanDokumen | null>
  >
}

const RefCeklisKelengkapanDokumenContext =
  React.createContext<RefCeklisKelengkapanDokumenContextType | null>(null)

export function CeklisKelengkapanDokumenProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefCeklisKelengkapanDokumenDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CeklisKelengkapanDokumen | null>(
    null
  )

  return (
    <RefCeklisKelengkapanDokumenContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefCeklisKelengkapanDokumenContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefDokumenCeklisKelengkapanDokumen = () => {
  const refCeklisKelengkapanDokumenContext = React.useContext(
    RefCeklisKelengkapanDokumenContext
  )

  if (!refCeklisKelengkapanDokumenContext) {
    throw new Error(
      'useRefCeklisKelengkapanDokumen has to be used within <RefCeklisKelengkapanDokumenContext>'
    )
  }

  return refCeklisKelengkapanDokumenContext
}
