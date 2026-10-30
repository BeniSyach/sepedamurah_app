import { useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  XCircle,
  AlertCircle,
  Printer,
  DollarSign,
  RotateCcw,
  Eye,
} from 'lucide-react'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SkppProvider, useSkpp } from '../components/skpp-provider'
import { SkppDialogs } from '../components/skpp-dialogs'
import { SkppToolbar } from '../components/skpp-toolbar'
import { SkppPagination } from '../components/skpp-pagination'
import { type SkppData, formatRupiah } from '../types'

function SkppDitolakContent() {
  const { data, isLoading, meta, setOpen, setCurrentRow, isBendahara } = useSkpp()

  const totalBersih = useMemo(
    () => data.reduce((acc, curr) => acc + (curr.jumlah_bersih || 0), 0),
    [data]
  )
  const countPensiun = useMemo(
    () => data.filter((d) => d.jenis_skpp?.toLowerCase() === 'pensiun').length,
    [data]
  )
  const countMutasi = useMemo(
    () => data.filter((d) => d.jenis_skpp?.toLowerCase() !== 'pensiun').length,
    [data]
  )

  const columns: ColumnDef<SkppData>[] = [
    {
      accessorKey: 'nomor_surat',
      header: 'Nomor Surat & Tanggal',
      cell: ({ row }) => {
        const item = row.original
        const isPensiun = item.jenis_skpp?.toLowerCase() === 'pensiun'

        return (
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-1.5 flex-wrap'>
              <span className='font-semibold text-primary'>{item.nomor_surat}</span>
              <Badge
                variant='outline'
                className={
                  isPensiun
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 text-[10px] px-1.5 py-0 font-medium'
                    : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 text-[10px] px-1.5 py-0 font-medium'
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
        const isPensiun = item.jenis_skpp?.toLowerCase() === 'pensiun'

        return (
          <div className='flex flex-col gap-0.5 max-w-[200px]'>
            <span className='text-xs font-medium text-foreground truncate' title={item.unit_kerja}>
              {item.unit_kerja}
            </span>
            {isPensiun ? (
              <div className='flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400'>
                <span className='font-medium'>➔ Pensiun:</span>
                <span className='truncate' title={item.alasan_pensiun || 'Pensiun'}>
                  {item.alasan_pensiun || 'Pensiun'}
                </span>
              </div>
            ) : (
              <div className='flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400'>
                <span className='font-medium'>➔ Mutasi:</span>
                <span className='truncate' title={item.mutasi_ke}>
                  {item.mutasi_ke || '-'}
                </span>
              </div>
            )}
            {item.nomor_sk && (
              <span className='text-[10px] text-muted-foreground truncate'>
                SK: {item.nomor_sk}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'alasan_tolak',
      header: 'Alasan Penolakan',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className='flex flex-col gap-1 max-w-[280px]'>
            <div className='flex items-start gap-1.5 p-2 bg-destructive/10 border border-destructive/20 rounded-md text-xs text-destructive'>
              <AlertCircle className='w-4 h-4 shrink-0 mt-0.5' />
              <div>
                <p className='font-medium'>{item.alasan_tolak || 'Tidak ada keterangan alasan.'}</p>
                <div className='text-[10px] text-muted-foreground mt-1'>
                  Ditolak: {item.tgl_ditolak || '-'} • Oleh: {item.operator_nama || 'Operator'}
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'pembuat',
      header: 'Dibuat Oleh',
      cell: ({ row }) => {
        const item = row.original
        const pembuatNama = item.pembuat?.nama || (item.users_id ? `User #${item.users_id}` : '-')
        const pembuatNip = item.pembuat?.nip
        const tglUpload = item.tanggal_upload || item.created_at

        return (
          <div className='flex flex-col gap-0.5 text-xs max-w-[180px]'>
            <span className='font-medium text-foreground truncate' title={pembuatNama}>
              {pembuatNama}
            </span>
            {pembuatNip && (
              <span className='text-[11px] font-mono text-muted-foreground truncate'>
                NIP: {pembuatNip}
              </span>
            )}
            {tglUpload && (
              <span className='text-[10px] text-muted-foreground'>
                {tglUpload}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'jumlah_bersih',
      header: 'Jumlah Bersih',
      cell: ({ row }) => (
        <span className='font-semibold text-muted-foreground text-sm'>
          {formatRupiah(row.original.jumlah_bersih)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const item = row.original

        return (
          <div className='flex items-center gap-1.5'>
            <Button
              variant='outline'
              size='sm'
              className='h-8 px-2.5 text-primary hover:bg-primary/10 flex items-center gap-1 text-xs'
              onClick={() => {
                setCurrentRow(item)
                setOpen('periksa')
              }}
              title={isBendahara ? 'Lihat Detail Berkas' : 'Periksa Ulang Berkas'}
            >
              {isBendahara ? <Eye className='w-3.5 h-3.5' /> : <RotateCcw className='w-3.5 h-3.5' />}
              <span>{isBendahara ? 'Lihat Detail' : 'Periksa Ulang'}</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-2 text-muted-foreground hover:text-foreground'
              onClick={() => {
                const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
                window.open(`${API_URL}/skpp/${item.id}/pdf`, '_blank')
              }}
              title='Lihat / Cetak Dokumen Asli SKPP (Backend)'
            >
              <Printer className='w-4 h-4' />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    pageCount: meta?.last_page ?? -1,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Title Bar */}
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
              <XCircle className='w-6 h-6 text-destructive' />
              SKPP — Ditolak
            </h2>
            <p className='text-xs sm:text-sm text-muted-foreground'>
              Daftar berkas permohonan SKPP yang ditolak verifikasi beserta catatan alasan penolakan
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5'>
          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Total SKPP Ditolak</p>
                <h3 className='text-xl font-bold text-destructive mt-0.5'>{meta?.total ?? data.length}</h3>
                <p className='text-[11px] text-muted-foreground mt-0.5 font-medium'>
                  <span className='text-blue-600 dark:text-blue-400'>{countMutasi} Mutasi</span> • <span className='text-amber-600 dark:text-amber-400'>{countPensiun} Pensiun</span>
                </p>
              </div>
              <div className='h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive'>
                <XCircle className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Perlu Tindak Lanjut</p>
                <h3 className='text-xl font-bold text-amber-600 mt-0.5'>{meta?.total ?? data.length}</h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600'>
                <AlertCircle className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Total Nilai Gaji</p>
                <h3 className='text-lg font-bold mt-0.5'>
                  {formatRupiah(totalBersih)}
                </h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                <DollarSign className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar Filter */}
        <div className='mb-4'>
          <SkppToolbar placeholder='Cari nomor surat, nama pegawai, NIP, pembuat...' />
        </div>

        {/* Tabel Data Ditolak */}
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Memuat data SKPP Ditolak...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                    Tidak ada dokumen SKPP yang ditolak.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Server-Side */}
        <div className='mt-4'>
          <SkppPagination />
        </div>
      </Main>

      <SkppDialogs />
    </>
  )
}

export function SkppDitolakPage() {
  return (
    <SkppProvider menu='ditolak'>
      <SkppDitolakContent />
    </SkppProvider>
  )
}

export default SkppDitolakPage
