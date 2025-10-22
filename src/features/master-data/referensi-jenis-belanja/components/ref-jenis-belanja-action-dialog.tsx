'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostRefJenisBelanja,
  usePutRefJenisBelanja,
  type JenisBelanja,
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

const formSchema = z.object({
  kd_ref1: z.string().min(1, 'Kode Referensi Ke - 1 Harus Ada.'),
  kd_ref2: z.string().min(1, 'Kode Referensi Ke - 2 Harus Ada.'),
  kd_ref3: z.string().min(1, 'Kode Referensi Ke - 3 Harus Ada.'),
  nm_belanja: z.string().min(1, 'Nama Jenis Belanja Harus Ada.'),
})
type JenisBelanjaForm = z.infer<typeof formSchema>

type JenisBelanjaActionDialogProps = {
  currentRow?: JenisBelanja
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JenisBelanjasActionDialog({
  currentRow,
  open,
  onOpenChange,
}: JenisBelanjaActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefJenisBelanjaAsync } = usePostRefJenisBelanja()
  const { mutateAsync: putRefJenisBelanjaAsync } = usePutRefJenisBelanja()

  const form = useForm<JenisBelanjaForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_ref1: '',
      kd_ref2: '',
      kd_ref3: '',
      nm_belanja: '',
    },
  })

  const onSubmit = async (data: JenisBelanjaForm) => {
    const requestPromise = isEdit
      ? putRefJenisBelanjaAsync(data)
      : postRefJenisBelanjaAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Jenis Belanja berhasil diperbarui!'
          : 'Data Jenis Belanja berhasil ditambahkan!'
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
            {isEdit ? 'Edit Jenis Belanja' : 'Tambah Jenis Belanja'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Jenis Belanja disini. '
              : 'Tambah baru Jenis Belanja disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='JenisBelanja-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kd_ref1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Jenis Belanja 1
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Jenis Belanja Ke - 1'
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
                      Kode Jenis Belanja 2
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Jenis Belanja Ke - 2'
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
                      Kode Jenis Belanja 3
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Jenis Belanja Ke - 3'
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
                name='nm_belanja'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Belanja
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Nama Belanja'
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
          <Button type='submit' form='JenisBelanja-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
