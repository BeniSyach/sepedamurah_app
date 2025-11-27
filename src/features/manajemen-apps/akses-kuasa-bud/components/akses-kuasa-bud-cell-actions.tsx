import { type Row } from '@tanstack/react-table'
import { type AksesKuasaBud } from '@/api'
import { DataTableRowActions } from './data-table-row-actions'

type Props = {
  row: Row<AksesKuasaBud>
}

export default function AksesKuasaBUDCellActions({ row }: Props) {
  return <DataTableRowActions row={row} />
}
