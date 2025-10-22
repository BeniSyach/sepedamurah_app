import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostRefKegiatan, usePutRefKegiatan, type Kegiatan } from '@/api'
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

type KegiatanMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Kegiatan
}

const formSchema = z.object({
  kd_keg1: z.string().min(1, 'Kode Kegiatan Ke - 1 Harus Ada.'),
  kd_keg2: z.string().min(1, 'Kode Kegiatan Ke - 2 Harus Ada.'),
  kd_keg3: z.string().min(1, 'Kode Kegiatan Ke - 3 Harus Ada.'),
  kd_keg4: z.string().min(1, 'Kode Kegiatan Ke - 4 Harus Ada.'),
  kd_keg5: z.string().min(1, 'Kode Kegiatan Ke - 5 Harus Ada.'),
  nm_kegiatan: z.string().min(1, 'Nama Kegiatan Harus Ada.'),
})
type KegiatanForm = z.infer<typeof formSchema>

export function KegiatansMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: KegiatanMutateDrawerProps) {
  const isUpdate = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefKegiatanAsync } = usePostRefKegiatan()
  const { mutateAsync: putRefKegiatanAsync } = usePutRefKegiatan()

  const form = useForm<KegiatanForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_keg1: '',
      kd_keg2: '',
      kd_keg3: '',
      kd_keg4: '',
      kd_keg5: '',
      nm_kegiatan: '',
    },
  })

  const onSubmit = async (data: KegiatanForm) => {
    const requestPromise = isUpdate
      ? putRefKegiatanAsync(data)
      : postRefKegiatanAsync(data)

    await toast.promise(requestPromise, {
      loading: isUpdate ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isUpdate
          ? 'Data Kegiatan berhasil diperbarui!'
          : 'Data Kegiatan berhasil ditambahkan!'
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
            {isUpdate ? 'Perbarui' : 'Tambah'} Referensi Kegiatan
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Perbarui data Kegiatan dengan mengisi informasi yang diperlukan.'
              : 'Tambahkan data Kegiatan baru dengan mengisi informasi yang diperlukan.'}
            Klik simpan jika sudah selesai.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='ref-kegiatan-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='kd_keg1'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Kegiatan ke - 1</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Kegiatan ke - 1'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_keg2'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Kegiatan ke - 2</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Kegiatan ke - 2'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_keg3'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Kegiatan ke - 3</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Kegiatan ke - 3'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_keg4'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Kegiatan ke - 4</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Kegiatan ke - 4'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='kd_keg5'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Kegiatan ke - 5</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Ketik Kode Kegiatan ke - 5'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nm_kegiatan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kegiatan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ketik Nama Kegiatan' />
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
          <Button form='ref-kegiatan-form' type='submit'>
            Simpan Perubahan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
