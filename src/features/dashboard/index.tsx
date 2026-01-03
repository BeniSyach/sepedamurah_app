import { useState } from 'react'
import { format } from 'date-fns'
import { useGetCountData } from '@/api'
import { formatTanggaldanJam } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import DashboardMonitoringDPA from './components/reports'

function SkeletonSummaryCard() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-4 w-4 rounded-full' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-20' />
        <Skeleton className='mt-2 h-3 w-32' />
      </CardContent>
    </Card>
  )
}

function SkeletonRecentSales() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-5 w-40' />
        <Skeleton className='mt-2 h-3 w-32' />
      </CardHeader>
      <CardContent className='space-y-4'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='mt-1 h-3 w-20' />
              </div>
            </div>
            <Skeleton className='h-4 w-10' />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function SkeletonChart() {
  return (
    <Card className='col-span-1 lg:col-span-4'>
      <CardHeader>
        <Skeleton className='h-5 w-60' />
      </CardHeader>
      <CardContent className='flex h-64 items-center justify-center ps-2'>
        <Skeleton className='h-full w-full' />
      </CardContent>
    </Card>
  )
}

function SkeletonTabs() {
  return (
    <div className='w-full overflow-x-auto pb-2'>
      <div className='flex space-x-2'>
        <Skeleton className='h-8 w-20' />
        <Skeleton className='h-8 w-24' />
        <Skeleton className='h-8 w-20' />
        <Skeleton className='h-8 w-28' />
      </div>
    </div>
  )
}
const currentYear = new Date().getFullYear()
export function Dashboard() {
  const [tahun, setTahun] = useState(String(currentYear))

  const tahunList = Array.from({ length: 4 }, (_, i) => currentYear - 3 + i)

  // 🔥 API otomatis refetch saat `tahun` berubah
  const { data, isLoading } = useGetCountData({
    from: '',
    to: '',
    tahun: Number(tahun),
  })
  if (isLoading) {
    return (
      <>
        <Header>
          <TopNav links={topNav} />
          <div className='ms-auto flex items-center space-x-4'>
            <Skeleton className='h-8 w-40' />
            <Skeleton className='h-8 w-8 rounded-full' />
            <Skeleton className='h-8 w-8 rounded-full' />
            <Skeleton className='h-8 w-8 rounded-full' />
          </div>
        </Header>

        <Main>
          <div className='mb-2 flex items-center justify-between'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-8 w-24' />
          </div>

          <SkeletonTabs />

          {/* ===== Summary SPD ===== */}
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
          </div>

          {/* ===== Summary SP2D ===== */}
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
          </div>

          {/* ===== Grafik & Recent Sales ===== */}
          <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <SkeletonChart />
            <div className='col-span-1 lg:col-span-3'>
              <SkeletonRecentSales />
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Utama</TabsTrigger>
              <TabsTrigger value='analytics'>Laporan Fungsional</TabsTrigger>
              <TabsTrigger value='reports'>Laporan DPA</TabsTrigger>
              {/* <TabsTrigger value='notifications'>Notifikasi</TabsTrigger> */}
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='flex justify-start'>
              <Select value={tahun} onValueChange={setTahun}>
                <SelectTrigger className='w-40'>
                  <SelectValue placeholder='Pilih Tahun' />
                </SelectTrigger>
                <SelectContent>
                  {tahunList.map((t) => (
                    <SelectItem key={t} value={String(t)}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Permohonan SPD
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data.total_permohonan_spd}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Terhitung sampai tanggal <br></br>
                    {formatTanggaldanJam(
                      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Berkas SPD Terverifikasi
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data.total_spd_terverifikasi}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Terhitung sampai tanggal <br></br>
                    {formatTanggaldanJam(
                      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Berkas SPD Ditolak
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data.total_spd_ditolak}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Terhitung sampai tanggal <br></br>
                    {formatTanggaldanJam(
                      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>SPD TTE</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data.total_spd_tte}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Terhitung sampai tanggal <br></br>
                    {formatTanggaldanJam(
                      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Permohonan SP2D
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data.total_permohonan_sp2d}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Terhitung sampai tanggal <br></br>
                    {formatTanggaldanJam(
                      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Berkas SP2D Terverifikasi
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data.total_sp2d_terverifikasi}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Terhitung sampai tanggal <br></br>
                    {formatTanggaldanJam(
                      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Berkas SP2D Ditolak
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data.total_sp2d_ditolak}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Terhitung sampai tanggal <br></br>
                    {formatTanggaldanJam(
                      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    SP2D TTE
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data.total_sp2d_tte}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Terhitung sampai tanggal <br></br>
                    {formatTanggaldanJam(
                      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Data Grafik Permohonan SP2D /Bulan</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview tahun={tahun} />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Berkas Masuk</CardTitle>
                  <CardDescription>
                    Menampilkan 5 data Berkas Masuk SP2D
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
          <TabsContent value='reports' className='space-y-4'>
            <DashboardMonitoringDPA />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Halaman Utama',
    href: '/dashboard',
    isActive: true,
    disabled: false,
  },
]
