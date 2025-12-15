import { useEffect } from 'react'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useGetLevelRekening,
  useGetRefBidangUrusanSp2d,
  useGetRefKegiatanSp2d,
  useGetRefProgramSp2d,
  useGetRefSKPD,
  useGetRefSubKegiatanSp2d,
  useGetRefSumberDana,
  useGetRefUrusanSp2d,
  useGetRekAkun,
  useGetRekJenis,
  useGetRekObjek,
  useGetRekRincian,
  useGetSubRincian,
} from '@/api'
import { CheckIcon } from 'lucide-react'
import { useGetRekKelompok } from '@/api/master-data/rek-kelompok'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { DatePicker } from '@/components/date-picker'
import RangeDatePicker from '@/components/form-date-range'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LongText } from '@/components/long-text'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const jenis_laporan = [
  { label: 'LRA Sumber Dana', value: 'lra_sd' },
  { label: 'Rincian Akun Rekening Belanja', value: 'r_saldo_buku_besar' },
  {
    label: 'Laporan Realisasi Anggaran Per Priode',
    value: 'lra_anggaran_per_priode',
  },
  {
    label: 'Laporan Realisasi Anggaran per Urusan',
    value: 'lra_anggaran_per_urusan',
  },
  {
    label: 'Laporan Realisasi Anggaran per Program Kegiatan',
    value: 'lra_anggaran_per_program_kegiatan',
  },
  {
    label: 'Laporan Realisasi Anggaran Yg Memunculkan Pendapatan dan Belanja',
    value: 'lra_pendapatan_belanja',
  },
] as const

const accountFormSchema = z.object({
  jenis_laporan: z.string('Jenis laporan Tidak Boleh Kosong'),
  tanggal: z.date(),
  urusan: z.string('Urusan Tidak Boleh Kosong'),
  bidang_urusan: z
    .object({
      kd_bu1: z.string(),
      kd_bu2: z.string(),
      nm_bu: z.string(),
    })
    .optional(),
  skpd: z
    .object({
      kd_opd1: z.string(),
      kd_opd2: z.string(),
      kd_opd3: z.string(),
      kd_opd4: z.string(),
      kd_opd5: z.string(),
      nm_opd: z.string(),
    })
    .optional(),
  program: z
    .object({
      kd_prog1: z.string(),
      kd_prog2: z.string(),
      kd_prog3: z.string(),
      nm_program: z.string(),
    })
    .optional(),
  kegiatan: z
    .object({
      kd_keg1: z.string(),
      kd_keg2: z.string(),
      kd_keg3: z.string(),
      kd_keg4: z.string(),
      kd_keg5: z.string(),
      nm_kegiatan: z.string(),
    })
    .optional(),
  level_rekening: z.string('Level Rekening Tidak Boleh Kosong'),
  range_tanggal: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  jenis_belanja: z.string('Jenis Belanja Tidak Boleh Kosong'),
  language: z.string('Please select a language.'),
  sumber_dana: z
    .object({
      kd_ref1: z.string(),
      kd_ref2: z.string(),
      kd_ref3: z.string(),
      kd_ref4: z.string(),
      kd_ref5: z.string(),
      kd_ref6: z.string(),
      nm_ref: z.string(),
    })
    .optional(),
  subkegiatan: z
    .object({
      kd_subkeg1: z.string(),
      kd_subkeg2: z.string(),
      kd_subkeg3: z.string(),
      kd_subkeg4: z.string(),
      kd_subkeg5: z.string(),
      kd_subkeg6: z.string(),
      nm_subkegiatan: z.string(),
    })
    .optional(),
  rek_akun: z.string('Rek Akun Tidak Boleh Kosong'),
  rek_kelompok: z
    .object({
      kd_kel1: z.string(),
      kd_kel2: z.string(),
      nm_rek_kelompok: z.string(),
    })
    .optional(),
  rek_jenis: z
    .object({
      kd_jenis1: z.string(),
      kd_jenis2: z.string(),
      kd_jenis3: z.string(),
      nm_rek_jenis: z.string(),
    })
    .optional(),
  rek_objek: z
    .object({
      kd_objek1: z.string(),
      kd_objek2: z.string(),
      kd_objek3: z.string(),
      kd_objek4: z.string(),
      nm_rek_objek: z.string(),
    })
    .optional(),
  rek_rincian: z
    .object({
      kd_rincian1: z.string(),
      kd_rincian2: z.string(),
      kd_rincian3: z.string(),
      kd_rincian4: z.string(),
      kd_rincian5: z.string(),
      nm_rek_rincian: z.string(),
    })
    .optional(),
  sub_rincian: z
    .object({
      kd_subrincian1: z.string(),
      kd_subrincian2: z.string(),
      kd_subrincian3: z.string(),
      kd_subrincian4: z.string(),
      kd_subrincian5: z.string(),
      kd_subrincian6: z.string(),
      nm_sub_rincian: z.string(),
    })
    .optional(),
})

