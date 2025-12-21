'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostRefAssetBendahara,
  usePutRefAssetBendahara,
  type RefAssetBendahara,
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
  nm_asset_bendahara: z.string().min(1, 'Nama Asset Bendahara Harus Ada.'),
})
type DPAForm = z.infer<typeof formSchema>

type DPAActionDialogProps = {
  currentRow?: RefAssetBendahara
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
  const { mutateAsync: post } = usePostRefAssetBendahara()
  const { mutateAsync: put } = usePutRefAssetBendahara()

  const form = useForm<DPAForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? { ...currentRow, id: currentRow.id.toString() }
      : { id: '', nm_asset_bendahara: '' },
  })

  const onSubmit = async (data: DPAForm) => {
    const requestPromise = isEdit ? put(data) : post(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Asset Bendahara berhasil diperbarui!'
          : 'Data Asset Bendahara berhasil ditambahkan!'
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
            {isEdit ? 'Edit Asset Bendahara' : 'Add New Asset Bendahara'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Asset Bendahara disini. '
              : 'Tambah baru Asset Bendahara disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='Asset-bendahara-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              {/* 🔹 Field: Kategori SPM */}
              <FormField
                control={form.control}
                name='nm_asset_bendahara'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Asset Bendahara
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Nama Asset Bendahara'
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
          <Button type='submit' form='Asset-bendahara-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
