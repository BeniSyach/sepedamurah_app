import { getRouteApi } from '@tanstack/react-router'
import { useGetRefBidangUrusan } from '@/api/master-data/ref-bidang-urusan'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/ref-bidang-urusan-dialogs'
import { TasksPrimaryButtons } from './components/ref-bidang-urusan-primary-buttons'
import { RefBidangUrusanProvider } from './components/ref-bidang-urusan-provider'
import { RefBidangUrusanTable } from './components/ref-bidang-urusan-table'

const route = getRouteApi('/_authenticated/master-data/referensi-bidang-urusan')

export function ReferensiBidangUrusan() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefBidangUrusan({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <RefBidangUrusanProvider>
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
              Referensi Bidang Urusan
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Referensi untuk Bidang Urusan
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
            <RefBidangUrusanTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </RefBidangUrusanProvider>
  )
}
