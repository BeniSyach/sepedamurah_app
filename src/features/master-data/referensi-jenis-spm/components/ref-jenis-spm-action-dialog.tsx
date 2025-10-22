'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostRefCeklisSPM,
  usePutRefuseGetRefCeklisSPM,
  type CeklisKelengkapanDokumen,
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
  status: z.string().min(1, 'Status Harus Ada.'),
})
type JenisSPMForm = z.infer<typeof formSchema>

type JenisSPMActionDialogProps = {
  currentRow?: CeklisKelengkapanDokumen
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JenisSPMsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: JenisSPMActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefCeklisSPMAsync } = usePostRefCeklisSPM()
  const { mutateAsync: putRefCeklisSPMAsync } = usePutRefuseGetRefCeklisSPM()

  const form = useForm<JenisSPMForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      id: '',
      kategori: '',
      status: '',
    },
  })

  const onSubmit = async (data: JenisSPMForm) => {
    const requestPromise = isEdit
      ? putRefCeklisSPMAsync(data)
      : postRefCeklisSPMAsync(data)

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
            {isEdit ? 'Edit Jenis SPM' : 'Add New Jenis SPM'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Jenis SPM disini. '
              : 'Tambah baru Jenis SPM disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='JenisSPM-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              {/* 🔹 Field: Kategori SPM */}
              <FormField
                control={form.control}
                name='kategori'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kategori SPM
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kategori SPM'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* 🔹 Field: Status */}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Status
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih Status Jenis SPM'
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
          <Button type='submit' form='JenisSPM-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
