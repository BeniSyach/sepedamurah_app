'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type MasterSkpd,
  useGetRefSKPD,
  usePostAksesPajakBendahara,
  usePutAksesPajakBendahara,
  type AksesPajakBendaharaGroup,
  useGetRefPajakBendahara,
} from '@/api'
import { CheckIcon } from 'lucide-react'
import { toast } from 'sonner'
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
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  id: z.string().optional(),
  tahun: z.string().min(1, 'Tahun wajib dipilih'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
  pajakIds: z.array(z.string()).min(1, 'Pilih minimal 1 Pajak Bendahara'),
})

type AksesDPASKPDForm = z.infer<typeof formSchema>

type AksesDPASKPDActionDialogProps = {
  currentRow?: AksesPajakBendaharaGroup
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

  const { mutateAsync: post } = usePostAksesPajakBendahara()
  const { mutateAsync: put } = usePutAksesPajakBendahara()

  const {
    data: dataSKPD,
    isLoading: isLoadingSKPD,
    isError: isErrorSKPD,
  } = useGetRefSKPD({
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

  const { data: dataDPA } = useGetRefPajakBendahara({
    page: 1,
    perPage: 9999, // biar ambil semua DPA
  })

  const form = useForm<AksesDPASKPDForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          tahun: currentRow.tahun ?? String(currentYear),
          kd_opd1: currentRow.kd_opd1,
          kd_opd2: currentRow.kd_opd2,
          kd_opd3: currentRow.kd_opd3,
          kd_opd4: currentRow.kd_opd4,
          kd_opd5: currentRow.kd_opd5,
          pajakIds: currentRow?.pajak?.map((d) => String(d.id)) ?? [],
        }
      : {
          tahun: String(currentYear),
          kd_opd1: '',
          kd_opd2: '',
          kd_opd3: '',
          kd_opd4: '',
          kd_opd5: '',
          pajakIds: [],
        },
  })

  const onSubmit = async (data: AksesDPASKPDForm) => {
    const payload = {
      kd_opd1: data.kd_opd1,
      kd_opd2: data.kd_opd2,
      kd_opd3: data.kd_opd3,
      kd_opd4: data.kd_opd4,
      kd_opd5: data.kd_opd5,
      pajakIds: data.pajakIds,
      tahun: data.tahun,
    }
    const requestPromise = isEdit ? put(payload) : post(payload)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Akses Pajak Bendahara berhasil diperbarui!'
          : 'Data Akses Pajak Bendahara berhasil ditambahkan!'
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
            {isEdit
              ? 'Edit Akses Pajak Bendahara'
              : 'Tambah Akses Pajak Bendahara'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Akses Pajak Bendahara disini. '
              : 'Tambah baru Akses Pajak Bendahara disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='akses-pajak-bendahara-skpd-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kd_opd1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih SKPD
                    </FormLabel>

                    <SelectDropdown
                      // 💡 Gunakan gabungan kode SKPD sebagai default value
                      defaultValue={
                        [
                          form.getValues('kd_opd1'),
                          form.getValues('kd_opd2'),
                          form.getValues('kd_opd3'),
                          form.getValues('kd_opd4'),
                          form.getValues('kd_opd5'),
                        ]
                          .filter(Boolean)
                          .join('-') || undefined
                      }
                      onValueChange={(value) => {
                        const parts = value.split('-')
                        form.setValue('kd_opd1', parts[0] ?? '')
                        form.setValue('kd_opd2', parts[1] ?? '')
                        form.setValue('kd_opd3', parts[2] ?? '')
                        form.setValue('kd_opd4', parts[3] ?? '')
                        form.setValue('kd_opd5', parts[4] ?? '')
                        field.onChange(parts[0])
                      }}
                      placeholder='Pilih SKPD'
                      className='col-span-4 w-full'
                      isPending={isLoadingSKPD}
                      items={safeItemsSKPD}
                      disabled={isErrorSKPD}
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pajakIds'
                render={({ field }) => {
                  const selectedIds = field.value || []
                  const listDPA = dataDPA?.data ?? []

                  return (
                    <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 pt-2 text-end'>
                        Pajak Bendahara
                      </FormLabel>

                      <div className='col-span-4 w-full'>
                        <FormControl>
                          <Command className='rounded-md border'>
                            <CommandInput placeholder='Cari Pajak Bendahara...' />

                            <CommandList>
                              {listDPA.length === 0 && (
                                <CommandEmpty>
                                  Tidak ada Pajak Bendahara
                                </CommandEmpty>
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
                                      <span>{item.nm_pajak_bendahara}</span>

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
          <Button type='submit' form='akses-pajak-bendahara-skpd-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
