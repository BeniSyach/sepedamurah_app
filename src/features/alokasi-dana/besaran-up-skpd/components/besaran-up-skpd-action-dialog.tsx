'use client'

import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useGetRefSKPD,
  usePostUpSkpd,
  usePutUpSkpd,
  type MasterSkpd,
  type UpSkpd,
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
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  skpd: z.string().min(1, 'SKPD wajib dipilih.'), // hasil select, nanti di-split
  tahun: z.string().regex(/^\d{4}$/, 'Tahun harus berupa 4 digit angka.'),
  pagu: z
    .string()
    .regex(/^\d+$/, 'Pagu harus berupa angka dalam bentuk string.'),
  up_kkpd: z
    .string()
    .regex(/^\d+$/, 'UP KKPD harus berupa angka dalam bentuk string.'),
  isEdit: z.boolean().optional(),
})
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: UpSkpd
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

  const { mutateAsync: postUpSkpdAsync } = usePostUpSkpd()
  const { mutateAsync: putUpSkpdAsync } = usePutUpSkpd()

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

  const { data: dataSKPD } = useGetRefSKPD({
    page: 1,
    perPage: 100,
  })

  const itemsSKPD =
    dataSKPD?.data?.map((item: MasterSkpd) => ({
      value: [
        item.kd_opd1,
        item.kd_opd2,
        item.kd_opd3,
        item.kd_opd4,
        item.kd_opd5,
      ]
        .filter(Boolean)
        .join('.'),
      label: item.nm_opd ?? '0',
    })) ?? []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          skpd: [
            currentRow.kd_opd1,
            currentRow.kd_opd2,
            currentRow.kd_opd3,
            currentRow.kd_opd4,
            currentRow.kd_opd5,
          ]
            .filter(Boolean)
            .join('.'),
          tahun: currentRow.tahun,
          pagu: currentRow.pagu,
          up_kkpd: currentRow.up_kkpd ?? '',
          isEdit: true,
        }
      : {
          skpd: '',
          tahun: '',
          pagu: '0',
          up_kkpd: '0',
          isEdit: false,
        },
  })

  const onSubmit = async (data: UserForm) => {
    const [kd_opd1, kd_opd2, kd_opd3, kd_opd4, kd_opd5] = data.skpd.split('.')

    const payload = {
      ...data,
      kd_opd1,
      kd_opd2,
      kd_opd3,
      kd_opd4,
      kd_opd5,
    }
    const requestPromise = isEdit
      ? putUpSkpdAsync(payload)
      : postUpSkpdAsync(payload)

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
            {isEdit ? 'Edit Besaran UP SKPD' : 'Tambah Baru Besaran UP SKPD'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Besaran UP SKPD disini. '
              : 'Tambah baru Besaran UP SKPD disini. '}
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
                name='skpd'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>SKPD</FormLabel>
                    <div className='col-span-4'>
                      <SelectDropdown
                        defaultValue={String(field.value ?? '')}
                        onValueChange={(val) => field.onChange(val)}
                        placeholder='Pilih SKPD'
                        className='w-full break-words whitespace-normal'
                        items={itemsSKPD.map(({ label, value }) => ({
                          label,
                          value,
                        }))}
                      />
                      <FormMessage />
                    </div>
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
                    <FormLabel className='col-span-2 text-end'>
                      UP Tunai
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Jumlah UP Tunai'
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
                name='up_kkpd'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      UP KKPD
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Jumlah UP KKPD'
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
