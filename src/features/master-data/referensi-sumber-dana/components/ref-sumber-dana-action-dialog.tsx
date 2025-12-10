'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostRefSumberDana,
  usePutRefSumberDana,
  type SumberDana,
} from '@/api'
import { toast } from 'sonner'
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

const status = [
  {
    value: 1,
    label: 'Aktif',
  },
  {
    value: 0,
    label: 'Tidak Aktif',
  },
]

const jenis = [
  {
    value: 'UMUM',
    label: 'Umum',
  },
  {
    value: 'KHUSUS',
    label: 'Khusus',
  },
]

const formSchema = z.object({
  kd_ref1: z.string().min(1, 'Kode Referensi Ke - 1 Harus Ada.'),
  kd_ref2: z.string().min(1, 'Kode Referensi Ke - 2 Harus Ada.'),
  kd_ref3: z.string().min(1, 'Kode Referensi Ke - 3 Harus Ada.'),
  kd_ref4: z.string().min(1, 'Kode Referensi Ke - 4 Harus Ada.'),
  kd_ref5: z.string().min(1, 'Kode Referensi Ke - 5 Harus Ada.'),
  kd_ref6: z.string().min(1, 'Kode Referensi Ke - 6 Harus Ada.'),
  nm_ref: z.string().min(1, 'Nama Sumber Dana Harus Ada.'),
  status: z.string().min(1, 'Status Harus Ada.'),
  jenis_sumber_dana: z.string().min(1, 'Jenis Sumber Dana Harus Ada.'),
})
type SumberDanaForm = z.infer<typeof formSchema>

type SumberDanaActionDialogProps = {
  currentRow?: SumberDana
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SumberDanasActionDialog({
  currentRow,
  open,
  onOpenChange,
}: SumberDanaActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefSumberDanaAsync } = usePostRefSumberDana()
  const { mutateAsync: putRefSumberDanaAsync } = usePutRefSumberDana()

  const form = useForm<SumberDanaForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_ref1: '',
      kd_ref2: '',
      kd_ref3: '',
      kd_ref4: '',
      kd_ref5: '',
      kd_ref6: '',
      nm_ref: '',
      status: '',
      jenis_sumber_dana: '',
    },
  })

  const onSubmit = async (data: SumberDanaForm) => {
    const requestPromise = isEdit
      ? putRefSumberDanaAsync(data)
      : postRefSumberDanaAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Sumber Dana berhasil diperbarui!'
          : 'Data Sumber Dana berhasil ditambahkan!'
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
            {isEdit ? 'Edit Sumber Dana' : 'Tambah Baru Sumber Dana'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Sumber Dana disini. '
              : 'Tambah baru Sumber Dana disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='SumberDana-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kd_ref1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Referensi 1
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Referensi Ke - 1'
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
                name='kd_ref2'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Referensi 2
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Referensi Ke - 2'
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
                name='kd_ref3'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Referensi 3
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Referensi Ke - 3'
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
                name='kd_ref4'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Referensi 4
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Referensi Ke - 4'
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
                name='kd_ref5'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Referensi 5
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Referensi Ke - 5'
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
                name='kd_ref6'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Referensi 6
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Referensi Ke - 6'
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
                name='nm_ref'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Sumber Dana
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Sumber Dana'
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
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Status
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih Status Sumber Dana'
                      className='col-span-4'
                      items={status.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='jenis_sumber_dana'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Jenis Sumber Dana
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih Jenis Sumber Dana'
                      className='col-span-4'
                      items={jenis.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='SumberDana-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
