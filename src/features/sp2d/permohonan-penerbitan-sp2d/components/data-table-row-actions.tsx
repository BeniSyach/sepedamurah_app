import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { type Sp2dItem } from '@/api'
import { Download, FileSearch, Trash2, UserPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { type User } from '../data/schema'
import { useRefSp2dItem } from './permohonan-penerbitan-sp2d-provider'

type DataTableRowActionsProps = {
  row: Row<Sp2dItem>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useRefSp2dItem()
  const levelAkses = localStorage.getItem('user_role')
  const proses = row.original?.proses

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-[160px]'>
          {/* PERIKSA SELALU ADA */}
          {levelAkses !== 'Bendahara' && (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('periksa')
              }}
            >
              Periksa Berkas
              <DropdownMenuShortcut>
                <FileSearch size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />

          {/* === HILANGKAN jika proses === 1 === */}
          {proses !== '1' && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(row.original)
                  setOpen('edit')
                }}
              >
                Edit
                <DropdownMenuShortcut>
                  <UserPen size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}
          {levelAkses !== 'Bendahara' && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(row.original)
                  setOpen('delete')
                }}
                className='text-red-500'
              >
                Delete
                <DropdownMenuShortcut>
                  <Trash2 size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}
          {/* DOWNLOAD selalu muncul */}
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('download')
            }}
          >
            Download
            <DropdownMenuShortcut>
              <Download size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
