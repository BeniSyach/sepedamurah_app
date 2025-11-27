import { type Row } from '@tanstack/react-table'
import { type AksesOperator } from '@/api'
import { DataTableRowActions } from './data-table-row-actions'

type Props = {
  row: Row<AksesOperator>
}

export default function AksesOperatorCellActions({ row }: Props) {
  return <DataTableRowActions row={row} />
}
