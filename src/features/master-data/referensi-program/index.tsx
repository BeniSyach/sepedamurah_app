import { getRouteApi } from '@tanstack/react-router'
import { useGetRefProgram } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/ref-program-dialogs'
import { TasksPrimaryButtons } from './components/ref-program-primary-buttons'
import { RefProgramProvider } from './components/ref-program-provider'
import { RefProgramTable } from './components/ref-program-table'

const route = getRouteApi('/_authenticated/master-data/referensi-program')

export function ReferensiProgram() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefProgram({
    page: search.page,
    perPage: search.pageSize,
    search: search.search,
  })

  return (
    <RefProgramProvider>
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
              Referensi Program
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Referensi untuk Program
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
            <RefProgramTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </RefProgramProvider>
  )
}
