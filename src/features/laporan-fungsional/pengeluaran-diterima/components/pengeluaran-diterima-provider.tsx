import React, { useState } from 'react'
import { type LaporanFungsional } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefLaporanFungsionalDialogType =
  | 'lihat'
  | 'download'
  | 'periksa'
  | 'add'
  | 'downloadBerkasTTE'

type RefLaporanFungsionalContextType = {
  open: RefLaporanFungsionalDialogType | null
  setOpen: (str: RefLaporanFungsionalDialogType | null) => void
  currentRow: LaporanFungsional | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LaporanFungsional | null>>
}

const RefLaporanFungsionalContext =
  React.createContext<RefLaporanFungsionalContextType | null>(null)

export function LaporanFungsionalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefLaporanFungsionalDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LaporanFungsional | null>(null)

  return (
    <RefLaporanFungsionalContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefLaporanFungsionalContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefLaporanFungsional = () => {
  const refLaporanFungsionalContext = React.useContext(
    RefLaporanFungsionalContext
  )

  if (!refLaporanFungsionalContext) {
    throw new Error(
      'useRefLaporanFungsional has to be used within <RefLaporanFungsionalContext>'
    )
  }

  return refLaporanFungsionalContext
}
