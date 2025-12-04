import { getRouteApi } from '@tanstack/react-router'
import { useGetLaporanDaftarBelanjaSKPD } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
// import { DaftarBelanjaPerSKPDPrimaryButtons } from './components/daftar-belanja-per-skpd-buttons'
import { DaftarBelanjaPerSKPDDialogs } from './components/daftar-belanja-per-skpd-dialogs'
import { DaftarBelanjaSKPDProvider } from './components/daftar-belanja-per-skpd-provider'
import { DaftarBelanjaPerSKPDTable } from './components/daftar-belanja-per-skpd-table'

const route = getRouteApi('/_authenticated/laporan/daftar-belanja-per-skpd')

export function DaftarBelanjaPerSKPD() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetLaporanDaftarBelanjaSKPD({
    tahun: search.tahun,
  })

  return (
    <DaftarBelanjaSKPDProvider>
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
              Laporan Daftar Belanja Per SKPD
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Laporan Daftar Belanja Per SKPD
            </p>
          </div>
          {/* <DaftarBelanjaPerSKPDPrimaryButtons /> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Failed to load users.</p>
          ) : (
            <DaftarBelanjaPerSKPDTable
              data={data?.data ?? []}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <DaftarBelanjaPerSKPDDialogs />
    </DaftarBelanjaSKPDProvider>
  )
}
