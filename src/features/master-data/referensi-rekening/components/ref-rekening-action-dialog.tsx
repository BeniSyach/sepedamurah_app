'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostRefRekening, usePutRefRekening, type Rekening } from '@/api'
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
  kd_rekening1: z.string().min(1, 'Kode Rekening Ke - 1 Harus Ada.'),
  kd_rekening2: z.string().min(1, 'Kode Rekening Ke - 2 Harus Ada.'),
  kd_rekening3: z.string().min(1, 'Kode Rekening Ke - 3 Harus Ada.'),
  kd_rekening4: z.string().min(1, 'Kode Rekening Ke - 4 Harus Ada.'),
  kd_rekening5: z.string().min(1, 'Kode Rekening Ke - 5 Harus Ada.'),
  kd_rekening6: z.string().min(1, 'Kode Rekening Ke - 6 Harus Ada.'),
  nm_rekening: z.string().min(1, 'Nama Rekening Harus Ada.'),
})
type RekeningForm = z.infer<typeof formSchema>

type RekeningActionDialogProps = {
  currentRow?: Rekening
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RekeningsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: RekeningActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefRekeningAsync } = usePostRefRekening()
  const { mutateAsync: putRefRekeningAsync } = usePutRefRekening()

  const form = useForm<RekeningForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_rekening1: '',
      kd_rekening2: '',
      kd_rekening3: '',
      kd_rekening4: '',
      kd_rekening5: '',
      kd_rekening6: '',
      nm_rekening: '',
    },
  })

  const onSubmit = async (data: RekeningForm) => {
    const requestPromise = isEdit
      ? putRefRekeningAsync(data)
      : postRefRekeningAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Rekening berhasil diperbarui!'
          : 'Data Rekening berhasil ditambahkan!'
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
            {isEdit ? 'Edit Rekening' : 'Tambah baru Rekening'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui data Rekening di sini. '
              : 'Buat Rekening baru di sini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='Rekening-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kd_rekening1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Rekening 1
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Rekening ke - 1'
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
                name='kd_rekening2'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Rekening 2
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Rekening ke - 2'
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
                name='kd_rekening3'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Rekening 3
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Rekening ke - 3'
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
                name='kd_rekening4'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Rekening 4
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Rekening ke - 4'
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
                name='kd_rekening5'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Rekening 5
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Rekening ke - 5'
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
                name='kd_rekening6'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode Rekening 6
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode Rekening ke - 6'
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
                name='nm_rekening'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Rekening
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Nama Rekening'
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
          <Button type='submit' form='Rekening-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