type AccountFormValues = z.output<typeof accountFormSchema>

const defaultValues: AccountFormValues = {
  jenis_laporan: '',
  urusan: '',
  bidang_urusan: {
    kd_bu1: '',
    kd_bu2: '',
    nm_bu: '',
  },
  range_tanggal: {
    from: new Date(),
    to: undefined,
  },
  level_rekening: '',
  jenis_belanja: '',
  language: '',
  tanggal: new Date(),
  sumber_dana: {
    kd_ref1: '',
    kd_ref2: '',
    kd_ref3: '',
    kd_ref4: '',
    kd_ref5: '',
    kd_ref6: '',
    nm_ref: '',
  },
  skpd: {
    kd_opd1: '',
    kd_opd2: '',
    kd_opd3: '',
    kd_opd4: '',
    kd_opd5: '',
    nm_opd: '',
  },
  program: {
    kd_prog1: '',
    kd_prog2: '',
    kd_prog3: '',
    nm_program: '',
  },
  kegiatan: {
    kd_keg1: '',
    kd_keg2: '',
    kd_keg3: '',
    kd_keg4: '',
    kd_keg5: '',
    nm_kegiatan: '',
  },
  subkegiatan: {
    kd_subkeg1: '',
    kd_subkeg2: '',
    kd_subkeg3: '',
    kd_subkeg4: '',
    kd_subkeg5: '',
    kd_subkeg6: '',
    nm_subkegiatan: '',
  },
  rek_akun: '',
  rek_kelompok: {
    kd_kel1: '',
    kd_kel2: '',
    nm_rek_kelompok: '',
  },
  rek_jenis: {
    kd_jenis1: '',
    kd_jenis2: '',
    kd_jenis3: '',
    nm_rek_jenis: '',
  },
  rek_objek: {
    kd_objek1: '',
    kd_objek2: '',
    kd_objek3: '',
    kd_objek4: '',
    nm_rek_objek: '',
  },
  rek_rincian: {
    kd_rincian1: '',
    kd_rincian2: '',
    kd_rincian3: '',
    kd_rincian4: '',
    kd_rincian5: '',
    nm_rek_rincian: '',
  },
  sub_rincian: {
    kd_subrincian1: '',
    kd_subrincian2: '',
    kd_subrincian3: '',
    kd_subrincian4: '',
    kd_subrincian5: '',
    kd_subrincian6: '',
    nm_sub_rincian: '',
  },
}

