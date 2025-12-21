import { getRouteApi } from '@tanstack/react-router'
import { useGetAksesSp2bToBUD } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/akses-sp2b-to-bud-buttons'
import { UsersDialogs } from './components/akses-sp2b-to-bud-dialogs'
import { AksesSp2bToBUDGroupProvider } from './components/akses-sp2b-to-bud-provider'
import { AksesSp2bToBUDTable } from './components/akses-sp2b-to-bud-table'

const route = getRouteApi('/_authenticated/manajemen-apps/akses-sp2b-ke-bud')

export function AksesSp2bToBUD() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetAksesSp2bToBUD({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <AksesSp2bToBUDGroupProvider>
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
              Akses SP2B Ke BUD
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Akses SP2B Ke BUD
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
            <AksesSp2bToBUDTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </AksesSp2bToBUDGroupProvider>
  )
}
