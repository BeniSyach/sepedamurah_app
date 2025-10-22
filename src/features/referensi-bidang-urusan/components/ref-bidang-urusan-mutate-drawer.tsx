import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostRefBidangUrusan,
  usePutRefBidangUrusan,
  type BidangUrusan,
} from '@/api'
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
  currentRow?: BidangUrusan
}

const formSchema = z.object({
  kd_bu1: z.string().min(1, 'Kode Bidang Urusan Ke - 1 Harus Ada.'),
  kd_bu2: z.string().min(1, 'Kode Bidang Urusan Ke - 2 Harus Ada.'),
  nm_bu: z.string().min(1, 'Nama Bidang Urusan Harus Ada.'),
})
type TaskForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const isUpdate = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefBidangUrusanAsync } = usePostRefBidangUrusan()
  const { mutateAsync: putRefBidangUrusanAsync } = usePutRefBidangUrusan()

  const form = useForm<TaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_bu1: '',
      kd_bu2: '',
      nm_bu: '',
    },
  })

  const onSubmit = async (data: TaskForm) => {
    const requestPromise = isUpdate
      ? putRefBidangUrusanAsync(data)
      : postRefBidangUrusanAsync(data)

    await toast.promise(requestPromise, {
      loading: isUpdate ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isUpdate
          ? 'Data Bidang urusan berhasil diperbarui!'
          : 'Data Bidang urusan berhasil ditambahkan!'
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
            {isUpdate ? 'Perbarui' : 'Tambah'} Referensi Bidang Urusan
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Perbarui data bidang urusan dengan mengisi informasi yang diperlukan.'
              : 'Tambahkan data bidang urusan baru dengan mengisi informasi yang diperlukan.'}
            Klik simpan jika sudah selesai.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='ref-bidang-urusan-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='kd_bu1'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Bidang Urusan ke - 1</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Bidang Urusan ke - 1'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_bu2'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Bidang Urusan ke - 2</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Bidang Urusan ke - 2'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nm_bu'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Bidang Urusan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Nama Bidang Urusan' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='ref-bidang-urusan-form' type='submit'>
            Simpan Perubahan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
