'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type MasterSkpd,
  useGetRefSKPD,
  usePostSpdTerkirim,
  usePutSpdTerkirim,
  type SpdTerkirim,
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
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  id: z.string().optional(),
  nama_file: z.string().min(1, 'Permohonan SPD Harus Ada.'),
  nama_file_asli: z.string().min(1, 'File Harus Ada.'),
  id_operator: z.string().min(1, 'operator Harus Ada.'),
  nama_operator: z.string().min(1, 'operator Harus Ada.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
  id_penerima: z.string().min(1, 'Penerima SPD Harus Ada.'),
  nama_penerima: z.string().min(1, 'Penerima SPD Harus Ada.'),
  keterangan: z.string().min(1, 'Keterangan SPD Harus Ada.'),
})
type SpdTerkirimForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: SpdTerkirim
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: postSPDTerkirimAsync } = usePostSpdTerkirim()
  const { mutateAsync: putSPDTerkirimAsync } = usePutSpdTerkirim()

  const {
    data: dataSKPD,
    isLoading: isLoadingSKPD,
    isError: isErrorSKPD,
  } = useGetRefSKPD({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // Ambil data dari response
  const itemsSKPD =
    dataSKPD?.data?.map((item: MasterSkpd) => ({
      // Gabungkan kd_opd1...5 menjadi satu string
      value: [
        item.kd_opd1,
        item.kd_opd2,
        item.kd_opd3,
        item.kd_opd4,
        item.kd_opd5,
      ]
        .filter(Boolean) // hilangkan undefined/null jika ada
        .join('-'), // hasil: "00-01-01-02-03"

      label: item.nm_opd ?? '',
    })) ?? []

  // Kalau error, bisa fallback ke array kosong
  const safeItemsSKPD = isErrorSKPD ? [] : itemsSKPD

  const form = useForm<SpdTerkirimForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      id: '',
      nama_file: '',
      nama_file_asli: '',
      id_operator: '',
      nama_operator: '',
      kd_opd1: '',
      kd_opd2: '',
      kd_opd3: '',
      kd_opd4: '',
      kd_opd5: '',
    },
  })
  const fileRef = form.register('nama_file_asli')

  const onSubmit = async (data: SpdTerkirimForm) => {
    const requestPromise = isEdit
      ? putSPDTerkirimAsync(data)
      : postSPDTerkirimAsync(data)

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
          <DialogTitle> {isEdit ? 'Edit SPD' : 'Tambah Baru SPD'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Perbarui SPD disini. ' : 'Tambah baru SPD disini. '}
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
                name='kd_opd1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih SKPD
                    </FormLabel>

                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        // Pisahkan string "00-01-01-02-03"
                        const parts = value.split('-')

                        // Set ke masing-masing field
                        form.setValue('kd_opd1', parts[0] ?? '')
                        form.setValue('kd_opd2', parts[1] ?? '')
                        form.setValue('kd_opd3', parts[2] ?? '')
                        form.setValue('kd_opd4', parts[3] ?? '')
                        form.setValue('kd_opd5', parts[4] ?? '')

                        // Jalankan field.onChange agar form tahu kd_opd1 juga berubah
                        field.onChange(parts[0])
                      }}
                      placeholder='Pilih SKPD'
                      className='col-span-4 w-full'
                      isPending={isLoadingSKPD}
                      items={safeItemsSKPD}
                      disabled={isErrorSKPD}
                    />

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
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nama_file_asli'
                render={() => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                    {/* Label di sisi kiri */}
                    <FormLabel className='col-span-2 text-end'>
                      Upload File
                    </FormLabel>

                    {/* Input file */}
                    <div className='col-span-4 flex flex-col'>
                      <FormControl>
                        <Input
                          type='file'
                          {...fileRef}
                          className='file:bg-primary hover:file:bg-primary/90 h-9 px-3 py-1 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1 file:text-gray-500'
                        />
                      </FormControl>

                      {/* Pesan error di bawah input */}
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
          <Button type='submit' form='user-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
