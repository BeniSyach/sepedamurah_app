import { useEffect, useState } from 'react'
import {
  useGetDashboardRekonGaji,
  type DashboardPajakBendaharaRow,
} from '@/api'
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

export function DashboardRekonGaji() {
  const [tahun, setTahun] = useState<string>('')

  const { data: datacheck, isLoading: loadingDataCheck } =
    useGetDashboardRekonGaji({
      tahun,
    })

  const tahunList = datacheck?.data?.tahun_list ?? []
  const tahunSelected = datacheck?.data?.tahun_selected ?? ''

  const referensi = datacheck?.data?.referensi ?? []
  const rows = datacheck?.data?.rows ?? []

  useEffect(() => {
    if (tahunSelected) {
      setTahun(tahunSelected)
    }
  }, [tahunSelected])

  if (loadingDataCheck) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-10 w-40' />

        <Card className='rounded-2xl'>
          <CardContent className='p-6'>
            <SkeletonTable />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='bg-background min-h-screen w-full space-y-6'>
      {/* FILTER */}
      <div className='flex flex-wrap items-center gap-4'>
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

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className='overflow-hidden rounded-2xl border shadow-lg'>
          <CardHeader className='border-b'>
            <CardTitle className='text-lg font-semibold'>
              Dashboard Rekonsiliasi Gaji SKPD
            </CardTitle>
          </CardHeader>

          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  {/* HEADER UTAMA */}
                  <TableRow className='bg-muted/40'>
                    {/* SKPD */}
                    <TableHead
                      rowSpan={2}
                      className='bg-background sticky left-0 z-20 min-w-[300px] border-r text-center align-middle text-sm font-bold'
                    >
                      SKPD
                    </TableHead>

                    {/* GROUP REFERENSI */}
                    <TableHead
                      colSpan={referensi.length}
                      className='text-center text-base font-bold tracking-wide'
                    >
                      Referensi Rekonsiliasi Gaji SKPD
                    </TableHead>
                  </TableRow>

                  {/* HEADER REFERENSI */}
                  <TableRow className='bg-muted/20'>
                    {referensi.map((ref: string) => (
                      <TableHead
                        key={ref}
                        className='min-w-[120px] border-b text-center text-sm font-semibold whitespace-nowrap'
                      >
                        <div className='flex flex-col items-center justify-center'>
                          <span className='mt-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
                            {ref}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length > 0 ? (
                    rows.map(
                      (row: DashboardPajakBendaharaRow, rowIdx: number) => (
                        <motion.tr
                          key={rowIdx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: rowIdx * 0.02 }}
                          className='hover:bg-muted/20 border-b transition-colors'
                        >
                          {/* SKPD */}
                          <TableCell className='bg-background sticky left-0 z-10 max-w-[300px] border-r font-medium whitespace-normal'>
                            {row.skpd}
                          </TableCell>

                          {/* STATUS */}
                          {referensi.map((ref: string) => {
                            const value = row[ref]

                            return (
                              <TableCell key={ref} className='p-3 text-center'>
                                {value === 1 ? (
                                  <motion.div
                                    initial={{
                                      scale: 0.5,
                                      opacity: 0,
                                    }}
                                    animate={{
                                      scale: 1,
                                      opacity: 1,
                                    }}
                                    whileHover={{
                                      scale: 1.15,
                                    }}
                                    transition={{
                                      duration: 0.2,
                                    }}
                                    className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white shadow'
                                  >
                                    <Check className='h-4 w-4' />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    initial={{
                                      scale: 0.5,
                                      opacity: 0,
                                    }}
                                    animate={{
                                      scale: 1,
                                      opacity: 1,
                                    }}
                                    whileHover={{
                                      scale: 1.15,
                                    }}
                                    transition={{
                                      duration: 0.2,
                                    }}
                                    className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow'
                                  >
                                    <X className='h-4 w-4' />
                                  </motion.div>
                                )}
                              </TableCell>
                            )
                          })}
                        </motion.tr>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={referensi.length + 1}
                        className='text-muted-foreground py-10 text-center'
                      >
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
