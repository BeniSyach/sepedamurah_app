import { useState } from 'react'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { useGetPermohonanSP2D } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/permohonan-ditolak-dialogs'
import { Sp2dItemProvider } from './components/permohonan-ditolak-provider'
import { BerkasMasukSP2DTable } from './components/permohonan-ditolak-table'

const route = getRouteApi('/_authenticated/dokumen/sp2d/permohonan-ditolak')

// Hitung awal & akhir bulan sekarang
const defaultFrom = startOfMonth(new Date())
const defaultTo = endOfMonth(new Date())

export function PermohonanDitolakSP2D() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  // const hasUserSelectedDate = Boolean(dateRange.from && dateRange.to)
  // Gunakan dateRange jika ada, jika tidak fallback ke default
  const finalFrom = dateRange?.from ?? defaultFrom
  const finalTo = dateRange?.to ?? defaultTo

  // 🔥 Ambil data langsung dari Laravel API
  const userRole = localStorage.getItem('user_role') ?? ''

  // cek apakah role tidak punya default tanggal
  // const noDefaultDateRoles = ['Operator SKPKD', 'Administrator']
  // const isNoDefaultRole = noDefaultDateRoles.includes(userRole)

  // hanya kirim tanggal jika dia:
  // - BUKAN role noDefaultDateRoles (punya default tanggal)
  // - ATAU role noDefault tapi user SUDAH memilih tanggal
  // const shouldSendDate = !isNoDefaultRole || hasUserSelectedDate

  const params = {
    page: search.page,
    perPage: search.pageSize,
    search: search.nama_file,
    sort_by: search.sort_by || 'ditolak',
    sort_dir: search.sort_dir || 'desc',
    menu:
      userRole === 'Operator SKPKD'
        ? 'permohonan_sp2d_tolak_operator'
        : 'sp2d_ditolak',
    // ...(shouldSendDate && {
    date_from: format(finalFrom, 'yyyy-MM-dd'),
    date_to: format(finalTo, 'yyyy-MM-dd'),
    // }),
    ...(userRole === 'Operator SKPKD' || userRole === 'Bendahara'
      ? { user_id: user?.id }
      : {}),
  }

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetPermohonanSP2D(params)

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

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Permohonan Ditolak SP2D
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Permohonan Ditolak SP2D
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {/* <UsersTable data={users} search={search} navigate={navigate} /> */}
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Failed to load users.</p>
          ) : (
            <BerkasMasukSP2DTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </Sp2dItemProvider>
  )
}
