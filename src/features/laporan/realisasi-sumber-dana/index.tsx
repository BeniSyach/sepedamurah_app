import { getRouteApi } from '@tanstack/react-router'
import { useGetLaporanRealisasiSumberDana } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/laporan-realisasi-sumber-dana-buttons'
import { UsersDialogs } from './components/laporan-realisasi-sumber-dana-dialogs'
import { PengembalianProvider } from './components/laporan-realisasi-sumber-dana-provider'
import { PengembalianTable } from './components/laporan-realisasi-sumber-dana-table'

const route = getRouteApi('/_authenticated/laporan/realisasi-sumber-dana')

export function RealisasiSumberDana() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetLaporanRealisasiSumberDana({
    tahun: search.tahun,
  })

  return (
    <PengembalianProvider>
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
              Laporan Realisasi Sumber Dana
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Laporan Realisasi Sumber Dana
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
            <PengembalianTable
              data={data?.data ?? []}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </PengembalianProvider>
  )
}
