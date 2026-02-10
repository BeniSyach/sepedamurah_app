'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type MasterSkpd,
  useGetRefSKPD,
  usePostAksesDPASKPD,
  usePutAksesDPASKPD,
  type AksesDPAGroup,
  useGetRefDPA,
} from '@/api'
import { Check, CheckIcon, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  id: z.string().optional(),
  tahun: z.string().min(1, 'Tahun wajib dipilih'),
  kd_opd: z.array(z.string()).min(1, 'Pilih minimal 1 SKPD'),
  dpaIds: z.array(z.string()).min(1, 'Pilih minimal 1 DPA'),
})

type AksesDPASKPDForm = z.infer<typeof formSchema>

type AksesDPASKPDActionDialogProps = {
  currentRow?: AksesDPAGroup
  open: boolean
  onOpenChange: (open: boolean) => void
}

const currentYear = new Date().getFullYear()
const tahunOptions = Array.from({ length: 7 }, (_, i) => {
  const year = currentYear - 3 + i
  return { value: String(year), label: String(year) }
})

export function AksesDPASKPDActionDialog({
  currentRow,
  open,
  onOpenChange,
}: AksesDPASKPDActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: post } = usePostAksesDPASKPD()
  const { mutateAsync: put } = usePutAksesDPASKPD()

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

  const { data: dataDPA } = useGetRefDPA({
    page: 1,
    perPage: 9999, // biar ambil semua DPA
  })

  const form = useForm<AksesDPASKPDForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          tahun: currentRow.tahun ?? String(currentYear),
          kd_opd: [
            [
              currentRow.kd_opd1,
              currentRow.kd_opd2,
              currentRow.kd_opd3,
              currentRow.kd_opd4,
              currentRow.kd_opd5,
            ]
              .filter(Boolean)
              .join('-'),
          ],
          dpaIds: currentRow?.dpa?.map((d) => String(d.id)) ?? [],
        }
      : {
          tahun: String(currentYear),
          kd_opd: [],
          dpaIds: [],
        },
  })

  const onSubmit = async (data: AksesDPASKPDForm) => {
    const opdParsed = data.kd_opd.map((v) => {
      const [kd_opd1, kd_opd2, kd_opd3, kd_opd4, kd_opd5] = v.split('-')
      return { kd_opd1, kd_opd2, kd_opd3, kd_opd4, kd_opd5 }
    })

    const payload = {
      opd: opdParsed,
      dpaIds: data.dpaIds,
      tahun: data.tahun,
    }
    const requestPromise = isEdit ? put(payload) : post(payload)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Akses DPA SKPD berhasil diperbarui!'
          : 'Data Akses DPA SKPD berhasil ditambahkan!'
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
            {' '}
            {isEdit ? 'Edit Akses DPA SKPD' : 'Tambah Akses DPA SKPD'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Akses DPA SKPD disini. '
              : 'Tambah baru Akses DPA SKPD disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='akses-dpa-skpd-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kd_opd'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih SKPD
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          role='combobox'
                          className='col-span-4 justify-between'
                        >
                          {field.value?.length
                            ? `${field.value.length} SKPD dipilih`
                            : 'Pilih SKPD'}
                          <ChevronDown className='ml-2 h-4 w-4 opacity-50' />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className='col-span-4 p-0'>
                        <Command>
                          {/* (Optional) Search */}
                          <CommandInput placeholder='Cari SKPD...' />

                          {/* INI YANG PENTING */}
                          <CommandList className='max-h-64 overflow-y-auto'>
                            <CommandGroup>
                              {safeItemsSKPD.map((item) => {
                                const selected = field.value?.includes(
                                  item.value
                                )

                                return (
                                  <CommandItem
                                    key={item.value}
                                    onSelect={() => {
                                      if (selected) {
                                        field.onChange(
                                          field.value.filter(
                                            (v: string) => v !== item.value
                                          )
                                        )
                                      } else {
                                        field.onChange([
                                          ...(field.value ?? []),
                                          item.value,
                                        ])
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        selected ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {item.label}
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dpaIds'
                render={({ field }) => {
                  const selectedIds = field.value || []
                  const listDPA = dataDPA?.data ?? []

                  return (
                    <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 pt-2 text-end'>
                        Pilih DPA
                      </FormLabel>

                      <div className='col-span-4 w-full'>
                        <FormControl>
                          <Command className='rounded-md border'>
                            <CommandInput placeholder='Cari DPA...' />

                            <CommandList>
                              {listDPA.length === 0 && (
                                <CommandEmpty>Tidak ada DPA</CommandEmpty>
                              )}

                              <CommandGroup>
                                {listDPA.map((item) => {
                                  const id = String(item.id)
                                  const selected = selectedIds.includes(id)

                                  return (
                                    <CommandItem
                                      key={id}
                                      onSelect={() => {
                                        if (selected) {
                                          field.onChange(
                                            selectedIds.filter((v) => v !== id)
                                          )
                                        } else {
                                          field.onChange([...selectedIds, id])
                                        }
                                      }}
                                    >
                                      <span>{item.nm_dpa}</span>

                                      {selected && (
                                        <CheckIcon className='ml-auto h-4 w-4' />
                                      )}
                                    </CommandItem>
                                  )
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </FormControl>
                      </div>

                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name='tahun'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Tahun</FormLabel>

                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      items={tahunOptions}
                      placeholder='Pilih Tahun'
                      className='col-span-4 w-full'
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='akses-dpa-skpd-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
