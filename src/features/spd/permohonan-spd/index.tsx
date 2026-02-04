import { getRouteApi } from '@tanstack/react-router'
import { type MasterSkpd, useGetPermohonanSPD } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/permohonan-spd-buttons'
import { UsersDialogs } from './components/permohonan-spd-dialogs'
import { PermohonanSpdProvider } from './components/permohonan-spd-provider'
import { PermohonanSPDTable } from './components/permohonan-spd-table'

const route = getRouteApi('/_authenticated/dokumen/spd/permohonan-spd')

export function PermohonanSPD() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')
  const skpd = JSON.parse(
    localStorage.getItem('user_skpd') || '{}'
  ) as MasterSkpd

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetPermohonanSPD({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
    sort_by: search.sort_by,
    sort_dir: search.sort_dir,
    menu:
      userRole === 'Operator SKPKD'
        ? 'permohonan_spd_operator'
        : 'permohonan_spd',
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
    <PermohonanSpdProvider>
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
              Permohonan SPD
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Permohonan SPD
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
            <PermohonanSPDTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </PermohonanSpdProvider>
  )
}
