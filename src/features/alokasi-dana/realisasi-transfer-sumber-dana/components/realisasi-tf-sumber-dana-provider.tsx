import React, { useState } from 'react'
import { type RekapSumberDanaItem } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefRekapSumberDanaItemDialogType = 'add' | 'edit' | 'delete' | 'detail'

type RefRekapSumberDanaItemContextType = {
  open: RefRekapSumberDanaItemDialogType | null
  setOpen: (str: RefRekapSumberDanaItemDialogType | null) => void
  currentRow: RekapSumberDanaItem | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<RekapSumberDanaItem | null>
  >
}

const RefRekapSumberDanaItemContext =
  React.createContext<RefRekapSumberDanaItemContextType | null>(null)

export function RekapSumberDanaItemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefRekapSumberDanaItemDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RekapSumberDanaItem | null>(null)

  return (
    <RefRekapSumberDanaItemContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefRekapSumberDanaItemContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefRekapSumberDanaItem = () => {
  const refRekapSumberDanaItemContext = React.useContext(
    RefRekapSumberDanaItemContext
  )

  if (!refRekapSumberDanaItemContext) {
    throw new Error(
      'useRefRekapSumberDanaItem has to be used within <RefRekapSumberDanaItemContext>'
    )
  }

  return refRekapSumberDanaItemContext
}
