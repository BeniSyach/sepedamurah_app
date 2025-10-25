'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostBerkasLain, usePutBerkasLain, type BerkasLain } from '@/api'
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
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/date-picker'

const formSchema = z.object({
  id: z.string().optional(),
  tgl_surat: z.date('tanggal surat Harus Ada.'),
  nama_file_asli: z.string().min(1, 'File Harus Ada.'),
  nama_dokumen: z.string().min(1, 'nama dokumen Harus Ada.'),
  users_id: z.string().min(1, 'User Harus Ada.'),
})
type BerkasLainForm = z.infer<typeof formSchema>

type BerkasLainActionDialogProps = {
  currentRow?: BerkasLain
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: BerkasLainActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: postBerkasLainAsync } = usePostBerkasLain()
  const { mutateAsync: putBerkasLainAsync } = usePutBerkasLain()

  const form = useForm<BerkasLainForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      id: '',
      nama_dokumen: '',
      nama_file_asli: '',
      users_id: '',
      tgl_surat: new Date(),
    },
  })

  const fileRef = form.register('nama_file_asli')

  const onSubmit = async (data: BerkasLainForm) => {
    const requestPromise = isEdit
      ? putBerkasLainAsync(data)
      : postBerkasLainAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Berkas lain berhasil diperbarui!'
          : 'Data Berkas lain berhasil ditambahkan!'
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
            {isEdit ? 'Edit Berkas Lain' : 'Tambah Baru Berkas Lain'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Berkas Lain disini. '
              : 'Tambah baru Berkas Lain disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='laporan-fungsional-pengeluaran'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='tgl_surat'
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
                name='nama_dokumen'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Berkas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nama Berkas'
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
                name='nama_file_asli'
                render={() => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                    {/* Label di sisi kiri */}
                    <FormLabel className='col-span-2 text-end'>
                      Upload File
                    </FormLabel>

                    {/* Input file */}
                    <div className='col-span-4 flex flex-col'>
                      <FormControl>
                        <Input
                          type='file'
                          {...fileRef}
                          className='file:bg-primary hover:file:bg-primary/90 h-9 px-3 py-1 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1 file:text-gray-500'
                        />
                      </FormControl>

                      {/* Pesan error di bawah input */}
                      <FormMessage className='mt-1 text-xs text-red-500' />
                    </div>
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
