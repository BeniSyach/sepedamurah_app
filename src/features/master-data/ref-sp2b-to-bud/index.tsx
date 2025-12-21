import { getRouteApi } from '@tanstack/react-router'
import { useGetRefSp2bToBUD } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Sp2dbToBUDPrimaryButtons } from './components/ref-sp2b-to-bud-buttons'
import { DPADialogs } from './components/ref-sp2b-to-bud-dialogs'
import { RefSp2dbToBUDProvider } from './components/ref-sp2b-to-bud-provider'
import { ReferensiSp2bToBUDTable } from './components/ref-sp2b-to-bud-table'

const route = getRouteApi('/_authenticated/master-data/referensi-sp2b-to-bud')

export function ReferensiSp2bToBUD() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefSp2bToBUD({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <RefSp2dbToBUDProvider>
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
              Referensi SP2B Ke BUD
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Referensi untuk SP2B Ke BUD
            </p>
          </div>
          <Sp2dbToBUDPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {/* <UsersTable data={users} search={search} navigate={navigate} /> */}
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Failed to load users.</p>
          ) : (
            <ReferensiSp2bToBUDTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <DPADialogs />
    </RefSp2dbToBUDProvider>
  )
}
