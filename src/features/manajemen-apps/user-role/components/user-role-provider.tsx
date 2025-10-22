import React, { useState } from 'react'
import { type UsersRole } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefUsersRoleDialogType = 'add' | 'edit' | 'delete'

type RefUsersRoleContextType = {
  open: RefUsersRoleDialogType | null
  setOpen: (str: RefUsersRoleDialogType | null) => void
  currentRow: UsersRole | null
  setCurrentRow: React.Dispatch<React.SetStateAction<UsersRole | null>>
}

const RefUsersRoleContext = React.createContext<RefUsersRoleContextType | null>(
  null
)

export function UsersRoleProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RefUsersRoleDialogType>(null)
  const [currentRow, setCurrentRow] = useState<UsersRole | null>(null)

  return (
    <RefUsersRoleContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RefUsersRoleContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefUsersRole = () => {
  const refUsersRoleContext = React.useContext(RefUsersRoleContext)

  if (!refUsersRoleContext) {
    throw new Error(
      'useRefUsersRole has to be used within <RefUsersRoleContext>'
    )
  }

  return refUsersRoleContext
}
