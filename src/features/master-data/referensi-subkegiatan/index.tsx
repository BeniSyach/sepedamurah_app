import { getRouteApi } from '@tanstack/react-router'
import { useGetRefSubKegiatan } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/ref-subkegiatan-dialogs'
import { TasksPrimaryButtons } from './components/ref-subkegiatan-primary-buttons'
import { RefSubKegiatanProvider } from './components/ref-subkegiatan-provider'
import { RefSubKegiatanTable } from './components/ref-subkegiatan-table'

const route = getRouteApi('/_authenticated/master-data/referensi-subkegiatan')

export function ReferensiSubKegiatan() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefSubKegiatan({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <RefSubKegiatanProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Referensi Sub Kegiatan
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Referensi untuk Sub Kegiatan
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Failed to load users.</p>
          ) : (
            <RefSubKegiatanTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </RefSubKegiatanProvider>
  )
}
