import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Search,
  FileText,
  Users,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  useGetMonitoringDPA,
  useGetMonitoringDPATypes,
  useGetMonitoringDPAYears,
} from '@/api/dashboard/use-get-monitoring-dpa'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatCard } from './stat-card'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.22 } },
}

// const rowVariants = {
//   hidden: { opacity: 0, x: -8 },
//   show: { opacity: 1, x: 0 },
// }

const cardAnim = {
  hidden: { opacity: 0, scale: 0.995 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
}

const DashboardMonitoringDPA = () => {
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear().toString()
  )
  const [selectedDPA, setSelectedDPA] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // 🟢 Load years & dpa types
  const { data: yearsData, isLoading: loadingYears } =
    useGetMonitoringDPAYears()
  const { data: dpaTypesData, isLoading: loadingDpaTypes } =
    useGetMonitoringDPATypes()

  // 🟢 Load monitoring data (auto-refetch saat tahun / DPA berubah)
  const {
    data: monitoringData,
    isLoading,
    error,
  } = useGetMonitoringDPA({
    tahun: selectedYear,
    dpa_id: selectedDPA !== 'all' ? selectedDPA : undefined,
  })

  const shouldReduceMotion = useReducedMotion()

  const years = yearsData?.data ?? []
  const dpaTypes = dpaTypesData?.data ?? []
  const data = monitoringData?.data?.monitoring ?? []

  // 🔵 Summary
  const summary = useMemo(() => {
    const total = data.length
    const uploaded = data.filter((i) => i.status === 'Sudah Upload').length
    const notUploaded = total - uploaded
    const percentage = total > 0 ? Math.round((uploaded / total) * 100) : 0

    return { total, uploaded, notUploaded, percentage }
  }, [data])

  // 🔵 Filtering table
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.nama_skpd.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kd_opd.includes(searchTerm)

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'sudah' && item.status === 'Sudah Upload') ||
        (statusFilter === 'belum' && item.status === 'Belum Upload')

      return matchSearch && matchStatus
    })
  }, [data, searchTerm, statusFilter])

  // 🔵 Chart data
  const chartDataByDPA = useMemo(() => {
    const groups: Record<
      string,
      { name: string; uploaded: number; notUploaded: number }
    > = {}

    data.forEach((item) => {
      if (!groups[item.nama_dpa]) {
        groups[item.nama_dpa] = {
          name: item.nama_dpa,
          uploaded: 0,
          notUploaded: 0,
        }
      }

      if (item.status === 'Sudah Upload') {
        groups[item.nama_dpa].uploaded++
      } else {
        groups[item.nama_dpa].notUploaded++
      }
    })

    return Object.values(groups)
  }, [data])

  const pieData = [
    { name: 'Sudah Upload', value: summary.uploaded, color: '#10b981' },
    { name: 'Belum Upload', value: summary.notUploaded, color: '#ef4444' },
  ]
  // 🔴 Error Handling
  if (error) {
    return (
      <div className='flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Terjadi kesalahan saat memuat data dashboard.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <motion.div
      className='min-h-screen bg-slate-50 p-6 transition-colors dark:bg-slate-900'
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'show'}
      variants={containerVariants}
    >
      <div className='mx-auto max-w-7xl space-y-6'>
        {/** ====================== HEADER ====================== */}
        <motion.div variants={fadeUp}>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
                Dashboard Monitoring Upload DPA
              </h1>
              <p className='mt-1 text-slate-600 dark:text-slate-300'>
                Monitoring SKPD yang belum upload laporan DPA
              </p>
            </div>
          </div>
        </motion.div>

        {/** ====================== FILTER ====================== */}
        <motion.div variants={fadeUp}>
          <Card className='bg-white dark:bg-slate-800'>
            <CardHeader>
              <CardTitle className='text-lg text-slate-900 dark:text-slate-50'>
                Filter Data
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                {/** Tahun */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Tahun
                  </label>
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                    disabled={loadingYears}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih Tahun' />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/** DPA */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Jenis DPA
                  </label>
                  <Select
                    value={selectedDPA}
                    onValueChange={setSelectedDPA}
                    disabled={loadingDpaTypes}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Semua DPA' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua DPA</SelectItem>
                      {dpaTypes.map((dpa) => (
                        <SelectItem key={dpa.id} value={String(dpa.id)}>
                          {dpa.nm_dpa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/** Status */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Status Upload
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder='Semua Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Status</SelectItem>
                      <SelectItem value='sudah'>Sudah Upload</SelectItem>
                      <SelectItem value='belum'>Belum Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/** Search */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Cari SKPD
                  </label>
                  <div className='relative'>
                    <Search className='absolute top-2.5 left-2 h-4 w-4 text-slate-400' />
                    <Input
                      placeholder='Cari nama SKPD...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='pl-8'
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/** ================= LOADING ================= */}
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
            <span className='ml-2 text-slate-600 dark:text-slate-300'>
              Memuat data...
            </span>
          </div>
        ) : (
          <>
            {/** ================= STAT CARDS ================= */}
            <motion.div
              className='grid grid-cols-1 gap-4 md:grid-cols-4'
              variants={containerVariants}
              initial='hidden'
              animate='show'
            >
              <motion.div variants={cardAnim} layout>
                <StatCard
                  title='Total SKPD'
                  value={summary.total}
                  icon={Building2}
                  color='text-blue-600'
                />
              </motion.div>

              <motion.div variants={cardAnim} layout>
                <StatCard
                  title='Sudah Upload'
                  value={summary.uploaded}
                  icon={CheckCircle2}
                  color='text-green-600'
                />
              </motion.div>

              <motion.div variants={cardAnim} layout>
                <StatCard
                  title='Belum Upload'
                  value={summary.notUploaded}
                  icon={XCircle}
                  color='text-red-600'
                />
              </motion.div>

              <motion.div variants={cardAnim} layout>
                <StatCard
                  title='Persentase Upload'
                  value={`${summary.percentage}%`}
                  icon={TrendingUp}
                  color='text-purple-600'
                  subtitle={`${summary.uploaded} dari ${summary.total} SKPD`}
                />
              </motion.div>
            </motion.div>

            {/** ================= CHARTS ================= */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
              <Card className='bg-white lg:col-span-2 dark:bg-slate-800'>
                <CardHeader>
                  <CardTitle className='text-slate-900 dark:text-slate-50'>
                    Progress Upload per Jenis DPA
                  </CardTitle>
                  <CardDescription className='text-slate-600 dark:text-slate-300'>
                    Perbandingan status upload berdasarkan jenis DPA
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={chartDataByDPA}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='name'
                        angle={-15}
                        textAnchor='end'
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey='uploaded'
                        fill='#10b981'
                        name='Sudah Upload'
                      />
                      <Bar
                        dataKey='notUploaded'
                        fill='#ef4444'
                        name='Belum Upload'
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className='bg-white dark:bg-slate-800'>
                <CardHeader>
                  <CardTitle className='text-slate-900 dark:text-slate-50'>
                    Status Upload
                  </CardTitle>
                  <CardDescription className='text-slate-600 dark:text-slate-300'>
                    Distribusi status upload secara keseluruhan
                  </CardDescription>
                </CardHeader>

                <CardContent className='flex items-center justify-center'>
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx='50%'
                        cy='50%'
                        outerRadius={80}
                        dataKey='value'
                        label={({ name, percent = 0 }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {summary.notUploaded > 0 && (
              <div>
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    Terdapat {summary.notUploaded} SKPD yang belum upload DPA.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/** ================= TABLE ================= */}
            <div>
              <Card className='bg-white dark:bg-slate-800'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-slate-900 dark:text-slate-50'>
                    <FileText className='h-5 w-5' />
                    Detail Data Monitoring SKPD
                  </CardTitle>
                  <CardDescription className='text-slate-600 dark:text-slate-300'>
                    Menampilkan {filteredData.length} dari {data.length} data
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className='overflow-x-auto'>
                    <table className='w-full'>
                      <thead className='border-b bg-slate-50 dark:bg-slate-700'>
                        <tr>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            No
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            Kode OPD
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            Nama SKPD
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            Jenis DPA
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            Status Upload
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            Tanggal Upload
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            Status Proses
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            Operator
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold'>
                            Aksi
                          </th>
                        </tr>
                      </thead>

                      <tbody className='divide-y'>
                        {filteredData.length === 0 ? (
                          <tr>
                            <td
                              colSpan={9}
                              className='px-4 py-8 text-center text-slate-500 dark:text-slate-300'
                            >
                              <Users className='mx-auto mb-2 h-12 w-12 opacity-30' />
                              <p>Tidak ada data yang ditampilkan</p>
                            </td>
                          </tr>
                        ) : (
                          <AnimatePresence initial={false}>
                            {filteredData.map((item, index) => (
                              <tr
                                key={item.id ?? index}
                                // variants={rowVariants}
                                // initial='hidden'
                                // animate='show'
                                // exit='hidden'
                                // layout
                                className={`hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                  item.status === 'Belum Upload'
                                    ? 'bg-red-50 dark:bg-red-900/30'
                                    : ''
                                }`}
                              >
                                <td className='px-4 py-3 text-sm'>
                                  {index + 1}
                                </td>
                                <td className='px-4 py-3'>
                                  <code className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-800 dark:bg-slate-700 dark:text-slate-100'>
                                    {item.kd_opd}
                                  </code>
                                </td>

                                <td className='px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50'>
                                  {item.nama_skpd}
                                </td>

                                <td className='px-4 py-3'>
                                  <Badge className='border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30'>
                                    {item.nama_dpa}
                                  </Badge>
                                </td>

                                <td className='px-4 py-3'>
                                  {item.status === 'Sudah Upload' ? (
                                    <Badge className='bg-green-100 text-green-700'>
                                      <CheckCircle2 className='mr-1 h-3 w-3' />
                                      Sudah Upload
                                    </Badge>
                                  ) : (
                                    <Badge variant='destructive'>
                                      <XCircle className='mr-1 h-3 w-3' />
                                      Belum Upload
                                    </Badge>
                                  )}
                                </td>

                                <td className='px-4 py-3 text-sm'>
                                  {item.tanggal_upload
                                    ? new Date(
                                        item.tanggal_upload
                                      ).toLocaleString('id-ID')
                                    : '-'}
                                </td>

                                <td className='px-4 py-3'>
                                  {item.status === 'Sudah Upload' ? (
                                    <Badge
                                      variant='outline'
                                      className={
                                        item.proses_status ===
                                        'Berkas telah diverifikasi'
                                          ? 'border-green-200 bg-green-50 text-green-700'
                                          : item.proses_status ===
                                              'Berkas sedang diproses'
                                            ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                            : item.proses_status ===
                                                'Berkas ditolak'
                                              ? 'border-red-200 bg-red-50 text-red-700'
                                              : item.proses_status ===
                                                  'Berkas terkirim'
                                                ? 'border-slate-200 bg-slate-50 text-slate-700'
                                                : 'border-slate-200 bg-slate-50 text-slate-500'
                                      }
                                    >
                                      {item.proses_status ?? '-'}
                                    </Badge>
                                  ) : (
                                    <span className='text-slate-400'>-</span>
                                  )}
                                </td>

                                <td className='px-4 py-3 text-sm text-slate-900 dark:text-slate-50'>
                                  {item.operator ?? '-'}
                                </td>

                                <td className='px-4 py-3'>
                                  {item.status === 'Sudah Upload' ? (
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='text-xs'
                                    >
                                      Lihat Detail
                                    </Button>
                                  ) : (
                                    <span className='text-slate-400'>-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </AnimatePresence>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default DashboardMonitoringDPA
