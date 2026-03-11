import { useState } from 'react'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import {
  type MasterSkpd,
  useGetPermohonanSP2D,
  useCekUploadFungsional,
  useCekLaporanDPA,
  useCekLaporanPajakBendahara,
  useCekLaporanAssetBendahara,
  useCekLaporanSp2bToBUD,
  useCekLaporanRefRekonsiliasiGajiSkpd,
  useGetBatasWaktu,
} from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SkeletonPermohonanSP2D } from './components/SkeletonPermohonanSP2D'
import { RefRekeningPrimaryButtons } from './components/permohonan-penerbitan-sp2d-buttons'
import { UsersDialogs } from './components/permohonan-penerbitan-sp2d-dialogs'
import { Sp2dItemProvider } from './components/permohonan-penerbitan-sp2d-provider'
import { BerkasMasukSP2DTable } from './components/permohonan-penerbitan-sp2d-table'

const route = getRouteApi(
  '/_authenticated/dokumen/sp2d/permohonan-penerbitan-sp2d'
)

const defaultFrom = startOfMonth(new Date())
const defaultTo = endOfMonth(new Date())

const today = new Date()
const hariInggris = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const hariIni = hariInggris[today.getDay()]
const currentYear = today.getFullYear()
const currentMonth = today.getMonth() + 1

export function PermohonanPenerbitanSP2D() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const hasUserSelectedDate = Boolean(dateRange.from && dateRange.to)

  const finalFrom = dateRange?.from ?? defaultFrom
  const finalTo = dateRange?.to ?? defaultTo

  const userRole = localStorage.getItem('user_role') ?? ''
  const skpd = JSON.parse(
    localStorage.getItem('user_skpd') || '{}'
  ) as MasterSkpd

  const noDefaultDateRoles = ['Operator SKPKD', 'Administrator', 'superadmin']
  const isNoDefaultRole = noDefaultDateRoles.includes(userRole)
  const shouldSendDate = !isNoDefaultRole || hasUserSelectedDate

  const params = {
    page: search.page,
    perPage: search.pageSize,
    search: search.nama_file,
    sort_by: search.sort_by ?? 'tanggal_upload',
    sort_dir: search.sort_dir ?? 'asc',
    menu:
      userRole === 'Operator SKPKD'
        ? 'permohonan_sp2d_operator'
        : 'permohonan_sp2d',
    ...(shouldSendDate && {
      date_from: format(finalFrom, 'yyyy-MM-dd'),
      date_to: format(finalTo, 'yyyy-MM-dd'),
    }),
    ...(userRole === 'Operator SKPKD' || userRole === 'Bendahara'
      ? {
          user_id: user?.id,
          kd_opd1: skpd?.kd_opd1,
          kd_opd2: skpd?.kd_opd2,
          kd_opd3: skpd?.kd_opd3,
          kd_opd4: skpd?.kd_opd4,
          kd_opd5: skpd?.kd_opd5,
        }
      : {}),
  }

  const { data, isLoading, isError } = useGetPermohonanSP2D(params)

  // ✅ Semua API cek dipindah ke sini (hanya aktif untuk Bendahara)
  const isBendahara = userRole === 'Bendahara'
  const skpdParams = {
    kd_opd1: skpd?.kd_opd1 ?? '',
    kd_opd2: skpd?.kd_opd2 ?? '',
    kd_opd3: skpd?.kd_opd3 ?? '',
    kd_opd4: skpd?.kd_opd4 ?? '',
    kd_opd5: skpd?.kd_opd5 ?? '',
  }

  const { isPending: loadingBatasWaktu, isFetching: fetchingBatasWaktu } =
    useGetBatasWaktu(
      { ...skpdParams, search: hariIni },
      { enabled: isBendahara }
    )
  const { isPending: loadingCekUpload, isFetching: fetchingCekUpload } =
    useCekUploadFungsional(
      {
        tahun: currentYear,
        bulan: currentMonth,
        ...skpdParams,
        status: skpd?.status_penerimaan ?? '0',
      },
      { enabled: isBendahara }
    )
  const { isPending: loadingDPA, isFetching: fetchingDPA } = useCekLaporanDPA(
    { tahun: currentYear, ...skpdParams },
    { enabled: isBendahara }
  )
  const { isPending: loadingPajak, isFetching: fetchingPajak } =
    useCekLaporanPajakBendahara(
      { tahun: currentYear, ...skpdParams },
      { enabled: isBendahara }
    )
  const { isPending: loadingAsset, isFetching: fetchingAsset } =
    useCekLaporanAssetBendahara(
      { tahun: currentYear, ...skpdParams },
      { enabled: isBendahara }
    )
  const { isPending: loadingSp2b, isFetching: fetchingSp2b } =
    useCekLaporanSp2bToBUD(
      { tahun: currentYear, ...skpdParams },
      { enabled: isBendahara }
    )
  const { isPending: loadingRekGaji, isFetching: fetchingRekGaji } =
    useCekLaporanRefRekonsiliasiGajiSkpd(
      { tahun: currentYear, ...skpdParams },
      { enabled: isBendahara }
    )

  // ✅ isChecking = true jika SALAH SATU api cek masih loading (khusus Bendahara)
  const isChecking =
    isBendahara &&
    (loadingBatasWaktu ||
      fetchingBatasWaktu ||
      loadingCekUpload ||
      fetchingCekUpload ||
      loadingDPA ||
      fetchingDPA ||
      loadingPajak ||
      fetchingPajak ||
      loadingAsset ||
      fetchingAsset ||
      loadingSp2b ||
      fetchingSp2b ||
      loadingRekGaji ||
      fetchingRekGaji)

  return (
    <Sp2dItemProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {isLoading ? (
        <SkeletonPermohonanSP2D />
      ) : isError ? (
        <p>Failed to load users.</p>
      ) : (
        <Main>
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Permohonan Penerbitan SP2D
              </h2>
              <p className='text-muted-foreground'>
                Data Ini adalah Permohonan Penerbitan SP2D
              </p>
            </div>
            {/* ✅ Pass isChecking ke button */}
            {skpd?.is_active === '1' && (
              <RefRekeningPrimaryButtons isChecking={isChecking} />
            )}
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <BerkasMasukSP2DTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </Main>
      )}
      <UsersDialogs />
    </Sp2dItemProvider>
  )
}
