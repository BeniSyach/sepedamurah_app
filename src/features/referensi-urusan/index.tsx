import { getRouteApi } from '@tanstack/react-router'
import { useGetRefUrusan } from '@/api'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/ref-urusan-dialogs'
import { UrusanPrimaryButtons } from './components/ref-urusan-primary-buttons'
import { RefUrusanProvider } from './components/ref-urusan-provider'
import { RefUrusanTable } from './components/ref-urusan-table'

function SkeletonRefUrusanTable() {
  return (
    <div className='w-full rounded-lg border'>
      {/* Header Table */}
      <div className='flex items-center border-b p-4'>
        <Skeleton className='h-4 w-40' />
      </div>

      {/* Rows */}
      <div className='divide-y'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='flex items-center justify-between p-4'>
            <Skeleton className='h-4 w-64' />
            <Skeleton className='h-8 w-20' />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between border-t p-4'>
        <Skeleton className='h-4 w-32' />
        <div className='flex space-x-2'>
          <Skeleton className='h-8 w-8 rounded-md' />
          <Skeleton className='h-8 w-8 rounded-md' />
        </div>
      </div>
    </div>
  )
}

function SkeletonHeader() {
  return (
    <div className='flex items-center justify-between'>
      <Skeleton className='h-10 w-64' />

      <div className='flex items-center space-x-4'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-8 w-8 rounded-full' />
      </div>
    </div>
  )
}

function SkeletonTopSection() {
  return (
    <div className='mb-4'>
      <Skeleton className='h-6 w-60' />
      <Skeleton className='mt-2 h-4 w-48' />
    </div>
  )
}

function SkeletonPrimaryButtons() {
  return (
    <div className='flex space-x-2'>
      <Skeleton className='h-10 w-32 rounded-md' />
    </div>
  )
}

const route = getRouteApi('/_authenticated/master-data/referensi-urusan')

export function ReferensiUrusan() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRefUrusan({
    page: search.page,
    perPage: search.pageSize,
    search: search.nm_urusan,
  })

  return (
    <RefUrusanProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {isLoading ? (
          <SkeletonHeader />
        ) : (
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Referensi Urusan
              </h2>
              <p className='text-muted-foreground'>
                Data Ini adalah Referensi untuk Urusan
              </p>
            </div>
            <UrusanPrimaryButtons />
          </div>
        )}
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='space-y-4'>
              <SkeletonTopSection />
              <SkeletonPrimaryButtons />
              <SkeletonRefUrusanTable />
            </div>
          ) : isError ? (
            <p>Failed to load data.</p>
          ) : (
            <RefUrusanTable
              data={data?.data ?? []}
              meta={data?.meta}
              search={search}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </RefUrusanProvider>
  )
}
