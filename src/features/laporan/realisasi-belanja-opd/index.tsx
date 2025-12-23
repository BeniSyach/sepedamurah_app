import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { useGetLaporanRealisasiBelanjaPerSKPD } from '@/api/laporan/realisasi-belanja/use-realisasi-belanja-per-skpd'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/laporan-realisasi-belanja-opd-buttons'
import { UsersDialogs } from './components/laporan-realisasi-belanja-opd-dialogs'
import { PengembalianProvider } from './components/laporan-realisasi-belanja-opd-provider'
import { PengembalianTable } from './components/laporan-realisasi-belanja-opd-table'

const route = getRouteApi('/_authenticated/laporan/realisasi-belanja-opd')
const currentMonth = new Date().getMonth() + 1
export function RealisasiBelanjaSKPD() {
  const user = useAuthStore((s) => s.user)
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const tahunFilter = search.tahun ?? format(new Date(), 'yyyy')
  const bulanFilter = Number(search.bulan ?? currentMonth)
  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetLaporanRealisasiBelanjaPerSKPD({
    tahun: tahunFilter,
    bulan: bulanFilter,
    search: search.search,

    kd_opd1: search.kd_opd1 ?? user?.kd_opd1,
    kd_opd2: search.kd_opd2 ?? user?.kd_opd2,
    kd_opd3: search.kd_opd3 ?? user?.kd_opd3,
    kd_opd4: search.kd_opd4 ?? user?.kd_opd4,
    kd_opd5: search.kd_opd5 ?? user?.kd_opd5,
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
              Laporan Realisasi Belanja SKPD
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Laporan Realisasi Belanja SKPD
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
