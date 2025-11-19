'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type SumberDana,
  useGetRefSumberDana,
  usePostRealisasiTransferSumberDana,
  usePutRealisasiTransferSumberDana,
  type RealisasiTransferSumberDana,
} from '@/api'
import { toast } from 'sonner'
import { formatRupiahControlled } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/date-picker'
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  sumber_dana: z.string().min(1, 'Sumber Dana wajib dipilih.'),
  tahun: z.string().regex(/^\d{4}$/, 'Tahun harus berupa 4 digit angka.'),
  tgl_diterima: z.date('tanggal Diterima Harus Ada.'),
  jumlah_sumber: z
    .string()
    .regex(/^\d+$/, 'Jumlah Sumber harus berupa angka dalam bentuk string.'),
  keterangan: z.string().optional(),
  keterangan_2: z.string().optional(),
  isEdit: z.boolean().optional(),
})

type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: RealisasiTransferSumberDana
  open: boolean
  onOpenChange: (open: boolean) => void
}

function toLocalISOString(date: Date) {
  const tzOffset = date.getTimezoneOffset() * 60000 // offset dalam ms
  const localTime = new Date(date.getTime() - tzOffset)
  return localTime.toISOString().slice(0, 23) + 'Z' // biar tetap bentuk ISO
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: postRealisasiTransferSumberDanaAsync } =
    usePostRealisasiTransferSumberDana()
  const { mutateAsync: putRealisasiTransferSumberDanaAsync } =
    usePutRealisasiTransferSumberDana()

  const { data: dataSD } = useGetRefSumberDana({ page: 1, perPage: 1000 })
  const itemsSD =
    dataSD?.data?.map((item: SumberDana) => ({
      value: [
        item.kd_ref1,
        item.kd_ref2,
        item.kd_ref3,
        item.kd_ref4,
        item.kd_ref5,
        item.kd_ref6,
      ]
        .filter(Boolean)
        .join('.'),
      label: item.nm_ref ?? '',
    })) ?? []

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues:
      isEdit && currentRow
        ? {
            sumber_dana: [
              currentRow.kd_ref1,
              currentRow.kd_ref2,
              currentRow.kd_ref3,
              currentRow.kd_ref4,
              currentRow.kd_ref5,
              currentRow.kd_ref6,
            ]
              .filter(Boolean)
              .join('.'),
            tahun: currentRow.tahun ?? '',
            tgl_diterima: currentRow.tgl_diterima
              ? new Date(currentRow.tgl_diterima)
              : new Date(),
            jumlah_sumber: String(currentRow.jumlah_sumber ?? ''),
            keterangan: String(currentRow.keterangan ?? ''),
            keterangan_2: currentRow.keterangan_2 ?? null,
            isEdit: true,
          }
        : {
            sumber_dana: '',
            tahun: new Date().getFullYear().toString(),
            tgl_diterima: new Date(),
            jumlah_sumber: '',
            keterangan: '',
            keterangan_2: '',
            isEdit: false,
          },
  })

  const onSubmit = async (data: UserForm) => {
    const [kd_ref1, kd_ref2, kd_ref3, kd_ref4, kd_ref5, kd_ref6] =
      data.sumber_dana.split('.')

    const selectedItem = itemsSD.find((x) => x.value === data.sumber_dana)
    const nm_sumber = selectedItem?.label ?? ''

    const payload = {
      ...data,
      tgl_diterima: toLocalISOString(data.tgl_diterima),
      kd_ref1,
      kd_ref2,
      kd_ref3,
      kd_ref4,
      kd_ref5,
      kd_ref6,
      nm_sumber,
    }
    const requestPromise = isEdit
      ? putRealisasiTransferSumberDanaAsync(payload)
      : postRealisasiTransferSumberDanaAsync(payload)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Realisasi Transfer Sumber Dana diperbarui!'
          : 'Data Realisasi Transfer Sumber Dana ditambahkan!'
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
            {isEdit
              ? 'Edit Realisasi Transfer Sumber Dana'
              : 'Tambah Baru Realisasi Transfer Sumber Dana'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Realisasi Transfer Sumber Dana disini. '
              : 'Tambah baru Realisasi Transfer Sumber Dana disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='sumber_dana'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Sumber Dana
                    </FormLabel>

                    <div className='col-span-4'>
                      <SelectDropdown
                        defaultValue={String(field.value ?? '')}
                        onValueChange={(val) => field.onChange(val)}
                        placeholder='Pilih Sumber Dana'
                        className='w-full break-words whitespace-normal'
                        items={itemsSD.map(({ label, value }) => ({
                          label,
                          value,
                        }))}
                      />

                      <FormMessage className='col-span-4 col-start-3 mt-1 text-sm text-red-500' />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tgl_diterima'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Tanggal Surat
                    </FormLabel>
                    <DatePicker
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='jumlah_sumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Jumlah Dana masuk
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Jumlah Dana masuk'
                        className='col-span-4'
                        type='text'
                        inputMode='numeric'
                        value={formatRupiahControlled(field.value || '')}
                        onChange={(e) => {
                          // Hapus semua karakter selain angka
                          const raw = e.target.value.replace(/\D/g, '')
                          field.onChange(raw)
                        }}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='keterangan_2'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Keterangan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Keterangan'
                        className='col-span-4'
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
          <Button type='submit' form='user-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
