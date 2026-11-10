import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Printer,
  FileCheck2,
  FolderSearch,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import type { SkppData } from '../types'
import { useSkpp } from './skpp-provider'
import { useAuthStore } from '@/stores/auth-store'

export const skppColumns: ColumnDef<SkppData>[] = [
  {
    accessorKey: 'nomor_surat',
    header: 'Nomor Surat & Tanggal',
    cell: ({ row }) => {
      const item = row.original
      const isPensiun = item.jenis_skpp === 'pensiun'

      return (
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-1.5 flex-wrap'>
            <span className='font-semibold text-primary'>{item.nomor_surat}</span>
            <Badge
              variant='outline'
              className={
                isPensiun
                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] px-1.5 py-0'
                  : 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] px-1.5 py-0'
              }
            >
              {isPensiun ? 'Pensiun' : 'Mutasi'}
            </Badge>
          </div>
          <span className='text-xs text-muted-foreground'>
            {item.tempat_penetapan}, {item.tgl_penetapan}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'nama',
    header: 'Pegawai (ASN)',
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='font-medium text-foreground'>{item.nama}</span>
          <span className='text-xs font-mono text-muted-foreground'>NIP: {item.nip}</span>
          <span className='text-[11px] text-muted-foreground'>
            {item.golongan} {item.jabatan ? `• ${item.jabatan}` : ''}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'unit_kerja',
    header: 'Unit Kerja & Tujuan',
    cell: ({ row }) => {
      const item = row.original
      const isPensiun = item.jenis_skpp === 'pensiun'

      return (
        <div className='flex flex-col gap-0.5 max-w-[220px]'>
          <span className='text-xs font-medium text-foreground truncate' title={item.unit_kerja}>
            {item.unit_kerja}
          </span>
          <div className='flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400'>
            <span>{isPensiun ? '➔ Alasan:' : '➔ Mutasi:'}</span>
            <span className='font-medium truncate' title={item.mutasi_ke}>
              {item.mutasi_ke || (isPensiun ? 'Pensiun' : '-')}
            </span>
          </div>
          <span className='text-[10px] text-muted-foreground'>SK: {item.nomor_sk}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'gaji_terakhir_bulan',
    header: 'Gaji Terakhir',
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className='flex flex-col text-xs'>
          <span className='font-medium'>{item.gaji_terakhir_bulan || '-'}</span>
          <span className='text-[11px] text-muted-foreground'>TMT: {item.tmt_sk || '-'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'jumlah_bersih',
    header: 'Jumlah Bersih',
    cell: ({ row }) => {
      const val = row.original.jumlah_bersih || 0
      return (
        <div className='flex flex-col text-right'>
          <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
            Rp {val.toLocaleString('id-ID')}
          </span>
          <span className='text-[10px] text-muted-foreground'>
            Kotor: Rp {(row.original.jumlah_kotor || 0).toLocaleString('id-ID')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status & Verifikasi',
    cell: ({ row }) => {
      const item = row.original
      const status = item.status

      if (status === 'Diterima' || status === 'Disetujui') {
        return (
          <div className='flex flex-col gap-1'>
            <Badge className='bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 flex items-center gap-1 w-fit'>
              <CheckCircle2 className='w-3 h-3' /> Diterima
            </Badge>
            {Boolean(item.berkas_tte && item.berkas_tte.trim()) ? (
              <span className='text-[10px] font-semibold text-blue-600 flex items-center gap-0.5'>
                <FileCheck2 className='w-3 h-3' /> Sudah TTE
              </span>
            ) : (
              <span className='text-[10px] text-amber-600 font-medium'>Belum TTE</span>
            )}
          </div>
        )
      }

      if (status === 'Perlu Perbaikan') {
        return (
          <div className='flex flex-col gap-1 max-w-[180px]'>
            <Badge className='bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 flex items-center gap-1 w-fit'>
              <AlertCircle className='w-3 h-3' /> Perlu Perbaikan
            </Badge>
            {item.catatan_perbaikan && (
              <span className='text-[11px] text-amber-700 dark:text-amber-300 truncate' title={item.catatan_perbaikan}>
                {item.catatan_perbaikan}
              </span>
            )}
          </div>
        )
      }

      if (status === 'Ditolak') {
        return (
          <div className='flex flex-col gap-1 max-w-[180px]'>
            <Badge variant='destructive' className='flex items-center gap-1 w-fit'>
              <XCircle className='w-3 h-3' /> Ditolak
            </Badge>
            {(item.catatan_perbaikan || item.alasan_tolak) && (
              <span className='text-[11px] text-destructive truncate' title={(item.catatan_perbaikan || item.alasan_tolak) ?? undefined}>
                {item.catatan_perbaikan || item.alasan_tolak}
              </span>
            )}
          </div>
        )
      }

      let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'outline'
      if (status === 'Diajukan' || status === 'Permohonan') variant = 'secondary'
      else if (status === 'Diterbitkan') variant = 'default'

      return (
        <Badge variant={variant} className='text-xs'>
          {status || 'Draft'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'pembuat',
    header: 'Dibuat Oleh',
    cell: ({ row }) => {
      const item = row.original
      const pembuat = item.pembuat
      const nama = pembuat?.nama && pembuat.nama !== '-' ? pembuat.nama : (item.users_id ? `User #${item.users_id}` : '-')
      const tgl = item.tanggal_upload || item.created_at

      return (
        <div className='flex flex-col text-xs gap-0.5'>
          <span className='font-medium text-foreground'>{nama}</span>
          {pembuat?.nip && pembuat.nip !== '-' && (
            <span className='text-[11px] font-mono text-muted-foreground'>NIP: {pembuat.nip}</span>
          )}
          {tgl && (
            <span className='text-[10px] text-muted-foreground'>
              {tgl.substring(0, 10)}
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => <RowActions row={row.original} />,
  },
]

function RowActions({ row }: { row: SkppData }) {
  const { setCurrentRow, setOpen, isBendahara } = useSkpp()
  const user = useAuthStore((s) => s.user)

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  const handleDownloadTte = () => {
    window.open(`${API_URL}/skpp/${row.id}/download-tte`, '_blank')
  }

  const isDiterima = row.status === 'Diterima' || row.status === 'Disetujui'
  const isSigned = Boolean(row.berkas_tte && row.berkas_tte.trim())

  const isTargetSigner = Boolean(
    user &&
      !isBendahara &&
      ((row.penandatangan_id && user.id && String(row.penandatangan_id) === String(user.id)) ||
        (row.penandatangan_nik && user.nik && String(row.penandatangan_nik) === String(user.nik)) ||
        (row.nip_penandatangan && user.nip && String(row.nip_penandatangan) === String(user.nip)) ||
        (row.nama_penandatangan && user.name && user.name.trim().toLowerCase() === row.nama_penandatangan.trim().toLowerCase()))
  )

  return (
    <div className='flex items-center gap-1.5'>
      {/* Jika sudah di TTE, tombol utama adalah Cetak SKPP TTE */}
      {isSigned ? (
        <Button
          variant='outline'
          size='sm'
          className='h-8 px-2.5 text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 flex items-center gap-1.5 text-xs font-semibold'
          onClick={handleDownloadTte}
          title='Cetak SKPP TTE (Output Final Resmi)'
        >
          <Printer className='h-3.5 w-3.5' />
          <span>Cetak SKPP TTE</span>
        </Button>
      ) : isDiterima && isTargetSigner ? (
        <Button
          variant='default'
          size='sm'
          className='h-8 px-2.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs font-medium'
          onClick={() => {
            setCurrentRow(row)
            setOpen('tte')
          }}
          title='Tanda Tangan Elektronik Dokumen SKPP'
        >
          <KeyRound className='h-3.5 w-3.5' />
          <span>TTE Berkas</span>
        </Button>
      ) : (
        <Button
          variant='outline'
          size='sm'
          className='h-8 px-2 text-primary border-primary/30 hover:bg-primary/10 flex items-center gap-1'
          onClick={() => {
            setCurrentRow(row)
            setOpen('periksa')
          }}
          title='Periksa Berkas SKPP'
        >
          <FolderSearch className='h-3.5 w-3.5' />
          <span className='text-xs'>{isBendahara ? 'Detail' : 'Periksa'}</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuLabel>Aksi Dokumen</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row)
              setOpen('periksa')
            }}
          >
            <FolderSearch className='mr-2 h-4 w-4 text-primary' />
            <span>{isBendahara ? 'Lihat Detail Berkas' : 'Periksa Berkas'}</span>
          </DropdownMenuItem>

          {/* TTE action if accepted, not signed yet, and matches target signer */}
          {isDiterima && !isSigned && isTargetSigner && (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row)
                setOpen('tte')
              }}
            >
              <KeyRound className='mr-2 h-4 w-4 text-blue-600' />
              <span>TTE Dokumen</span>
            </DropdownMenuItem>
          )}

          {/* Cetak SKPP TTE if signed */}
          {isSigned && (
            <DropdownMenuItem onClick={handleDownloadTte}>
              <Printer className='mr-2 h-4 w-4 text-emerald-600' />
              <span>Cetak SKPP TTE</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row)
              setOpen('edit')
            }}
          >
            <Pencil className='mr-2 h-4 w-4 text-amber-500' />
            <span>Edit Data</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row)
              setOpen('delete')
            }}
            className='text-destructive focus:text-destructive'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            <span>Hapus SKPP</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
