'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostSpdTerkirim, type PermohonanSpd } from '@/api'
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
import { Textarea } from '@/components/ui/textarea'

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
  id_berkas: z.string().min(1, 'berkas Harus Ada.'),
  id_operator: z.string().min(1, 'Operator Harus Ada.'),
  nama_operator: z.string().min(1, 'Operator Harus Ada.'),
  id_penerima: z.string().min(1, 'Pengirim Harus Ada.'),
  nama_penerima: z.string().min(1, 'Pengirim Harus Ada.'),
  tanggal_upload: z.string().min(1, 'Tanggal Upload Harus Ada.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
  keterangan: z.string().min(1, 'Keterangan Harus Ada.'),
})
type PermohonanSPDForm = z.infer<typeof formSchema>

type PermohonanSPDActionDialogProps = {
  currentRow?: PermohonanSpd
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermohonanDiterimaSPDTTE({
  currentRow,
  open,
  onOpenChange,
}: PermohonanSPDActionDialogProps) {
  const isEdit = !!currentRow
  const user = useAuthStore((s) => s.user)

  const { mutateAsync: postPermohonanSPDAsync } = usePostSpdTerkirim()

  const form = useForm<PermohonanSPDForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_berkas: currentRow?.id,
      nama_file: currentRow?.nama_file,
      nama_file_asli: undefined,
      id_penerima: currentRow?.id_pengirim,
      nama_penerima: currentRow?.nama_pengirim,
      id_operator: user?.id.toString(),
      nama_operator: user?.name,
      kd_opd1: currentRow?.kd_opd1,
      kd_opd2: currentRow?.kd_opd2,
      kd_opd3: currentRow?.kd_opd3,
      kd_opd4: currentRow?.kd_opd4,
      kd_opd5: currentRow?.kd_opd5,
      keterangan: '',
      tanggal_upload: currentRow?.tanggal_upload,
    },
  })

  const onSubmit = async (data: PermohonanSPDForm) => {
    const formData = new FormData()
    formData.append('id_berkas', data.id_berkas || '')
    formData.append('nama_file', data.nama_file ?? '')
    formData.append('id_operator', data.id_operator ?? '')
    formData.append('nama_operator', data.nama_operator ?? '')
    formData.append('id_penerima', data.id_penerima ?? '')
    formData.append('nama_penerima', data.nama_penerima ?? '')
    formData.append('kd_opd1', data.kd_opd1 ?? '')
    formData.append('kd_opd2', data.kd_opd2 ?? '')
    formData.append('kd_opd3', data.kd_opd3 ?? '')
    formData.append('kd_opd4', data.kd_opd4 ?? '')
    formData.append('kd_opd5', data.kd_opd5 ?? '')
    formData.append('keterangan', data.keterangan ?? '')
    formData.append('status', '0')

    // ✅ Jika user upload file baru
    if (
      data.nama_file_asli instanceof FileList &&
      data.nama_file_asli.length > 0
    ) {
      formData.append('nama_file_asli', data.nama_file_asli[0])
    }

    await toast.promise(
      (async () => {
        // 1️⃣ Kirim permohonan SPD baru
        await postPermohonanSPDAsync(formData)

        // 3️⃣ Tutup modal dan reset form
        onOpenChange(false)
        form.reset()
      })(),
      {
        loading: 'Menyimpan perubahan...',
        success: 'Data Permohonan SPD berhasil ditambahkan!',
        error: (err) => {
          const message =
            err?.response?.data?.message ||
            'Terjadi kesalahan saat menyimpan data.'
          return message
        },
      }
    )
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
            {isEdit ? 'Permohonan SPD TTE - Kuasa BUD' : ''}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Kirim SPD Ke Kuasa BUD disini. ' : ''}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='berkas-masuk-tte-SPD-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='nama_penerima'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Bendahara
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nama Bendahara'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tanggal_upload'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Tanggal Dan Waktu
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Tanggal Dan Waktu'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
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
                        autoComplete='off'
                        {...field}
                        readOnly
                        disabled
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
              <FormField
                control={form.control}
                name='keterangan'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Keterangan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Keterangan'
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
          <Button type='submit' form='berkas-masuk-tte-SPD-form'>
            Verifikasi
          </Button>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)} // 🔹 Tutup modal
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
