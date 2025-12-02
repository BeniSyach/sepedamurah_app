import { getRouteApi } from '@tanstack/react-router'
import { useGetPermohonanSP2D } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/permohonan-sp2d-tte-dialogs'
import { Sp2dItemProvider } from './components/permohonan-sp2d-tte-provider'
import { BerkasMasukSP2DTable } from './components/permohonan-sp2d-tte-table'

const route = getRouteApi('/_authenticated/dokumen/sp2d/permohonan-sp2d-tte')

export function PermohonanSp2dTTE() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetPermohonanSP2D({
    page: search.page,
    perPage: search.pageSize,
    search: search.nama_file,
    sort_by: search.sort_by ?? 'tanggal_upload',
    sort_dir: search.sort_dir ?? 'asc',
    menu: 'sp2d_tte',
    ...(userRole === 'Bendahara' ? { user_id: user?.id } : {}),
  })

  return (
    <Sp2dItemProvider>
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
              Permohonan SP2D TTE
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Permohonan SP2D TTE
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {/* <UsersTable data={users} search={search} navigate={navigate} /> */}
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Failed to load users.</p>
          ) : (
            <BerkasMasukSP2DTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </Sp2dItemProvider>
  )
}
