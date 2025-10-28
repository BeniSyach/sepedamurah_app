'use client'

import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type SumberDana,
  usePostPaguSumberDana,
  usePutPaguSumberDana,
  type PaguSumberDana,
  useGetRefSumberDana,
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
import { DatePicker } from '@/components/date-picker'
import { SelectDropdown } from '@/components/select-dropdown'

// === Zod Schema ===
const formSchema = z.object({
  sumber_dana: z.string().min(1, 'Sumber Dana wajib dipilih.'),
  tahun: z.string().regex(/^\d{4}$/, 'Tahun harus berupa 4 digit angka.'),
  tgl_rekam: z.date('tanggal Rekam Harus Ada.'),
  pagu: z
    .string()
    .regex(/^\d+$/, 'Pagu harus berupa angka dalam bentuk string.'),
  jumlah_silpa: z
    .string()
    .regex(/^\d+$/, 'Jumlah Silpa harus berupa angka dalam bentuk string.'),
  isEdit: z.boolean().optional(),
})

type PaguSumberDanaForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: PaguSumberDana
  open: boolean
  onOpenChange: (open: boolean) => void
}

const currentYear = new Date().getFullYear()

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow

  // Buat array tahun: 3 tahun ke belakang sampai 3 tahun ke depan
  const years = useMemo(() => {
    const arr = []
    for (let y = currentYear - 3; y <= currentYear + 3; y++) {
      arr.push({
        label: y.toString(),
        value: y.toString(),
      })
    }
    return arr
  }, [currentYear])

  const { mutateAsync: postPaguSumberDanaAsync } = usePostPaguSumberDana()
  const { mutateAsync: putPaguSumberDanaAsync } = usePutPaguSumberDana()

  const { data: dataSD } = useGetRefSumberDana({ page: 1, perPage: 100 })
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

  const form = useForm<PaguSumberDanaForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
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
          tahun: currentRow.tahun,
          tgl_rekam: currentRow.tgl_rekam,
          pagu: currentRow.pagu,
          jumlah_silpa: String(currentRow.jumlah_silpa),
          isEdit: true,
        }
      : {
          sumber_dana: '',
          tahun: '',
          tgl_rekam: new Date(),
          pagu: '',
          jumlah_silpa: '',
          isEdit: false,
        },
  })

  const onSubmit = async (data: PaguSumberDanaForm) => {
    const [kd_ref1, kd_ref2, kd_ref3, kd_ref4, kd_ref5, kd_ref6] =
      data.sumber_dana.split('.')

    const payload = {
      ...data,
      kd_ref1,
      kd_ref2,
      kd_ref3,
      kd_ref4,
      kd_ref5,
      kd_ref6,
    }
    const requestPromise = isEdit
      ? putPaguSumberDanaAsync(payload)
      : postPaguSumberDanaAsync(payload)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Pagu Sumber Dana diperbarui!'
          : 'Data Pagu Sumber Dana ditambahkan!'
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
            {isEdit ? 'Edit Pagu Sumber Dana' : 'Tambah Baru Pagu Sumber Dana'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Pagu Sumber Dana disini. '
              : 'Tambah baru Pagu Sumber Dana disini. '}
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
                name='tgl_rekam'
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
                name='tahun'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih Tahun
                    </FormLabel>

                    <SelectDropdown
                      defaultValue={currentYear.toString()} // default tahun sekarang
                      onValueChange={(value) => {
                        // Kalau value tahun, bisa langsung set ke form
                        field.onChange(value)
                      }}
                      placeholder='Pilih Tahun'
                      className='col-span-4 w-full'
                      items={years} // array tahun
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pagu'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Pagu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Jumlah Pagu'
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
                name='jumlah_silpa'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Jumlah Silpa
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Jumlah Silpa'
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
