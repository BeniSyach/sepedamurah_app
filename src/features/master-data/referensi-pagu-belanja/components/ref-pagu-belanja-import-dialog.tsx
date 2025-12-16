import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useImportPaguBelanjaExcel } from '@/api/master-data/ref-pagu-belanja/use-import-pagu-belanja-excel'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
  file: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, {
      message: 'File wajib diupload',
    })
    .refine(
      (files) =>
        [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ].includes(files[0]?.type),
      {
        message: 'Format file harus .xlsx atau .xls',
      }
    ),
})

type TaskImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({
  open,
  onOpenChange,
}: TaskImportDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutateAsync: importExcel, isPending } = useImportPaguBelanjaExcel()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const file = values.file[0]

    const requestPromise = new Promise((resolve, reject) => {
      importExcel(
        { file },
        {
          onSuccess: (data) => resolve(data),
          onError: (err) => reject(err),
        }
      )
    })

    await toast.promise(requestPromise, {
      loading: 'Mengimpor data Pagu Belanja...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return 'Import Pagu Belanja berhasil!'
      },
      error: (err) => {
        return (
          err?.response?.data?.message || 'Terjadi kesalahan saat import data.'
        )
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>Import Pagu Belanja</DialogTitle>
          <DialogDescription>
            Import Pagu Belanja dari file Excel (.xlsx / .xls)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='pagu-belanja-import-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-3'
          >
            <FormField
              control={form.control}
              name='file'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Excel</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.xlsx,.xls'
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline' disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button
            type='submit'
            form='pagu-belanja-import-form'
            disabled={isPending}
          >
            {isPending ? 'Mengimpor...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
