'use client'

import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostLaporanFungsional,
  usePutLaporanFungsional,
  type LaporanFungsional,
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
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  id: z.string().optional(),
  tahun: z.string().min(1, 'Tahun Harus Ada.'),
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
  bulan: z.string().min(1, 'bulan Harus Ada.'),
  nama_file: z.string().min(1, 'Keterangan Laporan Fungsional Harus Ada.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
  id_pengirim: z.string().min(1, 'pengirim Laporan Fungsional Harus Ada.'),
  nama_pengirim: z.string().min(1, 'pengirim Laporan Fungsional Harus Ada.'),
  jenis_berkas: z.string().min(1, 'jenis berkas Laporan Fungsional Harus Ada.'),
})
type LaporanFungsionalForm = z.infer<typeof formSchema>

type LaporanFungsionalActionDialogProps = {
  currentRow?: LaporanFungsional
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Nama-nama bulan
const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

// Ambil bulan sekarang (0 = Januari, 11 = Desember)
const currentMonthIndex = new Date().getMonth()

// Ambil tahun sekarang
const currentYear = new Date().getFullYear()
const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0')

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: LaporanFungsionalActionDialogProps) {
  const isEdit = !!currentRow
  const user = useAuthStore((s) => s.user)
  // Buat array tahun: 3 tahun ke belakang sampai 3 tahun ke depan
  const years = useMemo(() => {
    const arr = []
    for (let y = currentYear - 3; y <= currentYear + 3; y++) {
      arr.push({
        label: y.toString(),
        value: y.toString(),
      })
    }
    return arr
  }, [currentYear])

  // Buat array items untuk SelectDropdown
  const months = useMemo(
    () =>
      monthNames.map((name, index) => ({
        label: name, // tampil di UI
        value: (index + 1).toString().padStart(2, '0'), // value di form: '01', '02', ...
      })),
    []
  )

  const { mutateAsync: postlaporanFungsionalAsync } = usePostLaporanFungsional()
  const { mutateAsync: putlaporanFungsionalAsync } = usePutLaporanFungsional()

  const form = useForm<LaporanFungsionalForm>({
    resolver: zodResolver(formSchema),
    defaultValues:
      isEdit && currentRow
        ? {
            id: currentRow.id ?? '',
            nama_file_asli: currentRow.nama_file_asli,
            id_pengirim:
              currentRow.id_pengirim?.toString() ?? user?.id.toString(),
            nama_pengirim: currentRow.nama_pengirim ?? user?.name,
            kd_opd1: currentRow.kd_opd1 ?? user?.kd_opd1,
            kd_opd2: currentRow.kd_opd2 ?? user?.kd_opd2,
            kd_opd3: currentRow.kd_opd3 ?? user?.kd_opd3,
            kd_opd4: currentRow.kd_opd4 ?? user?.kd_opd4,
            kd_opd5: currentRow.kd_opd5 ?? user?.kd_opd5,
            jenis_berkas: currentRow.jenis_berkas ?? 'Penerimaan',
            tahun: currentRow.tanggal_upload
              ? new Date(currentRow.tanggal_upload).getFullYear().toString()
              : currentYear.toString(),
            bulan: currentRow.tanggal_upload
              ? String(
                  new Date(currentRow.tanggal_upload).getMonth() + 1
                ).padStart(2, '0')
              : currentMonth,
            nama_file: currentRow.nama_file ?? '',
          }
        : {
            id: '',
            nama_file_asli: undefined,
            id_pengirim: user?.id.toString(),
            nama_pengirim: user?.name,
            kd_opd1: user?.kd_opd1,
            kd_opd2: user?.kd_opd2,
            kd_opd3: user?.kd_opd3,
            kd_opd4: user?.kd_opd4,
            kd_opd5: user?.kd_opd5,
            jenis_berkas: 'Penerimaan',
            tahun: currentYear.toString(),
            bulan: currentMonth,
            nama_file: '',
          },
  })

  const fileRef = form.register('nama_file_asli')

  const onSubmit = async (data: LaporanFungsionalForm) => {
    const formData = new FormData()
    formData.append('id', data.id ?? '')
    formData.append('id_pengirim', data.id_pengirim ?? '')
    formData.append('nama_pengirim', data.nama_pengirim ?? '')
    formData.append('kd_opd1', data.kd_opd1 ?? '')
    formData.append('kd_opd2', data.kd_opd2 ?? '')
    formData.append('kd_opd3', data.kd_opd3 ?? '')
    formData.append('kd_opd4', data.kd_opd4 ?? '')
    formData.append('kd_opd5', data.kd_opd5 ?? '')
    formData.append('tahun', data.tahun ?? '')
    formData.append('nama_file', data.nama_file ?? '')
    formData.append('bulan', data.bulan ?? '')
    formData.append('jenis_berkas', data.jenis_berkas ?? '')
    // ✅ Jika user upload file baru
    if (
      data.nama_file_asli instanceof FileList &&
      data.nama_file_asli.length > 0
    ) {
      formData.append('nama_file_asli', data.nama_file_asli[0])
    }

    const requestPromise = isEdit
      ? putlaporanFungsionalAsync(formData)
      : postlaporanFungsionalAsync(formData)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Laporan Fungsional Penerimaan berhasil diperbarui!'
          : 'Data Laporan Fungsional Penerimaan berhasil ditambahkan!'
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
            {isEdit
              ? 'Edit Laporan Fungsional Penerimaan'
              : 'Tambah Baru Laporan Fungsional Penerimaan'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Laporan Fungsional Penerimaan disini. '
              : 'Tambah baru Laporan Fungsional Penerimaan disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='laporan-fungsional-Penerimaan'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='tahun'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih Tahun
                    </FormLabel>

                    <SelectDropdown
                      defaultValue={field.value} // default tahun sekarang
                      onValueChange={(value) => {
                        // Kalau value tahun, bisa langsung set ke form
                        field.onChange(value)
                      }}
                      placeholder='Pilih Tahun'
                      className='col-span-4 w-full'
                      items={years} // array tahun
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bulan'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih Bulan
                    </FormLabel>

                    <SelectDropdown
                      defaultValue={
                        field.value ||
                        (currentMonthIndex + 1).toString().padStart(2, '0')
                      } // default bulan sekarang
                      onValueChange={(value) => {
                        field.onChange(value) // value tetap angka '01', '02', ...
                      }}
                      placeholder='Pilih Bulan'
                      className='col-span-4 w-full'
                      items={months} // label = nama, value = angka
                    />

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
                name='nama_file'
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
          <Button type='submit' form='laporan-fungsional-Penerimaan'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