export function LaporanPembukuan() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })
  const userRole = localStorage.getItem('user_role') ?? ''
  const jenisLaporanValue = form.watch('jenis_laporan')

  const {
    data: dataUrusan,
    isPending: pendingUrusan,
    isError: errorUrusan,
  } = useGetRefUrusanSp2d({
    page: 1,
    perPage: 100,
    role: userRole,
  })
  const urusanList = dataUrusan?.data || []
  const urusanValue = form.watch('urusan')

  const {
    data: dataBU,
    isPending: pendingBU,
    isError: errorBU,
  } = useGetRefBidangUrusanSp2d({
    page: 1,
    perPage: 100,
    kd_urusan: urusanValue || '',
    role: userRole,
  })
  const buList = dataBU?.data || []
  const buValue = form.watch('bidang_urusan')

  const {
    data: dataSKPD,
    isPending: pendingSKPD,
    isError: errorSKPD,
  } = useGetRefSKPD({
    page: 1,
    perPage: 100,
  })
  const SKPDList = dataSKPD?.data || []

  const {
    data: dataProgram,
    isPending: pendingProgram,
    isError: errorProgram,
  } = useGetRefProgramSp2d({
    page: 1,
    perPage: 100,
    kd_bu1: buValue?.kd_bu1,
    kd_bu2: buValue?.kd_bu2,
    role: userRole,
  })
  const programList = dataProgram?.data || []
  const programValue = form.watch('program')

  const {
    data: dataKeg,
    isPending: pendingKeg,
    isError: errorKeg,
  } = useGetRefKegiatanSp2d({
    page: 1,
    perPage: 200,
    kd_prog1: programValue?.kd_prog1,
    kd_prog2: programValue?.kd_prog2,
    kd_prog3: programValue?.kd_prog3,
    role: userRole,
  })
  const kegiatanList = dataKeg?.data || []
  const kegiatanValue = form.watch('kegiatan')

  const {
    data: dataSubKeg,
    isPending: pendingSubkeg,
    isError: errorSubkeg,
  } = useGetRefSubKegiatanSp2d({
    page: 1,
    perPage: 200,
    kd_keg1: kegiatanValue?.kd_keg1,
    kd_keg2: kegiatanValue?.kd_keg2,
    kd_keg3: kegiatanValue?.kd_keg3,
    kd_keg4: kegiatanValue?.kd_keg4,
    kd_keg5: kegiatanValue?.kd_keg5,
    role: userRole,
  })
  const subkegiatanList = dataSubKeg?.data || []

  const {
    data: dataLevelRek,
    isPending: pendingLevelRek,
    isError: errorLevelRek,
  } = useGetLevelRekening()
  const levelRekList = dataLevelRek || []

  const {
    data: dataRekAkun,
    isPending: pendingRekAkun,
    isError: errorRekAkun,
  } = useGetRekAkun()
  const rekAkunList = dataRekAkun || []
  const rekAkunValue = form.watch('rek_akun')

  const {
    data: dataRekKel,
    isPending: pendingRekKel,
    isError: errorRekKel,
  } = useGetRekKelompok({
    kd_kel1: rekAkunValue,
  })
  const rekKelList = dataRekKel || []
  const rekKelompokValue = form.watch('rek_kelompok')

  const {
    data: dataRekJenis,
    isPending: pendingRekJenis,
    isError: errorRekJenis,
  } = useGetRekJenis({
    kd_jenis1: rekKelompokValue?.kd_kel1,
    kd_jenis2: rekKelompokValue?.kd_kel2,
  })
  const rekJenisList = dataRekJenis || []
  const rekJenisValue = form.watch('rek_jenis')

  const {
    data: dataRekObjek,
    isPending: pendingRekObjek,
    isError: errorRekObjek,
  } = useGetRekObjek({
    kd_objek1: rekJenisValue?.kd_jenis1,
    kd_objek2: rekJenisValue?.kd_jenis2,
    kd_objek3: rekJenisValue?.kd_jenis3,
  })
  const rekObjekList = dataRekObjek || []
  const rekObjekValue = form.watch('rek_objek')

  const {
    data: dataRekRincian,
    isPending: pendingRekRincian,
    isError: errorRekRincian,
  } = useGetRekRincian({
    kd_rincian1: rekObjekValue?.kd_objek1,
    kd_rincian2: rekObjekValue?.kd_objek2,
    kd_rincian3: rekObjekValue?.kd_objek3,
    kd_rincian4: rekObjekValue?.kd_objek4,
  })
  const rekRincianList = dataRekRincian || []
  const rekRincianValue = form.watch('rek_rincian')

  const {
    data: dataSubRincian,
    isPending: pendingSubRincian,
    isError: errorSubRincian,
  } = useGetSubRincian({
    kd_subrincian1: rekRincianValue?.kd_rincian1,
    kd_subrincian2: rekRincianValue?.kd_rincian2,
    kd_subrincian3: rekRincianValue?.kd_rincian3,
    kd_subrincian4: rekRincianValue?.kd_rincian4,
    kd_subrincian5: rekRincianValue?.kd_rincian5,
  })
  const subRincianList = dataSubRincian || []

  const {
    data: dataSD,
    isPending: pendingSD,
    isError: errorSD,
  } = useGetRefSumberDana({
    page: 1,
    perPage: 1000,
    status: '1',
  })
  const sumberDanaList = dataSD?.data || []

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data)
  }
  useEffect(() => {
    if (urusanValue) {
      form.setValue('bidang_urusan', { kd_bu1: '', kd_bu2: '', nm_bu: '' })
    }
  }, [urusanValue])
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Laporan Pembukuan
          </h1>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <div className='flex flex-1 flex-col space-y-6 overflow-hidden p-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
              >
                {/* === Baris 1 === */}
                <div className='flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='jenis_laporan'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left break-words whitespace-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {field.value
                                      ? jenis_laporan.find(
                                          (jl) => jl.value === field.value
                                        )?.label
                                      : 'Pilih Jenis Laporan'}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari jenis laporan...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {jenis_laporan.map((jl) => (
                                      <CommandItem
                                        value={jl.label}
                                        key={jl.value}
                                        onSelect={() =>
                                          form.setValue(
                                            'jenis_laporan',
                                            jl.value
                                          )
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            jl.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {jl.label}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='tanggal'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <DatePicker
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='urusan'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    pendingUrusan ||
                                    errorUrusan
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingUrusan
                                      ? 'Memuat...'
                                      : field.value
                                        ? (() => {
                                            const selected = urusanList.find(
                                              (item) =>
                                                item.kd_urusan === field.value
                                            )
                                            return selected ? (
                                              <LongText className='max-w-[180px] md:max-w-[250px]'>
                                                {selected.kd_urusan} -{' '}
                                                {selected.nm_urusan}
                                              </LongText>
                                            ) : (
                                              'Tidak ditemukan'
                                            )
                                          })()
                                        : 'Pilih Urusan'}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Urusan...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {urusanList.map((item) => (
                                      <CommandItem
                                        value={item.nm_urusan}
                                        key={item.kd_urusan}
                                        onSelect={() =>
                                          form.setValue(
                                            'urusan',
                                            item.kd_urusan
                                          )
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            item.kd_urusan === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_urusan} - {item.nm_urusan}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* === Baris 2 === */}
                <div className='flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                  <div className='flex-1'>
                    <Controller
                      name='range_tanggal'
                      control={form.control}
                      render={({ field }) => (
                        <RangeDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Pilih tanggal'
                          disabled={false}
                          className='max-w-md'
                        />
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='rek_akun'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue === 'lra_sd' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_priode' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    pendingRekAkun ||
                                    errorRekAkun
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingRekAkun
                                      ? 'Memuat...'
                                      : field.value
                                        ? (() => {
                                            const selected = rekAkunList.find(
                                              (item) =>
                                                item.kode === field.value
                                            )
                                            return selected ? (
                                              <LongText className='max-w-[180px] md:max-w-[250px]'>
                                                {selected.kode} -{' '}
                                                {selected.nm_rek_akun}
                                              </LongText>
                                            ) : (
                                              'Tidak ditemukan'
                                            )
                                          })()
                                        : 'Pilih Rek Akun'}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Rek Akun...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {rekAkunList.map((item) => (
                                      <CommandItem
                                        value={item.nm_rek_akun}
                                        key={item.kode}
                                        onSelect={() =>
                                          form.setValue('rek_akun', item.kode)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            item.kode === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kode} - {item.nm_rek_akun}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='bidang_urusan'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !urusanValue ||
                                    pendingBU ||
                                    errorBU
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingBU ? (
                                      'Memuat...'
                                    ) : field.value?.kd_bu1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_bu1}.
                                        {field.value.kd_bu2} -{' '}
                                        {field.value.nm_bu}
                                      </LongText>
                                    ) : !urusanValue ? (
                                      'Pilih urusan terlebih dahulu'
                                    ) : (
                                      'Pilih Bidang Urusan'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Bidang Urusan...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {buList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_bu1}-${item.kd_bu2}`}
                                        value={item.nm_bu}
                                        onSelect={() =>
                                          form.setValue('bidang_urusan', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value &&
                                              item.kd_bu1 ===
                                                field.value.kd_bu1 &&
                                              item.kd_bu2 === field.value.kd_bu2
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_bu1}.{item.kd_bu2} -{' '}
                                        {item.nm_bu}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* === Baris 3 === */}
                <div className='flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                  <div className='flex-1'>
                    <div className='flex-1'>
                      <FormField
                        control={form.control}
                        name='level_rekening'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    role='combobox'
                                    disabled={
                                      jenisLaporanValue ===
                                        'lra_anggaran_per_urusan' ||
                                      pendingLevelRek ||
                                      errorLevelRek
                                    }
                                    className={cn(
                                      'min-h-[2.5rem] w-full justify-between text-left',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    <div className='flex-1 text-left'>
                                      {pendingLevelRek
                                        ? 'Memuat...'
                                        : field.value
                                          ? (() => {
                                              const selected =
                                                levelRekList.find(
                                                  (item) =>
                                                    item.kode === field.value
                                                )
                                              return selected ? (
                                                <LongText className='max-w-[180px] md:max-w-[250px]'>
                                                  {selected.kode} -{' '}
                                                  {selected.nm_level_rek}
                                                </LongText>
                                              ) : (
                                                'Tidak ditemukan'
                                              )
                                            })()
                                          : 'Pilih Level Rekening'}
                                    </div>
                                    <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>

                              <PopoverContent
                                align='start'
                                className='w-[var(--radix-popover-trigger-width)] p-0'
                              >
                                <Command className='max-h-[300px] overflow-y-auto'>
                                  <CommandInput placeholder='Cari Level Rekening...' />
                                  <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                  <CommandGroup>
                                    <CommandList>
                                      {levelRekList.map((item) => (
                                        <CommandItem
                                          value={item.nm_level_rek}
                                          key={item.kode}
                                          onSelect={() =>
                                            form.setValue(
                                              'level_rekening',
                                              item.kode
                                            )
                                          }
                                        >
                                          <CheckIcon
                                            className={cn(
                                              'size-4',
                                              item.kode === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {item.kode} - {item.nm_level_rek}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='rek_kelompok'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue === 'lra_sd' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_priode' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !rekAkunValue ||
                                    pendingRekKel ||
                                    errorRekKel
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingRekKel ? (
                                      'Memuat...'
                                    ) : field.value?.kd_kel1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_kel1}.
                                        {field.value.kd_kel2} -{' '}
                                        {field.value.nm_rek_kelompok}
                                      </LongText>
                                    ) : !urusanValue ? (
                                      'Pilih Rek Akun terlebih dahulu'
                                    ) : (
                                      'Pilih Rek Kelompok'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Rek Kelompok...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {rekKelList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_kel1}-${item.kd_kel2}`}
                                        value={item.nm_rek_kelompok}
                                        onSelect={() =>
                                          form.setValue('rek_kelompok', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value &&
                                              item.kd_kel1 ===
                                                field.value.kd_kel1 &&
                                              item.kd_kel2 ===
                                                field.value.kd_kel2
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_kel1}.{item.kd_kel2} -{' '}
                                        {item.nm_rek_kelompok}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='skpd'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    pendingSKPD ||
                                    errorSKPD
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value?.kd_opd1 &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingSKPD ? (
                                      'Memuat...'
                                    ) : field.value?.kd_opd1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_opd1}.
                                        {field.value.kd_opd2}.
                                        {field.value.kd_opd3}.
                                        {field.value.kd_opd4}.
                                        {field.value.kd_opd5} -{' '}
                                        {field.value.nm_opd}
                                      </LongText>
                                    ) : (
                                      'Pilih SKPD'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari SKPD...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {SKPDList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_opd1}.${item.kd_opd2}.${item.kd_opd3}.${item.kd_opd4}.${item.kd_opd5}`}
                                        value={item.nm_opd}
                                        onSelect={() =>
                                          form.setValue('skpd', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value?.kd_opd1 ===
                                              item.kd_opd1 &&
                                              field.value?.kd_opd2 ===
                                                item.kd_opd2 &&
                                              field.value?.kd_opd3 ===
                                                item.kd_opd3 &&
                                              field.value?.kd_opd4 ===
                                                item.kd_opd4 &&
                                              field.value?.kd_opd5 ===
                                                item.kd_opd5
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_opd1}.{item.kd_opd2}.
                                        {item.kd_opd3}.{item.kd_opd4}.
                                        {item.kd_opd5} - {item.nm_opd}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* === Baris 4 === */}
                <div className='flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                  <div className='flex-1' />
                  {/* <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='reportType'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-full justify-between',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? languages.find(
                                        (language) =>
                                          language.value === field.value
                                      )?.label
                                    : 'Pilih No. Bukti'}
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput placeholder='Cari jenis...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {languages.map((language) => (
                                      <CommandItem
                                        value={language.label}
                                        key={language.value}
                                        onSelect={() =>
                                          form.setValue(
                                            'reportType',
                                            language.value
                                          )
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            language.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {language.label}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div> */}

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='rek_jenis'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue === 'lra_sd' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_priode' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !rekKelompokValue ||
                                    pendingRekJenis ||
                                    errorRekJenis
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value?.kd_jenis1 &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingRekJenis ? (
                                      'Memuat...'
                                    ) : field.value?.kd_jenis1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_jenis1}.
                                        {field.value.kd_jenis2}.
                                        {field.value.kd_jenis3} -{' '}
                                        {field.value.nm_rek_jenis}
                                      </LongText>
                                    ) : !buValue ? (
                                      'Pilih Rek Kelompok terlebih dahulu'
                                    ) : (
                                      'Pilih Rek jenis'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Rek Jenis...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {rekJenisList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_jenis1}-${item.kd_jenis2}-${item.kd_jenis3}`}
                                        value={item.nm_rek_jenis}
                                        onSelect={() =>
                                          form.setValue('rek_jenis', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value?.kd_jenis1 ===
                                              item.kd_jenis1 &&
                                              field.value?.kd_jenis2 ===
                                                item.kd_jenis2 &&
                                              field.value?.kd_jenis3 ===
                                                item.kd_jenis3
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_jenis1}.{item.kd_jenis2}.
                                        {item.kd_jenis3} - {item.nm_rek_jenis}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='flex-1' />
                  {/* <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='reportType'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-full justify-between',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? languages.find(
                                        (language) =>
                                          language.value === field.value
                                      )?.label
                                    : 'Pilih Unit'}
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput placeholder='Cari jenis...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {languages.map((language) => (
                                      <CommandItem
                                        value={language.label}
                                        key={language.value}
                                        onSelect={() =>
                                          form.setValue(
                                            'reportType',
                                            language.value
                                          )
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            language.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {language.label}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div> */}
                </div>

                {/* === Baris 5 === */}
                <div className='flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='sumber_dana'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={pendingSD || errorSD}
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingSD ? (
                                      'Memuat...'
                                    ) : field.value && field.value.kd_ref1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_ref1}.
                                        {field.value.kd_ref2}.
                                        {field.value.kd_ref3}.
                                        {field.value.kd_ref4}.
                                        {field.value.kd_ref5}.
                                        {field.value.kd_ref6} -{' '}
                                        {field.value.nm_ref}
                                      </LongText>
                                    ) : (
                                      'Pilih Sumber Dana'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Sumber Dana...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {sumberDanaList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_ref1}-${item.kd_ref2}-${item.kd_ref3}-${item.kd_ref4}-${item.kd_ref5}-${item.kd_ref6}`}
                                        value={item.nm_ref}
                                        onSelect={() =>
                                          form.setValue('sumber_dana', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value &&
                                              item.kd_ref1 ===
                                                field.value.kd_ref1 &&
                                              item.kd_ref2 ===
                                                field.value.kd_ref2 &&
                                              item.kd_ref3 ===
                                                field.value.kd_ref3 &&
                                              item.kd_ref4 ===
                                                field.value.kd_ref4 &&
                                              item.kd_ref5 ===
                                                field.value.kd_ref5 &&
                                              item.kd_ref6 ===
                                                field.value.kd_ref6
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_ref1}.{item.kd_ref2}.
                                        {item.kd_ref3}.{item.kd_ref4}.
                                        {item.kd_ref5}.{item.kd_ref6} -{' '}
                                        {item.nm_ref}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='rek_objek'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue === 'lra_sd' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_priode' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !rekJenisValue ||
                                    pendingRekObjek ||
                                    errorRekObjek
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value?.kd_objek1 &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingRekObjek ? (
                                      'Memuat...'
                                    ) : field.value?.kd_objek1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_objek1}.
                                        {field.value.kd_objek2}.
                                        {field.value.kd_objek3}.
                                        {field.value.kd_objek4} -{' '}
                                        {field.value.nm_rek_objek}
                                      </LongText>
                                    ) : !rekJenisValue ? (
                                      'Pilih Rek Jenis terlebih dahulu'
                                    ) : (
                                      'Pilih Rek Objek'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Rek Objek...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {rekObjekList.map((item) => (
                                      <CommandItem
                                        key={item.id}
                                        value={item.nm_rek_objek}
                                        onSelect={() =>
                                          form.setValue('rek_objek', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value?.kd_objek1 ===
                                              item.kd_objek1 &&
                                              field.value?.kd_objek2 ===
                                                item.kd_objek2 &&
                                              field.value?.kd_objek3 ===
                                                item.kd_objek3 &&
                                              field.value?.kd_objek4 ===
                                                item.kd_objek4
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_objek1}.{item.kd_objek2}.
                                        {item.kd_objek3}.{item.kd_objek4} -{' '}
                                        {item.nm_rek_objek}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1' />
                  {/* <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='reportType'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-full justify-between',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? languages.find(
                                        (language) =>
                                          language.value === field.value
                                      )?.label
                                    : 'Pilih Sub Unit'}
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput placeholder='Cari jenis...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {languages.map((language) => (
                                      <CommandItem
                                        value={language.label}
                                        key={language.value}
                                        onSelect={() =>
                                          form.setValue(
                                            'reportType',
                                            language.value
                                          )
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            language.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {language.label}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div> */}
                </div>

                {/* === Baris 6 === */}
                <div className='flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                  <div className='flex-1' />
                  {/* <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='reportType'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-full justify-between',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? languages.find(
                                        (language) =>
                                          language.value === field.value
                                      )?.label
                                    : 'Pilih Jenis Jurnal'}
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput placeholder='Cari jenis...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {languages.map((language) => (
                                      <CommandItem
                                        value={language.label}
                                        key={language.value}
                                        onSelect={() =>
                                          form.setValue(
                                            'reportType',
                                            language.value
                                          )
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            language.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {language.label}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div> */}

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='rek_rincian'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue === 'lra_sd' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_priode' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !rekObjekValue ||
                                    pendingRekRincian ||
                                    errorRekRincian
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value?.kd_rincian1 &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingRekRincian ? (
                                      'Memuat...'
                                    ) : field.value?.kd_rincian1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_rincian1}.
                                        {field.value.kd_rincian2}.
                                        {field.value.kd_rincian3}.
                                        {field.value.kd_rincian4}.
                                        {field.value.kd_rincian5} -{' '}
                                        {field.value.nm_rek_rincian}
                                      </LongText>
                                    ) : !programValue ? (
                                      'Pilih Rek Objek terlebih dahulu'
                                    ) : (
                                      'Pilih Rek Rincian'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Rek Rincian...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {rekRincianList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_rincian1}-${item.kd_rincian2}-${item.kd_rincian3}-${item.kd_rincian4}-${item.kd_rincian5}`}
                                        value={item.nm_rek_rincian}
                                        onSelect={() =>
                                          form.setValue('rek_rincian', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value?.kd_rincian1 ===
                                              item.kd_rincian1 &&
                                              field.value?.kd_rincian2 ===
                                                item.kd_rincian2 &&
                                              field.value?.kd_rincian3 ===
                                                item.kd_rincian3 &&
                                              field.value?.kd_rincian4 ===
                                                item.kd_rincian4 &&
                                              field.value?.kd_rincian5 ===
                                                item.kd_rincian5
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_rincian1}.{item.kd_rincian2}.
                                        {item.kd_rincian3}.{item.kd_rincian4}.
                                        {item.kd_rincian5} -{' '}
                                        {item.nm_rek_rincian}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='program'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue ===
                                      'r_saldo_buku_besar' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !buValue ||
                                    pendingProgram ||
                                    errorProgram
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value?.kd_prog1 &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingProgram ? (
                                      'Memuat...'
                                    ) : field.value?.kd_prog1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_prog1}.
                                        {field.value.kd_prog2}.
                                        {field.value.kd_prog3} -{' '}
                                        {field.value.nm_program}
                                      </LongText>
                                    ) : !buValue ? (
                                      'Pilih Bidang Urusan terlebih dahulu'
                                    ) : (
                                      'Pilih Program'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Program...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {programList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_prog1}-${item.kd_prog2}-${item.kd_prog3}`}
                                        value={item.nm_program}
                                        onSelect={() =>
                                          form.setValue('program', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value?.kd_prog1 ===
                                              item.kd_prog1 &&
                                              field.value?.kd_prog2 ===
                                                item.kd_prog2 &&
                                              field.value?.kd_prog3 ===
                                                item.kd_prog3
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_prog1}.{item.kd_prog2}.
                                        {item.kd_prog3} - {item.nm_program}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* === Baris 7 === */}
                <div className='flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                  {/* Kolom 2 kosong */}
                  <div className='flex-1' />

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='sub_rincian'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue === 'lra_sd' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_priode' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !rekRincianValue ||
                                    pendingSubRincian ||
                                    errorSubRincian
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value?.kd_subrincian1 &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingSubRincian ? (
                                      'Memuat...'
                                    ) : field.value?.kd_subrincian1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_subrincian1}.
                                        {field.value.kd_subrincian2}.
                                        {field.value.kd_subrincian3}.
                                        {field.value.kd_subrincian4}.
                                        {field.value.kd_subrincian5}.
                                        {field.value.kd_subrincian6} -{' '}
                                        {field.value.nm_sub_rincian}
                                      </LongText>
                                    ) : !rekRincianValue ? (
                                      'Pilih Rek Rincian terlebih dahulu'
                                    ) : (
                                      'Pilih Sub Rincian'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Sub Rincian...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {subRincianList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_subrincian1}-${item.kd_subrincian2}-${item.kd_subrincian3}-${item.kd_subrincian4}-${item.kd_subrincian5}-${item.kd_subrincian6}`}
                                        value={item.nm_sub_rincian}
                                        onSelect={() =>
                                          form.setValue('sub_rincian', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value?.kd_subrincian1 ===
                                              item.kd_subrincian1 &&
                                              field.value?.kd_subrincian2 ===
                                                item.kd_subrincian2 &&
                                              field.value?.kd_subrincian3 ===
                                                item.kd_subrincian3 &&
                                              field.value?.kd_subrincian4 ===
                                                item.kd_subrincian4 &&
                                              field.value?.kd_subrincian5 ===
                                                item.kd_subrincian5 &&
                                              field.value?.kd_subrincian6 ===
                                                item.kd_subrincian6
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_subrincian1}.
                                        {item.kd_subrincian2}.
                                        {item.kd_subrincian3}.
                                        {item.kd_subrincian4}.
                                        {item.kd_subrincian5}.
                                        {item.kd_subrincian6} -{' '}
                                        {item.nm_sub_rincian}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='kegiatan'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue ===
                                      'r_saldo_buku_besar' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !programValue ||
                                    pendingKeg ||
                                    errorKeg
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value?.kd_keg1 &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingKeg ? (
                                      'Memuat...'
                                    ) : field.value?.kd_keg1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_keg1}.
                                        {field.value.kd_keg2}.
                                        {field.value.kd_keg3}.
                                        {field.value.kd_keg4}.
                                        {field.value.kd_keg5} -{' '}
                                        {field.value.nm_kegiatan}
                                      </LongText>
                                    ) : !programValue ? (
                                      'Pilih Program terlebih dahulu'
                                    ) : (
                                      'Pilih Kegiatan'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Kegiatan...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {kegiatanList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_keg1}-${item.kd_keg2}-${item.kd_keg3}-${item.kd_keg4}-${item.kd_keg5}`}
                                        value={item.nm_kegiatan}
                                        onSelect={() =>
                                          form.setValue('kegiatan', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value?.kd_keg1 ===
                                              item.kd_keg1 &&
                                              field.value?.kd_keg2 ===
                                                item.kd_keg2 &&
                                              field.value?.kd_keg3 ===
                                                item.kd_keg3 &&
                                              field.value?.kd_keg4 ===
                                                item.kd_keg4 &&
                                              field.value?.kd_keg5 ===
                                                item.kd_keg5
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_keg1}.{item.kd_keg2}.
                                        {item.kd_keg3}.{item.kd_keg4}.
                                        {item.kd_keg5} - {item.nm_kegiatan}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* === Baris 8 === */}
                <div className='flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6'>
                  {/* Kolom 1 kosong */}
                  <div className='flex-1' />

                  {/* Kolom 2 kosong */}
                  <div className='flex-1' />

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='subkegiatan'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  disabled={
                                    jenisLaporanValue ===
                                      'r_saldo_buku_besar' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_urusan' ||
                                    jenisLaporanValue ===
                                      'lra_anggaran_per_program_kegiatan' ||
                                    !kegiatanValue ||
                                    pendingSubkeg ||
                                    errorSubkeg
                                  }
                                  className={cn(
                                    'min-h-[2.5rem] w-full justify-between text-left',
                                    !field.value?.kd_subkeg1 &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <div className='flex-1 text-left'>
                                    {pendingSubkeg ? (
                                      'Memuat...'
                                    ) : field.value?.kd_subkeg1 ? (
                                      <LongText className='max-w-[180px] md:max-w-[250px]'>
                                        {field.value.kd_subkeg1}.
                                        {field.value.kd_subkeg2}.
                                        {field.value.kd_subkeg3}.
                                        {field.value.kd_subkeg4}.
                                        {field.value.kd_subkeg5}.
                                        {field.value.kd_subkeg6} -{' '}
                                        {field.value.nm_subkegiatan}
                                      </LongText>
                                    ) : !kegiatanValue ? (
                                      'Pilih Kegiatan terlebih dahulu'
                                    ) : (
                                      'Pilih Sub Kegiatan'
                                    )}
                                  </div>
                                  <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              align='start'
                              className='w-[var(--radix-popover-trigger-width)] p-0'
                            >
                              <Command className='max-h-[300px] overflow-y-auto'>
                                <CommandInput placeholder='Cari Sub Kegiatan...' />
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {subkegiatanList.map((item) => (
                                      <CommandItem
                                        key={`${item.kd_subkeg1}-${item.kd_subkeg2}-${item.kd_subkeg3}-${item.kd_subkeg4}-${item.kd_subkeg5}-${item.kd_subkeg6}`}
                                        value={item.nm_subkegiatan}
                                        onSelect={() =>
                                          form.setValue('subkegiatan', item)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            field.value?.kd_subkeg1 ===
                                              item.kd_subkeg1 &&
                                              field.value?.kd_subkeg2 ===
                                                item.kd_subkeg2 &&
                                              field.value?.kd_subkeg3 ===
                                                item.kd_subkeg3 &&
                                              field.value?.kd_subkeg4 ===
                                                item.kd_subkeg4 &&
                                              field.value?.kd_subkeg5 ===
                                                item.kd_subkeg5 &&
                                              field.value?.kd_subkeg6 ===
                                                item.kd_subkeg6
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {item.kd_subkeg1}.{item.kd_subkeg2}.
                                        {item.kd_subkeg3}.{item.kd_subkeg4}.
                                        {item.kd_subkeg5}.{item.kd_subkeg6} -{' '}
                                        {item.nm_subkegiatan}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* === Tombol === */}
                <div className='flex justify-end space-x-4 pt-6'>
                  <Button type='button' variant='outline'>
                    Preview
                  </Button>
                  <Button type='submit'>Cetak Laporan</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </Main>
    </>
  )
}
