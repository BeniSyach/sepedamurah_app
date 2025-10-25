'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CeklisKelengkapanDokumen,
  useGetRefCeklisSPM,
  usePostRefJenisSPM,
  usePutRefJenisSPM,
  type JenisSpm,
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
    value: '1',
    label: 'Aktif',
  },
  {
    value: '0',
    label: 'Tidak Aktif',
  },
]

const formSchema = z.object({
  id: z.string().optional(),
  kategori: z.string().min(1, 'Kategori Harus Ada.'),
  nama_berkas: z.string().min(1, 'Nama Berkas Harus Ada.'),
  status_penerimaan: z.string().min(1, 'Status Penerimaan Harus Ada.'),
})
type CeklisSPMForm = z.infer<typeof formSchema>

type CeklisSPMActionDialogProps = {
  currentRow?: JenisSpm
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CeklisSPMsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CeklisSPMActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefJenisSPMAsync } = usePostRefJenisSPM()
  const { mutateAsync: putRefJenisSPMAsync } = usePutRefJenisSPM()

  const { data, isLoading, isError } = useGetRefCeklisSPM({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // Ambil data dari response
  const items =
    data?.data?.map((item: CeklisKelengkapanDokumen) => ({
      value: item.kategori?.toString() ?? '',
      label: item.kategori ?? '',
    })) ?? []

  // Kalau error, bisa fallback ke array kosong
  const safeItems = isError ? [] : items

  const form = useForm<CeklisSPMForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? { ...currentRow, id: String(currentRow.id) }
      : {
          kategori: '',
          nama_berkas: '',
          status_penerimaan: '',
        },
  })

  const onSubmit = async (data: CeklisSPMForm) => {
    const requestPromise = isEdit
      ? putRefJenisSPMAsync(data)
      : postRefJenisSPMAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data CeklisSPM berhasil diperbarui!'
          : 'Data CeklisSPM berhasil ditambahkan!'
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
            {isEdit ? 'Edit Ceklis SPM' : 'Tambah Ceklis SPM'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Ceklis SPM disini. '
              : 'Tambah baru Ceklis SPM disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='CeklisSPM-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kategori'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kategori
                    </FormLabel>

                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih Kategori Jenis SPM'
                      className='col-span-4 w-full'
                      isPending={isLoading}
                      items={safeItems}
                      disabled={isError}
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nama_berkas'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Berkas
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Nama Berkas'
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
                name='status_penerimaan'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Status Penerimaan
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih Status Penerimaan'
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='CeklisSPM-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
