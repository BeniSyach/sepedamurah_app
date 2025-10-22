import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostRefProgram, usePutRefProgram, type Program } from '@/api'
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
  currentRow?: Program
}

const formSchema = z.object({
  kd_prog1: z.string().min(1, 'Kode Program Ke - 1 Harus Ada.'),
  kd_prog2: z.string().min(1, 'Kode Program Ke - 2 Harus Ada.'),
  kd_prog3: z.string().min(1, 'Kode Program Ke - 3 Harus Ada.'),
  nm_program: z.string().min(1, 'Nama Program Harus Ada.'),
})
type TaskForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const isUpdate = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefProgramAsync } = usePostRefProgram()
  const { mutateAsync: putRefProgramAsync } = usePutRefProgram()

  const form = useForm<TaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_prog1: '',
      kd_prog2: '',
      kd_prog3: '',
      nm_program: '',
    },
  })

  const onSubmit = async (data: TaskForm) => {
    const requestPromise = isUpdate
      ? putRefProgramAsync(data)
      : postRefProgramAsync(data)

    await toast.promise(requestPromise, {
      loading: isUpdate ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isUpdate
          ? 'Data Program berhasil diperbarui!'
          : 'Data Program berhasil ditambahkan!'
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
            {isUpdate ? 'Perbarui' : 'Tambah'} Referensi Program
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Perbarui data Program dengan mengisi informasi yang diperlukan.'
              : 'Tambahkan data Program baru dengan mengisi informasi yang diperlukan.'}
            Klik simpan jika sudah selesai.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='ref-program-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='kd_prog1'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Program ke - 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Kode Program ke - 1' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_prog2'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Program ke - 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Kode Program ke - 2' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_prog3'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Program ke - 3</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Kode Program ke - 3' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nm_program'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Program</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Nama Program' />
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
          <Button form='ref-program-form' type='submit'>
            Simpan Perubahan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
