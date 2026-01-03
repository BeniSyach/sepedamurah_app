import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { useGetLaporanPajakBendahara } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/laporan-dpa-ditolak-dialogs'
import { LaporanPajakBendaharaProvider } from './components/laporan-dpa-ditolak-provider'
import { LaporanPajakBendaharaDitolakTable } from './components/laporan-dpa-ditolak-table'

const route = getRouteApi(
  '/_authenticated/dokumen/laporan-pajak-bendahara/laporan-pajak-bendahara-ditolak'
)

export function LaporanPajakBendaharaDitolak() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')
  const tahunFilter = search.tahun ?? format(new Date(), 'yyyy')

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetLaporanPajakBendahara({
    page: search.page,
    perPage: search.pageSize,
    search: search.nama_file,
    jenis: 'laporan_DPA',
    menu:
      userRole === 'Operator SKPKD'
        ? 'operator_laporan_pajak_ditolak'
        : 'laporan_pajak_ditolak',
    ...(userRole === 'Operator SKPKD' || userRole === 'Bendahara'
      ? { user_id: user?.id }
      : {}),
    tahun: tahunFilter,
  })

  return (
    <LaporanPajakBendaharaProvider>
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
              Laporan Pajak Bendahara Ditolak
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Laporan Pajak Bendahara Ditolak
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
            <LaporanPajakBendaharaDitolakTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </LaporanPajakBendaharaProvider>
  )
}
