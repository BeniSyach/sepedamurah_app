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
  CheckCircle2,
  FileCheck2,
  KeyRound,
  Download,
  Printer,
  FileText,
  MoreHorizontal,
  FolderSearch,
  DollarSign,
  Clock,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

function SkppDiterimaContent() {
  const { data, isLoading, meta, setOpen, setCurrentRow, isBendahara } = useSkpp()

  const totalBersih = useMemo(
    () => data.reduce((acc, curr) => acc + (curr.jumlah_bersih || 0), 0),
    [data]
  )
  const countSudahTte = useMemo(
    () => data.filter((d) => d.status_tte === 'Sudah TTE').length,
    [data]
  )
  const countBelumTte = useMemo(
    () => data.filter((d) => d.status_tte !== 'Sudah TTE').length,
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
          <div className='flex flex-col gap-0.5 max-w-[220px]'>
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
      accessorKey: 'tgl_diterima',
      header: 'Diterima Pada & Operator',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className='flex flex-col gap-0.5 text-xs'>
            <span className='font-medium text-emerald-700 dark:text-emerald-400'>
              {item.tgl_diterima || '-'}
            </span>
            <span className='text-[11px] text-muted-foreground'>
              Oleh: {item.operator_nama || 'Operator BPKAD'}
            </span>
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
        <span className='font-semibold text-emerald-600 dark:text-emerald-400 text-sm'>
          {formatRupiah(row.original.jumlah_bersih)}
        </span>
      ),
    },
    {
      accessorKey: 'status_tte',
      header: 'Status TTE',
      cell: ({ row }) => {
        const sudah = row.original.status_tte === 'Sudah TTE'
        return sudah ? (
          <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 flex items-center gap-1 w-fit'>
            <FileCheck2 className='w-3.5 h-3.5' /> Sudah TTE
          </Badge>
        ) : (
          <Badge variant='outline' className='text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 flex items-center gap-1 w-fit'>
            <Clock className='w-3.5 h-3.5' /> Belum TTE
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const item = row.original
        const sudahTte = item.status_tte === 'Sudah TTE'

        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

        return (
          <div className='flex items-center gap-1.5'>
            {sudahTte ? (
              <Button
                variant='outline'
                size='sm'
                className='h-8 px-2.5 text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 flex items-center gap-1 text-xs'
                onClick={() => window.open(`${API_URL}/skpp/${item.id}/download-tte`, '_blank')}
                title='Unduh Dokumen Hasil TTE'
              >
                <Download className='w-3.5 h-3.5' />
                <span>Unduh TTE</span>
              </Button>
            ) : isBendahara ? (
              <Button
                variant='outline'
                size='sm'
                className='h-8 px-2.5 text-primary border-primary/30 hover:bg-primary/10 flex items-center gap-1 text-xs'
                onClick={() => window.open(`${API_URL}/skpp/${item.id}/pdf`, '_blank')}
                title='Lihat / Cetak Dokumen Asli (PDF)'
              >
                <Printer className='w-3.5 h-3.5' />
                <span>Cetak Asli</span>
              </Button>
            ) : (
              <Button
                variant='default'
                size='sm'
                className='h-8 px-2.5 bg-primary hover:bg-primary/90 flex items-center gap-1 text-xs text-white'
                onClick={() => {
                  setCurrentRow(item)
                  setOpen('tte')
                }}
                title='Tanda Tangan Elektronik Dokumen'
              >
                <KeyRound className='w-3.5 h-3.5' />
                <span>TTE Berkas</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-52'>
                <DropdownMenuLabel>Aksi Dokumen</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentRow(item)
                    setOpen('periksa')
                  }}
                >
                  <FolderSearch className='mr-2 h-4 w-4 text-primary' />
                  <span>{isBendahara ? 'Lihat Detail' : 'Periksa Kembali'}</span>
                </DropdownMenuItem>

                {/* LIHAT DOKUMEN ASLI DARI BACKEND */}
                <DropdownMenuItem
                  onClick={() => window.open(`${API_URL}/skpp/${item.id}/pdf`, '_blank')}
                >
                  <Printer className='mr-2 h-4 w-4 text-slate-600' />
                  <span>Lihat Dokumen Asli (PDF)</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setCurrentRow(item)
                    setOpen('preview')
                  }}
                >
                  <FileText className='mr-2 h-4 w-4 text-blue-500' />
                  <span>Pratinjau PDF Modal</span>
                </DropdownMenuItem>

                {sudahTte && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => window.open(`${API_URL}/skpp/${item.id}/download-tte`, '_blank')}
                    >
                      <Download className='mr-2 h-4 w-4 text-emerald-600' />
                      <span>Download File TTE</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
              <CheckCircle2 className='w-6 h-6 text-emerald-600' />
              SKPP — Diterima
            </h2>
            <p className='text-xs sm:text-sm text-muted-foreground'>
              Daftar dokumen SKPP yang telah disetujui / diterima dan siap untuk ditandatangani secara elektronik (TTE)
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5'>
          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Total SKPP Diterima</p>
                <h3 className='text-xl font-bold mt-0.5'>{meta?.total ?? data.length}</h3>
                <p className='text-[11px] text-muted-foreground mt-0.5 font-medium'>
                  <span className='text-blue-600 dark:text-blue-400'>{countMutasi} Mutasi</span> • <span className='text-amber-600 dark:text-amber-400'>{countPensiun} Pensiun</span>
                </p>
              </div>
              <div className='h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600'>
                <CheckCircle2 className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Sudah TTE</p>
                <h3 className='text-xl font-bold text-blue-600 mt-0.5'>{countSudahTte}</h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600'>
                <FileCheck2 className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Belum TTE</p>
                <h3 className='text-xl font-bold text-amber-600 mt-0.5'>{countBelumTte}</h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600'>
                <Clock className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Total Gaji Bersih</p>
                <h3 className='text-lg font-bold text-emerald-600 mt-0.5'>
                  {formatRupiah(totalBersih)}
                </h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600'>
                <DollarSign className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar Filter */}
        <div className='mb-4'>
          <SkppToolbar placeholder='Cari nomor surat, nama pegawai, NIP, pembuat...' />
        </div>

        {/* Tabel Data Diterima */}
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
                    Memuat data SKPP Diterima...
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
                    Belum ada dokumen SKPP yang diterima.
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

export function SkppDiterimaPage() {
  return (
    <SkppProvider menu='diterima'>
      <SkppDiterimaContent />
    </SkppProvider>
  )
}

export default SkppDiterimaPage
