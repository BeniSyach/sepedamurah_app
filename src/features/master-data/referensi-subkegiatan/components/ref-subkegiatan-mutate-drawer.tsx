import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostRefSubKegiatan,
  usePutRefSubKegiatan,
  type SubKegiatan,
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

type SubKegiatanMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: SubKegiatan
}

const formSchema = z.object({
  kd_subkeg1: z.string().min(1, 'Kode Sub Kegiatan Ke - 1 Harus Ada.'),
  kd_subkeg2: z.string().min(1, 'Kode Sub Kegiatan Ke - 2 Harus Ada.'),
  kd_subkeg3: z.string().min(1, 'Kode Sub Kegiatan Ke - 3 Harus Ada.'),
  kd_subkeg4: z.string().min(1, 'Kode Sub Kegiatan Ke - 4 Harus Ada.'),
  kd_subkeg5: z.string().min(1, 'Kode Sub Kegiatan Ke - 5 Harus Ada.'),
  kd_subkeg6: z.string().min(1, 'Kode Sub Kegiatan Ke - 6 Harus Ada.'),
  nm_subkegiatan: z.string().min(1, 'Sub Kegiatan Harus Ada.'),
})
type SubKegiatanForm = z.infer<typeof formSchema>

export function SubKegiatansMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: SubKegiatanMutateDrawerProps) {
  const isUpdate = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefSubKegiatanAsync } = usePostRefSubKegiatan()
  const { mutateAsync: putRefSubKegiatanAsync } = usePutRefSubKegiatan()

  const form = useForm<SubKegiatanForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_subkeg1: '',
      kd_subkeg2: '',
      kd_subkeg3: '',
      kd_subkeg4: '',
      kd_subkeg5: '',
      kd_subkeg6: '',
      nm_subkegiatan: '',
    },
  })

  const onSubmit = async (data: SubKegiatanForm) => {
    const requestPromise = isUpdate
      ? putRefSubKegiatanAsync(data)
      : postRefSubKegiatanAsync(data)

    await toast.promise(requestPromise, {
      loading: isUpdate ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isUpdate
          ? 'Data Sub Kegiatan berhasil diperbarui!'
          : 'Data Sub Kegiatan berhasil ditambahkan!'
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
            {' '}
            {isUpdate ? 'Perbarui' : 'Tambah'} Referensi Sub Kegiatan
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Perbarui data Sub Kegiatan dengan mengisi informasi yang diperlukan.'
              : 'Tambahkan data Sub Kegiatan baru dengan mengisi informasi yang diperlukan.'}
            Klik simpan jika sudah selesai.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='ref-sub-kegiatan-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='kd_subkeg1'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Sub Kegiatan ke - 1</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Sub Kegiatan ke - 1'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_subkeg2'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Sub Kegiatan ke - 2</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Sub Kegiatan ke - 2'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_subkeg3'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Sub Kegiatan ke - 3</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Sub Kegiatan ke - 3'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_subkeg4'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Sub Kegiatan ke - 4</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Sub Kegiatan ke - 4'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_subkeg5'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Sub Kegiatan ke - 5</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Sub Kegiatan ke - 5'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_subkeg6'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Sub Kegiatan ke - 6</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Sub Kegiatan ke - 6'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nm_subkegiatan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Sub Kegiatan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Sub Kegiatan' />
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
          <Button form='ref-sub-kegiatan-form' type='submit'>
            Simpan Perubahan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
