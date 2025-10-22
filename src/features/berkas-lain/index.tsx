import { getRouteApi } from '@tanstack/react-router'
import { useGetBerkasLain } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/berkas-masuk-penerimaan-buttons'
import { UsersDialogs } from './components/berkas-masuk-penerimaan-dialogs'
import { BerkasLainProvider } from './components/berkas-masuk-penerimaan-provider'
import { BerkasLainTable } from './components/berkas-masuk-penerimaan-table'

const route = getRouteApi('/_authenticated/dokumen/berkas-lain')

export function BerkasLainLain() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetBerkasLain({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <BerkasLainProvider>
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
              Berkas Lain Lain
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Berkas Lain Lain
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
            <BerkasLainTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </BerkasLainProvider>
  )
}
