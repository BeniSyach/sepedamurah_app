import { getRouteApi } from '@tanstack/react-router'
import { useGetLaporanAssetBendahara } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/laporan-pajak-bendahara-buttons'
import { UsersDialogs } from './components/laporan-pajak-bendahara-dialogs'
import { LaporanAssetBendaharaProvider } from './components/laporan-pajak-bendahara-provider'
import { LaporanAssetBendaharaTable } from './components/laporan-pajak-bendahara-table'

const route = getRouteApi(
  '/_authenticated/dokumen/laporan-asset-bendahara/laporan-asset-bendahara'
)

export function LaporanAssetBendahara() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetLaporanAssetBendahara({
    page: search.page,
    perPage: search.pageSize,
    search: search.nama_file,
    jenis: 'laporan_asset_bendahara',
    menu:
      userRole === 'Operator SKPKD'
        ? 'operator_laporan_asset'
        : 'laporan_asset_bendahara',
    ...(userRole === 'Operator SKPKD' || userRole === 'Bendahara'
      ? { user_id: user?.id }
      : {}),
  })

  return (
    <LaporanAssetBendaharaProvider>
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
              Laporan BMD (Barang Milik Daerah)
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Laporan BMD (Barang Milik Daerah)
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
            <LaporanAssetBendaharaTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </LaporanAssetBendaharaProvider>
  )
}
