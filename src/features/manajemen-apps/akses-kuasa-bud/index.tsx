import { getRouteApi } from '@tanstack/react-router'
import { useGetAksesKuasaBUD } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/akses-kuasa-bud-buttons'
import { UsersDialogs } from './components/akses-kuasa-bud-dialogs'
import { AksesKuasaBudProvider } from './components/akses-kuasa-bud-provider'
import { AksesKuasaBUDTable } from './components/akses-kuasa-bud-table'

const route = getRouteApi('/_authenticated/manajemen-apps/akses-kuasa-bud')

export function AksesKuasaBUD() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetAksesKuasaBUD({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <AksesKuasaBudProvider>
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
              Akses Kuasa BUD
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Akses Kuasa BUD
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
            <AksesKuasaBUDTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </AksesKuasaBudProvider>
  )
}
