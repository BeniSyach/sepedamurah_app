'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostRefPersetujuan,
  usePutRefuseGetRefPersetujuan,
  type Persetujuan,
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
  id: z.string().optional(),
  konten: z.string().min(1, 'Konten Harus Ada.'),
})
type PersetujuanForm = z.infer<typeof formSchema>

type PersetujuanActionDialogProps = {
  currentRow?: Persetujuan
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PersetujuansActionDialog({
  currentRow,
  open,
  onOpenChange,
}: PersetujuanActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefPersetujuanAsync } = usePostRefPersetujuan()
  const { mutateAsync: putRefPersetujuanAsync } =
    usePutRefuseGetRefPersetujuan()

  const form = useForm<PersetujuanForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      id: '',
      konten: '',
    },
  })

  const onSubmit = async (data: PersetujuanForm) => {
    const requestPromise = isEdit
      ? putRefPersetujuanAsync(data)
      : postRefPersetujuanAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Persetujuan berhasil diperbarui!'
          : 'Data Persetujuan berhasil ditambahkan!'
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
            {isEdit ? 'Edit Persetujuan' : 'Tambah Persetujuan'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Persetujuan disini. '
              : 'Tambah baru Persetujuan disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='Persetujuan-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='konten'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Konten
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Konten Anda'
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
          <Button type='submit' form='Persetujuan-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
