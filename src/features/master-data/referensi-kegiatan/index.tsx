import { getRouteApi } from '@tanstack/react-router'
import { useGetRefKegiatan } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/ref-kegiatan-dialogs'
import { TasksPrimaryButtons } from './components/ref-kegiatan-primary-buttons'
import { RefKegiatanProvider } from './components/ref-kegiatan-provider'
import { RefKegiatanTable } from './components/ref-kegiatan-table'

const route = getRouteApi('/_authenticated/master-data/referensi-kegiatan')

export function ReferensiKegiatan() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefKegiatan({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <RefKegiatanProvider>
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
              Referensi Kegiatan
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Referensi untuk Kegiatan
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
            <RefKegiatanTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </RefKegiatanProvider>
  )
}
