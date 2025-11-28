'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type MasterSkpd,
  useGetRefSKPD,
  type BatasWaktu,
  usePostBatasWaktu,
  usePutBatasWaktu,
} from '@/api'
import { CheckIcon } from 'lucide-react'
import { toast } from 'sonner'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SelectDropdown } from '@/components/select-dropdown'

const hariItems = [
  { value: 'Monday', label: 'Senin' },
  { value: 'Tuesday', label: 'Selasa' },
  { value: 'Wednesday', label: 'Rabu' },
  { value: 'Thursday', label: 'Kamis' },
  { value: 'Friday', label: 'Jumat' },
  { value: 'Saturday', label: 'Sabtu' },
  { value: 'Sunday', label: 'Minggu' },
]

const formSchema = z.object({
  id: z.string().optional(),
  hari: z.string().min(1, 'Role Harus Ada.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
  waktu_awal: z.string().min(1, 'Waktu Awal Harus Ada.'),
  waktu_akhir: z.string().min(1, 'Waktu Akhir Harus Ada.'),
  istirahat_awal: z.string().min(1, 'Istirahat Awal Harus Ada.'),
  istirahat_akhir: z.string().min(1, 'Istirahat Akhir Harus Ada.'),
  keterangan: z.string().min(1, 'Keterangan Harus Ada.'),
})
type BatasWaktuForm = z.infer<typeof formSchema>

type BatasWaktuActionDialogProps = {
  currentRow?: BatasWaktu
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BatasWaktusActionDialog({
  currentRow,
  open,
  onOpenChange,
}: BatasWaktuActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: postBatasWaktuAsync } = usePostBatasWaktu()
  const { mutateAsync: putBatasWaktuAsync } = usePutBatasWaktu()

  const { data: dataSKPD, isError: isErrorSKPD } = useGetRefSKPD({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
    hidden: '0',
  })

  // Ambil data dari response
  const itemsSKPD =
    dataSKPD?.data?.map((item: MasterSkpd) => ({
      // Gabungkan kd_opd1...5 menjadi satu string
      value: [
        item.kd_opd1,
        item.kd_opd2,
        item.kd_opd3,
        item.kd_opd4,
        item.kd_opd5,
      ]
        .filter(Boolean) // hilangkan undefined/null jika ada
        .join('-'), // hasil: "00-01-01-02-03"

      label: item.nm_opd ?? '',
    })) ?? []

  // Kalau error, bisa fallback ke array kosong
  const safeItemsSKPD = isErrorSKPD ? [] : itemsSKPD

  const form = useForm<BatasWaktuForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id ?? '',
          hari: currentRow.hari ?? '',
          kd_opd1: currentRow?.kd_opd1 ?? '',
          kd_opd2: currentRow?.kd_opd2 ?? '',
          kd_opd3: currentRow?.kd_opd3 ?? '',
          kd_opd4: currentRow?.kd_opd4 ?? '',
          kd_opd5: currentRow?.kd_opd5 ?? '',
          waktu_awal: currentRow.waktu_awal ?? '',
          waktu_akhir: currentRow.waktu_akhir ?? '',
          istirahat_awal: currentRow.istirahat_awal ?? '',
          istirahat_akhir: currentRow.istirahat_akhir ?? '',
          keterangan: currentRow.keterangan ?? '',
        }
      : {
          id: '',
          hari: '',
          kd_opd1: '',
          kd_opd2: '',
          kd_opd3: '',
          kd_opd4: '',
          kd_opd5: '',
          waktu_awal: '',
          waktu_akhir: '',
          istirahat_awal: '',
          istirahat_akhir: '',
          keterangan: '',
        },
  })

  const onSubmit = async (data: BatasWaktuForm) => {
    const requestPromise = isEdit
      ? putBatasWaktuAsync(data)
      : postBatasWaktuAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Batas Waktu berhasil diperbarui!'
          : 'Data Batas Waktu berhasil ditambahkan!'
      },
      error: (err) => {
        const message =
          err?.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan data.'
        return message
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Batas Waktu' : 'Tambah Baru Batas Waktu'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Batas Waktu disini. '
              : 'Tambah baru Batas Waktu disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='BatasWaktu-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kd_opd1'
                render={({ field }) => {
                  const currentValue = [
                    form.getValues('kd_opd1'),
                    form.getValues('kd_opd2'),
                    form.getValues('kd_opd3'),
                    form.getValues('kd_opd4'),
                    form.getValues('kd_opd5'),
                  ]
                    .filter(Boolean)
                    .join('-')

                  const selectedLabel =
                    safeItemsSKPD.find((i) => i.value === currentValue)
                      ?.label || 'Pilih SKPD'

                  return (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      {/* Label */}
                      <FormLabel className='col-span-2 text-end'>
                        SKPD
                      </FormLabel>

                      {/* ComboBox */}
                      <div className='col-span-4'>
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
                                  {selectedLabel}
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
                                  {safeItemsSKPD.map((opd) => {
                                    const parts = opd.value.split('-')
                                    const isSelected =
                                      opd.value === currentValue

                                    return (
                                      <CommandItem
                                        key={opd.value}
                                        value={opd.label}
                                        onSelect={() => {
                                          form.setValue(
                                            'kd_opd1',
                                            parts[0] ?? ''
                                          )
                                          form.setValue(
                                            'kd_opd2',
                                            parts[1] ?? ''
                                          )
                                          form.setValue(
                                            'kd_opd3',
                                            parts[2] ?? ''
                                          )
                                          form.setValue(
                                            'kd_opd4',
                                            parts[3] ?? ''
                                          )
                                          form.setValue(
                                            'kd_opd5',
                                            parts[4] ?? ''
                                          )
                                          field.onChange(parts[0])
                                        }}
                                      >
                                        <CheckIcon
                                          className={cn(
                                            'size-4',
                                            isSelected
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {opd.label}
                                      </CommandItem>
                                    )
                                  })}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Form error */}
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name='hari'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih Hari
                    </FormLabel>

                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih Hari'
                      className='col-span-4 w-full'
                      items={hariItems}
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='waktu_awal'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Waktu awal
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        placeholder='Waktu awal'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='waktu_akhir'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Waktu Akhir
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        placeholder='Waktu Akhir'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='istirahat_awal'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Istirahat Awal
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        placeholder='Istirahat Awal'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='istirahat_akhir'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Istirahat Akhir
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        placeholder='Istirahat Akhir'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='keterangan'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Keterangan
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Keterangan'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='BatasWaktu-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
