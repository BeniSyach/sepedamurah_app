import React, { useState } from 'react'
import { type LogUsersHapus } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefLogUsersHapusDialogType = 'delete'

type RefLogUsersHapusContextType = {
  open: RefLogUsersHapusDialogType | null
  setOpen: (str: RefLogUsersHapusDialogType | null) => void
  currentRow: LogUsersHapus | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LogUsersHapus | null>>
}

const RefLogUsersHapusContext =
  React.createContext<RefLogUsersHapusContextType | null>(null)

export function LogUsersHapusProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RefLogUsersHapusDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LogUsersHapus | null>(null)

  return (
    <RefLogUsersHapusContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefLogUsersHapusContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefLogUsersHapus = () => {
  const refLogUsersHapusContext = React.useContext(RefLogUsersHapusContext)

  if (!refLogUsersHapusContext) {
    throw new Error(
      'useRefLogUsersHapus has to be used within <RefLogUsersHapusContext>'
    )
  }

  return refLogUsersHapusContext
}
