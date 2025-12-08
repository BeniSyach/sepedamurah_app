'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostRefDPA, usePutRefDPA, type RefDpa } from '@/api'
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
  nm_dpa: z.string().min(1, 'Nama DPA Harus Ada.'),
})
type DPAForm = z.infer<typeof formSchema>

type DPAActionDialogProps = {
  currentRow?: RefDpa
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DPAsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: DPAActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: post } = usePostRefDPA()
  const { mutateAsync: put } = usePutRefDPA()

  const form = useForm<DPAForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? { ...currentRow, id: currentRow.id.toString() }
      : { id: '', nm_dpa: '' },
  })

  const onSubmit = async (data: DPAForm) => {
    const requestPromise = isEdit ? put(data) : post(data)

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
              id='DPA-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              {/* 🔹 Field: Kategori SPM */}
              <FormField
                control={form.control}
                name='nm_dpa'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Dokumen Pelaksaan Anggaran
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Nama Dokumen Pelaksaan Anggaran'
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
          <Button type='submit' form='DPA-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
