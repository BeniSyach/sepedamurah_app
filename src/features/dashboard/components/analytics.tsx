import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useGetCheckFungsional, useGetCountFungsional } from '@/api'
import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { formatTanggaldanJam } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function SkeletonTable() {
  return (
    <Card className='overflow-hidden rounded-2xl shadow-lg'>
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-5 w-40' />
        </CardTitle>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-40'>
                  <Skeleton className='h-4 w-24' />
                </TableHead>
                <TableHead colSpan={12} className='text-center'>
                  <Skeleton className='mx-auto h-4 w-32' />
                </TableHead>
              </TableRow>

              <TableRow className='bg-muted/30'>
                <TableHead></TableHead>
                {[...Array(12)].map((_, i) => (
                  <TableHead key={i} className='w-16 text-center'>
                    <Skeleton className='mx-auto h-4 w-6' />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {[...Array(6)].map((_, r) => (
                <TableRow key={r} className='border-b'>
                  <TableCell>
                    <Skeleton className='h-4 w-40' />
                  </TableCell>

                  {[...Array(12)].map((_, c) => (
                    <TableCell key={c} className='text-center'>
                      <Skeleton className='mx-auto h-6 w-6 rounded-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-4 w-40' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-16' />
        <Skeleton className='mt-2 h-3 w-32' />
      </CardContent>
    </Card>
  )
}

export function Analytics() {
  const [tahun, setTahun] = useState<string>('')
  // === API Call ===
  const { data: datacheck, isLoading: loadingDataCheck } =
    useGetCheckFungsional({
      kd_opd1: '',
      kd_opd2: '',
      kd_opd3: '',
      kd_opd4: '',
      kd_opd5: '',
      tahun,
    })

  const { data: dataCount, isLoading: loadingDataCount } =
    useGetCountFungsional({
      kd_opd1: '',
      kd_opd2: '',
      kd_opd3: '',
      kd_opd4: '',
      kd_opd5: '',
      tahun,
    })

  const tahunList = datacheck?.data?.tahun_list ?? []
  const tahunSelected = datacheck?.data?.tahun_selected ?? ''

  // const [tahun, setTahun] = useState(tahunSelected)

  // Update tahun ketika data API pertama kali masuk
  useEffect(() => {
    if (tahunSelected) setTahun(tahunSelected)
  }, [tahunSelected])

  // Data untuk tabel
  const dataMasuk = datacheck?.data?.penerimaan ?? []
  const dataKeluar = datacheck?.data?.pengeluaran ?? []

  const isLoading = loadingDataCheck || loadingDataCount

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {/* Select Tahun */}
        <Skeleton className='h-10 w-40' />

        {/* Summary Cards */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Tabel Skeleton */}
        <SkeletonTable />
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className='bg-background min-h-screen w-full space-y-6'>
      {/* Filter Tahun */}
      <div className='flex justify-start'>
        <Select value={tahun} onValueChange={setTahun}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Pilih Tahun' />
          </SelectTrigger>
          <SelectContent>
            {tahunList.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ==== Cards Summary ==== */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {/* TOTAL BERKAS */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Berkas Fungsional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {(dataCount?.data.total_penerimaan ?? 0) +
                (dataCount?.data.total_pengeluaran ?? 0)}
            </div>
            <p className='text-muted-foreground text-xs'>
              Terhitung sampai tanggal <br />
              {formatTanggaldanJam(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}
            </p>
          </CardContent>
        </Card>

        {/* PENERIMAAN VERIFIKASI */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Berkas Penerimaan Diverifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dataCount?.data.total_penerimaan_verifikasi ?? 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              Terhitung sampai tanggal <br />
              {formatTanggaldanJam(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}
            </p>
          </CardContent>
        </Card>

        {/* PENGELUARAN VERIFIKASI */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Berkas Pengeluaran Diverifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dataCount?.data.total_pengeluaran_verifikasi ?? 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              Terhitung sampai tanggal <br />
              {formatTanggaldanJam(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}
            </p>
          </CardContent>
        </Card>

        {/* DITOLAK */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Fungsional Ditolak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dataCount?.data.total_ditolak ?? 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              Terhitung sampai tanggal <br />
              {formatTanggaldanJam(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ============================= */}
      {/*       TABLE PENERIMAAN       */}
      {/* ============================= */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='space-y-6'
      >
        <Card className='overflow-hidden rounded-2xl shadow-lg'>
          <CardHeader>
            <CardTitle className='text-md'>Penerimaan per SKPD</CardTitle>
          </CardHeader>

          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKPD</TableHead>
                    <TableHead
                      colSpan={12}
                      className='text-center font-semibold'
                    >
                      Bulan
                    </TableHead>
                  </TableRow>

                  <TableRow className='bg-muted/30'>
                    <TableHead></TableHead>
                    {[...Array(12)].map((_, i) => (
                      <TableHead
                        key={i}
                        className='w-16 text-center font-semibold'
                      >
                        {i + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {dataMasuk.map((row, idx) => (
                    <motion.tr
                      key={row.skpd}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className='hover:bg-muted/20 border-b'
                    >
                      <TableCell className='max-w-[200px] font-medium break-words whitespace-normal'>
                        {row.skpd}
                      </TableCell>

                      {Object.values(row.bulan).map((val, i) => (
                        <TableCell key={i} className='p-3 text-center'>
                          {val ? (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white'
                            >
                              <Check className='h-4 w-4' />
                            </motion.div>
                          ) : (
                            <X className='mx-auto h-6 w-6 text-red-500' />
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ============================= */}
        {/*      TABLE PENGELUARAN       */}
        {/* ============================= */}
        <Card className='overflow-hidden rounded-2xl shadow-lg'>
          <CardHeader>
            <CardTitle className='text-md'>Pengeluaran per SKPD</CardTitle>
          </CardHeader>

          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKPD</TableHead>
                    <TableHead
                      colSpan={12}
                      className='text-center font-semibold'
                    >
                      Bulan
                    </TableHead>
                  </TableRow>

                  <TableRow className='bg-muted/30'>
                    <TableHead></TableHead>
                    {[...Array(12)].map((_, i) => (
                      <TableHead
                        key={i}
                        className='w-16 text-center font-semibold'
                      >
                        {i + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {dataKeluar.map((row, idx) => (
                    <motion.tr
                      key={row.skpd}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className='hover:bg-muted/20 border-b'
                    >
                      <TableCell className='max-w-[200px] font-medium break-words whitespace-normal'>
                        {row.skpd}
                      </TableCell>

                      {Object.values(row.bulan).map((val, i) => (
                        <TableCell key={i} className='p-3 text-center'>
                          {val ? (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white'
                            >
                              <Check className='h-4 w-4' />
                            </motion.div>
                          ) : (
                            <X className='mx-auto h-6 w-6 text-red-500' />
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
