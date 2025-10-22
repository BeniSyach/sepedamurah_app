import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostRefUrusan, usePutRefUrusan, type Urusan } from '@/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Urusan
}

const formSchema = z.object({
  kd_urusan: z.string().min(1, 'Kode Urusan Harus Ada.'),
  nm_urusan: z.string().min(1, 'Nama Urusan Harus Ada.'),
})
type RefUrusanForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const isUpdate = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefUrusanAsync } = usePostRefUrusan()
  const { mutateAsync: putRefUrusanAsync } = usePutRefUrusan()

  const form = useForm<RefUrusanForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_urusan: '',
      nm_urusan: '',
    },
  })

  const onSubmit = async (data: RefUrusanForm) => {
    const requestPromise = isUpdate
      ? putRefUrusanAsync(data)
      : postRefUrusanAsync(data)

    await toast.promise(requestPromise, {
      loading: isUpdate ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isUpdate
          ? 'Data urusan berhasil diperbarui!'
          : 'Data urusan berhasil ditambahkan!'
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
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>
            {isUpdate ? 'Perbarui' : 'Tambah'} Referensi Urusan
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Perbarui data urusan dengan mengisi informasi yang diperlukan.'
              : 'Tambahkan data urusan baru dengan mengisi informasi yang diperlukan.'}
            Klik simpan jika sudah selesai.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='ref-urusan-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='kd_urusan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Urusan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Kode Urusan' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nm_urusan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Urusan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Nama Urusan' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Tutup</Button>
          </SheetClose>
          <Button form='ref-urusan-form' type='submit'>
            Simpan Perubahan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
