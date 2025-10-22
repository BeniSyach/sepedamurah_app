import { getRouteApi } from '@tanstack/react-router'
import { useGetRefSumberDana } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/ref-sumber-dana-buttons'
import { UsersDialogs } from './components/ref-sumber-dana-dialogs'
import { SumberDanaProvider } from './components/ref-sumber-dana-provider'
import { ReferensiSumberDanaTable } from './components/ref-sumber-dana-table'

const route = getRouteApi('/_authenticated/master-data/referensi-sumber-dana')

export function ReferensiSumberDana() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefSumberDana({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <SumberDanaProvider>
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
              Referensi Sumber Dana
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Referensi untuk Sumber Dana
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
            <ReferensiSumberDanaTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </SumberDanaProvider>
  )
}
