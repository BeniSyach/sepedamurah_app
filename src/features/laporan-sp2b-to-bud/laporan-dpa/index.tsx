import { getRouteApi } from '@tanstack/react-router'
import { useGetLaporanSp2bToBUD } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/laporan-pajak-bendahara-buttons'
import { UsersDialogs } from './components/laporan-pajak-bendahara-dialogs'
import { LaporanSp2bToBUDProvider } from './components/laporan-pajak-bendahara-provider'
import { LaporanSp2bToBUDTable } from './components/laporan-pajak-bendahara-table'

const route = getRouteApi(
  '/_authenticated/dokumen/laporan-sp2b-ke-bud/laporan-sp2b-ke-bud'
)

export function LaporanSp2bToBUD() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetLaporanSp2bToBUD({
    page: search.page,
    perPage: search.pageSize,
    search: search.nama_file,
    jenis: 'laporan_sp2b_ke_bud',
    menu:
      userRole === 'Operator SKPKD'
        ? 'operator_laporan_sp2b'
        : 'laporan_sp2b_ke_bud',
    ...(userRole === 'Operator SKPKD' || userRole === 'Bendahara'
      ? {
          user_id: user?.id,
          kd_opd1: user?.kd_opd1,
          kd_opd2: user?.kd_opd2,
          kd_opd3: user?.kd_opd3,
          kd_opd4: user?.kd_opd4,
          kd_opd5: user?.kd_opd5,
        }
      : {}),
  })

  return (
    <LaporanSp2bToBUDProvider>
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
              Laporan SPB (Surat Pengesahan Belanja)
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Laporan SPB (Surat Pengesahan Belanja)
            </p>
          </div>
          <RefRekeningPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {/* <UsersTable data={users} search={search} navigate={navigate} /> */}
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Failed to load users.</p>
          ) : (
            <LaporanSp2bToBUDTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </LaporanSp2bToBUDProvider>
  )
}
