import React, { useState } from 'react'
import { type BidangUrusan } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: BidangUrusan | null
  setCurrentRow: React.Dispatch<React.SetStateAction<BidangUrusan | null>>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

export function RefBidangUrusanProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<BidangUrusan | null>(null)

  return (
    <TasksContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TasksContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefBidangUrusan = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
