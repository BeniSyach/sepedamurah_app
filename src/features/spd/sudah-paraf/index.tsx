import { getRouteApi } from '@tanstack/react-router'
import { useGetSPDTerkirim } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/sudah-paraf-dialogs'
import { PermohonanSpdProvider } from './components/sudah-paraf-provider'
import { BerkasMasukTable } from './components/sudah-paraf-table'

const route = getRouteApi('/_authenticated/dokumen/spd/sudah-paraf')

export function SudahParafSPD() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetSPDTerkirim({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
    menu: 'spd_sudah_paraf',
    ...(userRole === 'Bendahara' ? { user_id: user?.id } : {}),
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
              Sudah Paraf SPD
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Sudah Paraf SPD
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
            <BerkasMasukTable
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
