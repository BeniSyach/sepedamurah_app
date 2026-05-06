import { useEffect, useState } from 'react'
import { useGetBelanjaSKPD, useGetRefJenisBelanja } from '@/api'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
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
  TableFooter,
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

export function DashboardBelanjaSKPD() {
  const [tahun, setTahun] = useState<string>('')
  const [jenis, setJenis] = useState<string>('5|1|01')
  const [kd1, kd2, kd3] = (jenis || '').split('|')
  const [activeCell, setActiveCell] = useState<string | null>(null)

  const { data: datacheck, isLoading: loadingDataCheck } = useGetBelanjaSKPD({
    kd_belanja1: kd1 || '',
    kd_belanja2: kd2 || '',
    kd_belanja3: kd3 || '',
    tahun,
  })

  const { data: dataBelanja, isLoading: loadingBelanja } =
    useGetRefJenisBelanja({})

  const getRowTotal = (bulan: Record<string, number | boolean>) => {
    return Object.values(bulan)
      .filter((val): val is number => typeof val === 'number')
      .reduce((sum, val) => sum + val, 0)
  }

  const tahunList = datacheck?.data?.tahun_list ?? []
  const tahunSelected = datacheck?.data?.tahun_selected ?? ''
  const dataBelanjaList = dataBelanja?.data ?? []

  useEffect(() => {
    if (tahunSelected) setTahun(tahunSelected)
  }, [tahunSelected])

  const dataMasuk = datacheck?.data?.belanja ?? []

  if (loadingDataCheck || loadingBelanja) {
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
      <div className='flex items-center gap-4'>
        {/* Tahun */}
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

        {/* Jenis */}
        <Select value={jenis} onValueChange={setJenis}>
          <SelectTrigger className='w-100'>
            <SelectValue placeholder='Pilih Jenis Belanja' />
          </SelectTrigger>
          <SelectContent>
            {dataBelanjaList.map((db) => (
              <SelectItem
                key={db.nm_belanja}
                value={`${db.kd_ref1}|${db.kd_ref2}|${db.kd_ref3}`}
              >
                {db.nm_belanja}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='space-y-6'
      >
        <Card className='overflow-hidden rounded-2xl shadow-lg'>
          <CardHeader>
            <CardTitle className='text-md'>Data Belanja per SKPD</CardTitle>
          </CardHeader>

          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKPD</TableHead>
                    <TableHead
                      colSpan={13}
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
                    <TableHead className='text-right'>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {dataMasuk.map((row, rowIdx) => {
                    const total = getRowTotal(row.bulan)

                    return (
                      <motion.tr
                        key={row.skpd}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIdx * 0.05 }}
                        className='hover:bg-muted/20 border-b'
                      >
                        <TableCell className='max-w-[200px] font-medium break-words whitespace-normal'>
                          {row.skpd}
                        </TableCell>

                        {Object.entries(row.bulan).map(
                          ([bulanKey, val], colIdx) => {
                            const cellKey = `${rowIdx}-${bulanKey}`
                            const isActive = activeCell === cellKey

                            return (
                              <TableCell
                                key={colIdx}
                                className='cursor-pointer p-3 text-center'
                                onClick={() =>
                                  setActiveCell(isActive ? null : cellKey)
                                }
                              >
                                {val && val > 0 ? (
                                  isActive ? (
                                    <span className='font-semibold text-green-600'>
                                      Rp {val.toLocaleString('id-ID')}
                                    </span>
                                  ) : (
                                    <motion.div
                                      initial={{ scale: 0.5, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white'
                                    >
                                      <Check className='h-4 w-4' />
                                    </motion.div>
                                  )
                                ) : (
                                  <X className='mx-auto h-6 w-6 text-red-500' />
                                )}
                              </TableCell>
                            )
                          }
                        )}

                        {/* 🔥 KOLOM TOTAL */}
                        <TableCell className='p-3 text-right font-bold text-blue-600'>
                          Rp {total.toLocaleString('id-ID')}
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow className='bg-muted/50 font-bold'>
                    {/* bawah SKPD */}
                    <TableCell>Total</TableCell>

                    {/* kolom bulan kosong */}
                    {Object.keys(dataMasuk[0]?.bulan || {}).map((_, i) => (
                      <TableCell key={i}></TableCell>
                    ))}

                    {/* 🔥 grand total */}
                    <TableCell className='text-red-600'>
                      <div className='flex w-full items-center justify-center text-sm whitespace-nowrap md:text-sm'>
                        Rp.&nbsp;
                        {dataMasuk
                          .reduce((sum, row) => {
                            const rowTotal = Object.values(row.bulan).reduce(
                              (s: number, val) =>
                                s + (typeof val === 'number' ? val : 0),
                              0
                            )
                            return sum + rowTotal
                          }, 0 as number)
                          .toLocaleString('id-ID')}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
