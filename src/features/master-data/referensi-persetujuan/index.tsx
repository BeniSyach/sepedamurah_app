import { getRouteApi } from '@tanstack/react-router'
import { useGetRefPersetujuan } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/ref-persetujuan-buttons'
import { UsersDialogs } from './components/ref-persetujuan-dialogs'
import { PersetujuanProvider } from './components/ref-persetujuan-provider'
import { ReferensiPersetujuanTable } from './components/ref-persetujuan-table'

const route = getRouteApi('/_authenticated/master-data/referensi-persetujuan')

export function ReferensiPersetujuan() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefPersetujuan({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <PersetujuanProvider>
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
              Referensi Persetujuan
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Referensi untuk Persetujuan SKPD
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
            <ReferensiPersetujuanTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </PersetujuanProvider>
  )
}
