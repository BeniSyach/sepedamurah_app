import { getRouteApi } from '@tanstack/react-router'
import { type MasterSkpd, useGetLaporanRekonsiliasiGajiSKPD } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/laporan-pajak-bendahara-buttons'
import { UsersDialogs } from './components/laporan-pajak-bendahara-dialogs'
import { LaporanRekonsiliasiGajiSKPDProvider } from './components/laporan-pajak-bendahara-provider'
import { LaporanRekonsiliasiGajiSKPDTable } from './components/laporan-pajak-bendahara-table'

const route = getRouteApi(
  '/_authenticated/dokumen/laporan-rekonsiliasi-gaji-skpd/laporan-rekonsiliasi-gaji-skpd'
)

export function LaporanRekGajiSKPD() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')
  const skpd = JSON.parse(
    localStorage.getItem('user_skpd') || '{}'
  ) as MasterSkpd

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetLaporanRekonsiliasiGajiSKPD({
    page: search.page,
    perPage: search.pageSize,
    search: search.nama_file,
    jenis: 'laporan_rek_gaji',
    menu:
      userRole === 'Operator SKPKD'
        ? 'operator_laporan_rek_gaji'
        : 'laporan_rek_gaji',
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
  })

  return (
    <LaporanRekonsiliasiGajiSKPDProvider>
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
              Laporan Rekonsiliasi Gaji SKPD
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Laporan Rekonsiliasi Gaji SKPD
            </p>
          </div>
          {user?.is_active === '1' && <RefRekeningPrimaryButtons />}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {/* <UsersTable data={users} search={search} navigate={navigate} /> */}
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Failed to load users.</p>
          ) : (
            <LaporanRekonsiliasiGajiSKPDTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </LaporanRekonsiliasiGajiSKPDProvider>
  )
}
