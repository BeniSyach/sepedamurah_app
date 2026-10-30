import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, FileText, CheckCircle2, DollarSign, Clock } from 'lucide-react'
import { SkppProvider, useSkpp } from './components/skpp-provider'
import { SkppTable } from './components/skpp-table'
import { SkppDialogs } from './components/skpp-dialogs'

function SkppContent() {
  const { data, setOpen, setCurrentRow } = useSkpp()

  const totalBersih = data.reduce((acc, curr) => acc + (curr.jumlah_bersih || 0), 0)
  const countTerbit = data.filter((d) => d.status === 'Diterima' || d.status === 'Diterbitkan').length
  const countDraft = data.filter((d) => d.status === 'Draft' || d.status === 'Diajukan' || d.status === 'Permohonan').length

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Title Bar */}
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              SKPP (Surat Keterangan Penghentian Pembayaran)
            </h2>
            <p className='text-xs sm:text-sm text-muted-foreground'>
              Penerbitan Surat Keterangan Penghentian Pembayaran Gaji ASN / Pegawai Daerah
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentRow(null)
              setOpen('create')
            }}
            className='flex items-center gap-1.5'
          >
            <Plus className='h-4 w-4' />
            <span>Buat SKPP Baru</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5'>
          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Total Dokumen SKPP</p>
                <h3 className='text-xl font-bold mt-0.5'>{data.length}</h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                <FileText className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Total Gaji Bersih</p>
                <h3 className='text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5'>
                  Rp {totalBersih.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
                <DollarSign className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>SKPP Diterbitkan</p>
                <h3 className='text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5'>
                  {countTerbit}
                </h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                <CheckCircle2 className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xs'>
            <CardContent className='p-3.5 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-medium'>Proses / Draft</p>
                <h3 className='text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5'>
                  {countDraft}
                </h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400'>
                <Clock className='h-5 w-5' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <SkppTable />
      </Main>

      {/* Centralized Dialogs */}
      <SkppDialogs />
    </>
  )
}

export function SkppPage() {
  return (
    <SkppProvider menu='permohonan'>
      <SkppContent />
    </SkppProvider>
  )
}
export default SkppPage
