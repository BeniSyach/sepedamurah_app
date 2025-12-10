import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { type LaporanFungsional } from '@/api'
import { Download, DownloadCloudIcon, Eye, FolderSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRefLaporanFungsional } from './penerimaan-diterima-provider'

type DataTableRowActionsProps = {
  row: Row<LaporanFungsional>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useRefLaporanFungsional()
  const sudahDiTteLaporanFungsional = (item: LaporanFungsional): boolean => {
    return item.berkas_tte !== '' && item.berkas_tte != null
  }
  const levelAkses = localStorage.getItem('user_role')
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
          {levelAkses !== 'Bendahara' && (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('periksa')
              }}
            >
              Periksa
              <DropdownMenuShortcut>
                <FolderSearch size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
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
          <DropdownMenuSeparator />
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

          {sudahDiTteLaporanFungsional(row.original) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(row.original)
                  setOpen('downloadBerkasTTE')
                }}
              >
                Download Berkas TTE
                <DropdownMenuShortcut>
                  <DownloadCloudIcon size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
