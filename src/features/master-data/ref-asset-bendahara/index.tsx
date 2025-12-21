import { getRouteApi } from '@tanstack/react-router'
import { useGetRefAssetBendahara } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefAssetBendaharaPrimaryButtons } from './components/ref-asset-bendahara-buttons'
import { DPADialogs } from './components/ref-asset-bendahara-dialogs'
import { RefAssetBendaharaProvider } from './components/ref-asset-bendahara-provider'
import { ReferensiAssetBendaharaTable } from './components/ref-asset-bendahara-table'

const route = getRouteApi(
  '/_authenticated/master-data/referensi-asset-bendahara'
)

export function ReferensiAssetBendahara() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefAssetBendahara({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <RefAssetBendaharaProvider>
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
              Referensi Asset Bendahara
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Referensi untuk Asset Bendahara
            </p>
          </div>
          <RefAssetBendaharaPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {/* <UsersTable data={users} search={search} navigate={navigate} /> */}
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Failed to load users.</p>
          ) : (
            <ReferensiAssetBendaharaTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <DPADialogs />
    </RefAssetBendaharaProvider>
  )
}
