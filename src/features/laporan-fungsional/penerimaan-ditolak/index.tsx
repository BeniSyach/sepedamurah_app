import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { type MasterSkpd, useGetLaporanFungsional } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/penerimaan-ditolak-dialogs'
import { LaporanFungsionalProvider } from './components/penerimaan-ditolak-provider'
import { BerkasMasukPenerimaanTable } from './components/penerimaan-ditolak-table'

const route = getRouteApi(
  '/_authenticated/dokumen/laporan-fungsional/penerimaan-ditolak'
)

export function PenerimaanDitolakLaporanFungsional() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')
  const skpd = JSON.parse(
    localStorage.getItem('user_skpd') || '{}'
  ) as MasterSkpd
  const tahunFilter = search.tahun ?? format(new Date(), 'yyyy')

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetLaporanFungsional({
    page: search.page,
    perPage: search.pageSize,
    search: search.nama_file,
    jenis: 'Penerimaan',
    menu:
      userRole === 'Operator SKPKD'
        ? 'operator_penerimaan_ditolak'
        : 'fungsional_penerimaan_ditolak',
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
    tahun: tahunFilter,
  })

  return (
    <LaporanFungsionalProvider>
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
              Penerimaan - Ditolak Laporan Fungsional
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Penerimaan - Ditolak Laporan Fungsional
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
            <BerkasMasukPenerimaanTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </LaporanFungsionalProvider>
  )
}
