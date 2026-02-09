import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { type MasterSkpd, type LaporanDPA } from '@/api'
import { Download, LucideFolderSearch, Trash2, Pen, Eye } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRefLaporanDPA } from './laporan-dpa-provider'

type DataTableRowActionsProps = {
  row: Row<LaporanDPA>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const skpd = JSON.parse(
    localStorage.getItem('user_skpd') || '{}'
  ) as MasterSkpd
  const { setOpen, setCurrentRow } = useRefLaporanDPA()
  const levelAkses = localStorage.getItem('user_role')
  const user = useAuthStore((s) => s.user)
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
          {levelAkses !== 'Bendahara' && user?.nip === '198712022011011007' && (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('periksa')
              }}
            >
              Periksa Berkas
              <DropdownMenuShortcut>
                <LucideFolderSearch size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {levelAkses !== 'Bendahara' &&
            proses !== '1' &&
            skpd?.is_active === '1' &&
            user?.nip === '198712022011011007' && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentRow(row.original)
                    setOpen('edit')
                  }}
                >
                  Edit
                  <DropdownMenuShortcut>
                    <Pen size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
          {levelAkses !== 'Bendahara' &&
            skpd?.is_active === '1' &&
            user?.nip === '198712022011011007' && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentRow(row.original)
                    setOpen('delete')
                  }}
                  className='text-red-500!'
                >
                  Delete
                  <DropdownMenuShortcut>
                    <Trash2 size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('downloadBerkas')
            }}
          >
            Download
            <DropdownMenuShortcut>
              <Download size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('lihat')
            }}
          >
            Lihat
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
