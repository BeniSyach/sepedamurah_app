import { useState } from 'react'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { useGetRekapRealisasiTransferSumberDana } from '@/api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RefRekeningPrimaryButtons } from './components/realisasi-tf-sumber-dana-buttons'
import { UsersDialogs } from './components/realisasi-tf-sumber-dana-dialogs'
import { RekapSumberDanaItemProvider } from './components/realisasi-tf-sumber-dana-provider'
import { RekapTransferSumberDanaTable } from './components/realisasi-tf-sumber-dana-table'

const route = getRouteApi(
  '/_authenticated/alokasi-dana/realisasi-transfer-sumber-dana'
)

// Hitung awal & akhir bulan sekarang
const defaultFrom = startOfMonth(new Date())
const defaultTo = endOfMonth(new Date())

// const currentMonth = new Date().getMonth() + 1
export function RealisasiTransferSumberDana() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const finalFrom = dateRange?.from ?? defaultFrom
  const finalTo = dateRange?.to ?? defaultTo
  // const tahunFilter = search.tahun ?? format(new Date(), 'yyyy')
  const tahunFilter = dateRange?.from
    ? format(dateRange.from, 'yyyy') // ✅ ambil tahun dari tanggal awal
    : (search.tahun ?? format(new Date(), 'yyyy'))
  // const bulanFilter = Number(search.bulan ?? currentMonth)
  const bulanFilter = dateRange?.from
    ? Number(format(dateRange.from, 'M')) // ambil bulan dari tanggal awal
    : Number(search.bulan ?? format(new Date(), 'M'))
  // 🔥 Ambil data langsung dari Laravel API
  const { data, isLoading, isError } = useGetRekapRealisasiTransferSumberDana({
    tahun: tahunFilter,
    bulan: bulanFilter,
    tgl_awal: format(finalFrom, 'yyyy-MM-dd'),
    tgl_akhir: format(finalTo, 'yyyy-MM-dd'),
    search: search.search,
  })

  return (
    <RekapSumberDanaItemProvider>
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
              Rekap Realisasi Transfer Sumber Dana
            </h2>
            <p className='text-muted-foreground'>
              Data Ini adalah Rekap Realisasi Transfer Sumber Dana
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
            <RekapTransferSumberDanaTable
              data={data?.data ?? []}
              search={search}
              navigate={navigate}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
        </div>
      </Main>

      <UsersDialogs tahun={tahunFilter} />
    </RekapSumberDanaItemProvider>
  )
}
