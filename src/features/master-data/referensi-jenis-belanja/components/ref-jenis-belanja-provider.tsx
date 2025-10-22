import React, { useState } from 'react'
import { type JenisBelanja } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefJenisBelanjaDialogType = 'add' | 'edit' | 'delete' | 'import'

type RefJenisBelanjaContextType = {
  open: RefJenisBelanjaDialogType | null
  setOpen: (str: RefJenisBelanjaDialogType | null) => void
  currentRow: JenisBelanja | null
  setCurrentRow: React.Dispatch<React.SetStateAction<JenisBelanja | null>>
}

const RefJenisBelanjaContext =
  React.createContext<RefJenisBelanjaContextType | null>(null)

export function JenisBelanjaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefJenisBelanjaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<JenisBelanja | null>(null)

  return (
    <RefJenisBelanjaContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefJenisBelanjaContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefJenisBelanja = () => {
  const refJenisBelanjaContext = React.useContext(RefJenisBelanjaContext)

  if (!refJenisBelanjaContext) {
    throw new Error(
      'useRefJenisBelanja has to be used within <RefJenisBelanjaContext>'
    )
  }

  return refJenisBelanjaContext
}
