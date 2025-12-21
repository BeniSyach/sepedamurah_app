import React, { useState } from 'react'
import { type AksesAssetBendaharaGroup } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type RefAksesAssetBendaharaGroupDialogType = 'add' | 'edit' | 'delete'

type RefAksesAssetBendaharaGroupContextType = {
  open: RefAksesAssetBendaharaGroupDialogType | null
  setOpen: (str: RefAksesAssetBendaharaGroupDialogType | null) => void
  currentRow: AksesAssetBendaharaGroup | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<AksesAssetBendaharaGroup | null>
  >
}

const RefAksesAssetBendaharaGroupContext =
  React.createContext<RefAksesAssetBendaharaGroupContextType | null>(null)

export function AksesAssetBendaharaGroupProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] =
    useDialogState<RefAksesAssetBendaharaGroupDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AksesAssetBendaharaGroup | null>(
    null
  )

  return (
    <RefAksesAssetBendaharaGroupContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RefAksesAssetBendaharaGroupContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRefAksesAssetBendaharaGroup = () => {
  const refAksesAssetBendaharaGroupContext = React.useContext(
    RefAksesAssetBendaharaGroupContext
  )

  if (!refAksesAssetBendaharaGroupContext) {
    throw new Error(
      'useRefAksesAssetBendaharaGroup has to be used within <RefAksesAssetBendaharaGroupContext>'
    )
  }

  return refAksesAssetBendaharaGroupContext
}
