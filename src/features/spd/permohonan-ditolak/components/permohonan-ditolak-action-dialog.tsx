'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type MasterSkpd,
  usePostPermohonanSpd,
  usePutPermohonanSpd,
  type PermohonanSpd,
} from '@/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
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
  nama_file: z.string().min(1, 'Permohonan SPD Harus Ada.'),
  nama_file_asli: z
    .any()
    .refine(
      (val) =>
        (val instanceof FileList &&
          val.length > 0 &&
          val[0].type === 'application/pdf') ||
        (typeof val === 'string' && val.trim() !== ''),
      'File harus PDF atau sudah ada file sebelumnya.'
    ),
  id_pengirim: z.string().min(1, 'Pengirim Harus Ada.'),
  nama_pengirim: z.string().min(1, 'Pengirim Harus Ada.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
})
type PermohonanSPDForm = z.infer<typeof formSchema>

type PermohonanSPDActionDialogProps = {
  currentRow?: PermohonanSpd
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermohonanSPDDitolaksActionDialog({
  currentRow,
  open,
  onOpenChange,
}: PermohonanSPDActionDialogProps) {
  const isEdit = !!currentRow
  const user = useAuthStore((s) => s.user)
  const skpd = JSON.parse(
    localStorage.getItem('user_skpd') || '{}'
  ) as MasterSkpd

  const { mutateAsync: postPermohonanSPDAsync } = usePostPermohonanSpd()
  const { mutateAsync: putPermohonanSPDAsync } = usePutPermohonanSpd()

  const form = useForm<PermohonanSPDForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      id: '',
      nama_file: '',
      nama_file_asli: undefined,
      id_pengirim: user?.id.toString(),
      nama_pengirim: user?.name,
      kd_opd1: skpd?.kd_opd1,
      kd_opd2: skpd?.kd_opd2,
      kd_opd3: skpd?.kd_opd3,
      kd_opd4: skpd?.kd_opd4,
      kd_opd5: skpd?.kd_opd5,
    },
  })

  const onSubmit = async (data: PermohonanSPDForm) => {
    const formData = new FormData()
    formData.append('id', data.id || '')
    formData.append('nama_file', data.nama_file)
    formData.append('id_pengirim', data.id_pengirim)
    formData.append('nama_pengirim', data.nama_pengirim)
    formData.append('kd_opd1', data.kd_opd1)
    formData.append('kd_opd2', data.kd_opd2)
    formData.append('kd_opd3', data.kd_opd3)
    formData.append('kd_opd4', data.kd_opd4)
    formData.append('kd_opd5', data.kd_opd5)

    // Jika user upload file baru
    if (
      data.nama_file_asli instanceof FileList &&
      data.nama_file_asli.length > 0
    ) {
      formData.append('nama_file_asli', data.nama_file_asli[0])
    }
    const requestPromise = isEdit
      ? putPermohonanSPDAsync(formData)
      : postPermohonanSPDAsync(formData)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Permohonan SPD berhasil diperbarui!'
          : 'Data Permohonan SPD berhasil ditambahkan!'
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
            {' '}
            {isEdit ? 'Edit Permohonan SPD' : 'Tambah Baru Permohonan SPD'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Permohonan SPD disini. '
              : 'Tambah baru Permohonan SPD disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='PermohonanSPD-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='nama_file'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Permohonan SPD
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Permohonan SPD'
                        className='col-span-4'
                        accept='application/pdf'
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
                name='nama_file_asli'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Upload File
                    </FormLabel>
                    <div className='col-span-4 flex flex-col'>
                      <FormControl>
                        <Input
                          type='file'
                          accept='application/pdf'
                          className='file:bg-primary hover:file:bg-primary/90 h-9 px-3 py-1 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1 file:text-gray-500'
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>

                      {/* Preview nama file */}
                      {field.value && field.value.length > 0 && (
                        <span className='mt-1 text-xs text-gray-600'>
                          {field.value[0].name}
                        </span>
                      )}

                      <FormMessage className='mt-1 text-xs text-red-500' />
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='PermohonanSPD-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
