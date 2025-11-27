import { getRouteApi } from '@tanstack/react-router'
import { useGetAksesOperator } from '@/api'
import { groupAksesOperator } from '@/lib/utils'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/akses-operator-buttons'
import { ReferensiAksesOperatorColumns } from './components/akses-operator-columns'
import { UsersDialogs } from './components/akses-operator-dialogs'
import { AksesOperatorProvider } from './components/akses-operator-provider'
import { AksesOperatorTable } from './components/akses-operator-table'

const route = getRouteApi('/_authenticated/manajemen-apps/akses-operator')

export function AksesOperator() {
  const search = route.useSearch()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetAksesOperator({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  const finalData = groupAksesOperator(data?.data ?? [])

  return (
    <AksesOperatorProvider>
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
              Akses Operator
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Akses Operator
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
            <AksesOperatorTable
              columns={ReferensiAksesOperatorColumns}
              data={finalData}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </AksesOperatorProvider>
  )
}
