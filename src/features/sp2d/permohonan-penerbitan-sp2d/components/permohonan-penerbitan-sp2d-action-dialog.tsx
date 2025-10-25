'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CeklisKelengkapanDokumen,
  useGetRefCeklisSPM,
  usePostPermohonanSp2d,
  usePutPermohonanSp2d,
  type Sp2dItem,
  useGetRefSumberDana,
  type SumberDana,
  useGetRefJenisSPM,
} from '@/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContentLarge,
  DialogFooter,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  id: z.string().optional(),
  no_spm: z.string().min(1, 'Nomor SPM Harus Ada.'),
  jenis_berkas: z.string().min(1, 'Jenis Berkas Harus Ada.'),
  id_berkas: z.array(z.string().min(1)).nonempty('Ceklis Dokumen Harus Ada.'),
  kode_urusan: z.string().min(1, 'Kode Urusan Harus Ada.'),
  kode_bidang_urusan: z.string().min(1, 'Kode Bidang Urusan Harus Ada.'),
  kode_program: z.string().min(1, 'Kode Program Harus Ada.'),
  kode_kegiatan: z.string().min(1, 'Kode Kegiatan Harus Ada.'),
  kode_subkegiatan: z.string().min(1, 'Kode Sub Kegiatan Harus Ada.'),
  kode_rekening: z.string().min(1, 'Kode rekening Harus Ada.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
  sumber_dana1: z.string().min(1, 'Sumber Dana Harus Ada.'),
  nilai_belanja: z.string().min(1, 'Nilai Belanja Harus Ada.'),
  nama_file: z.string().min(1, 'Uraian SPM Harus Ada.'),
  nama_file_asli: z.string().min(1, 'File Harus Ada.'),
  id_user: z.string().min(1, 'Pengirim Harus Ada.'),
  nama_user: z.string().min(1, 'Pengirim Harus Ada.'),
  agreement: z.string().min(1, 'Pengirim Harus Ada.'),
  kd_belanja1: z.string().nullable().optional(),
  kd_belanja2: z.string().nullable().optional(),
  kd_belanja3: z.string().nullable().optional(),
  jenis_belanja: z.string().nullable().optional(),
})
type PermohonanSP2DForm = z.infer<typeof formSchema>

type PermohonanSP2DActionDialogProps = {
  currentRow?: Sp2dItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: PermohonanSP2DActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: postPermohonanSP2DAsync } = usePostPermohonanSp2d()
  const { mutateAsync: putPermohonanSP2DAsync } = usePutPermohonanSp2d()

  // jenis_bekas
  const { data, isLoading, isError } = useGetRefCeklisSPM({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // sumber Dana
  const {
    data: dataSD,
    isLoading: pendingSD,
    isError: errorSD,
  } = useGetRefSumberDana({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // Ambil data dari response
  const itemsSD =
    dataSD?.data?.map((item: SumberDana) => ({
      // Gabungkan kd_opd1...5 menjadi satu string
      value: [
        item.kd_ref1,
        item.kd_ref2,
        item.kd_ref3,
        item.kd_ref4,
        item.kd_ref5,
        item.kd_ref6,
      ]
        .filter(Boolean) // hilangkan undefined/null jika ada
        .join('-'), // hasil: "00-01-01-02-03"

      label: item.nm_ref ?? '',
    })) ?? []

  // Kalau error, bisa fallback ke array kosong
  const safeItems = isError ? [] : itemsSD

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow, // ambil semua field dari data yang sedang diedit
          id_berkas: Array.isArray(currentRow.id_berkas)
            ? currentRow.id_berkas
            : currentRow.id_berkas
              ? [currentRow.id_berkas]
              : [],
        }
      : {
          id: '',
          no_spm: '',
          jenis_berkas: '',
          id_berkas: [],
          kode_urusan: '',
          kode_bidang_urusan: '',
          kode_program: '',
          kode_kegiatan: '',
          kode_subkegiatan: '',
          kode_rekening: '',
          kd_opd1: '',
          kd_opd2: '',
          kd_opd3: '',
          kd_opd4: '',
          kd_opd5: '',
          sumber_dana1: '',
          nilai_belanja: '',
          nama_file: '',
          nama_file_asli: '',
          id_user: '',
          nama_user: '',
          agreement: '',
          kd_belanja1: '',
          kd_belanja2: '',
          kd_belanja3: '',
          jenis_belanja: '',
        },
  })

  const jenisBerkasValue = form.watch('jenis_berkas')
  // ceklis Berkas SPM
  const { data: dataJenisSPM, isLoading: pendingJenisSPM } = useGetRefJenisSPM({
    page: 1,
    perPage: 100,
    search: jenisBerkasValue || '',
  })

  const ceklisList = dataJenisSPM?.data || []

  const fileRef = form.register('nama_file_asli')

  const onSubmit = async (data: PermohonanSP2DForm) => {
    const requestPromise = isEdit
      ? putPermohonanSP2DAsync(data)
      : postPermohonanSP2DAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Permohonan SP2D berhasil diperbarui!'
          : 'Data Permohonan SP2D berhasil ditambahkan!'
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
      <DialogContentLarge
        title='Tambah Dokumen'
        description='Isi semua kolom di bawah ini untuk Membuat SP2D'
      >
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='sp2d-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='no_spm'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      No SPM
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='No SPM'
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
                name='jenis_berkas'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-start gap-x-4 gap-y-2'>
                    <FormLabel className='col-span-2 pt-2 text-end'>
                      Jenis SPM
                    </FormLabel>

                    <FormControl className='col-span-4'>
                      {isLoading ? (
                        <p className='text-muted-foreground text-sm'>
                          Memuat data...
                        </p>
                      ) : isError ? (
                        <p className='text-destructive text-sm'>
                          Gagal memuat data
                        </p>
                      ) : (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className='flex flex-row gap-2'
                        >
                          {data?.data?.map((item: CeklisKelengkapanDokumen) => (
                            <label
                              key={item.id}
                              className='flex items-center gap-2 text-sm'
                            >
                              <RadioGroupItem
                                value={item.kategori}
                                id={`jenis-${item.id}`}
                              />
                              <span>{item.kategori}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      )}
                    </FormControl>

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* === LIST CEKLIS BERKAS === */}
              {/* === LIST CEKLIS BERKAS === */}
              {jenisBerkasValue && (
                <FormField
                  control={form.control}
                  name='id_berkas'
                  render={() => (
                    <FormItem className='mt-4 grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                      {/* Label kolom kiri */}
                      <FormLabel className='col-span-2 pt-2 text-end'>
                        Daftar Berkas
                      </FormLabel>

                      {/* Isi kolom kanan */}
                      <div className='col-span-4'>
                        {pendingJenisSPM ? (
                          <p className='text-muted-foreground text-sm'>
                            Memuat daftar berkas...
                          </p>
                        ) : ceklisList.length === 0 ? (
                          <p className='text-muted-foreground text-sm'>
                            Tidak ada berkas untuk jenis ini.
                          </p>
                        ) : (
                          <div className='grid grid-cols-2 gap-2'>
                            {ceklisList.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name='id_berkas'
                                render={({ field }) => {
                                  const value = field.value || []
                                  return (
                                    <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                                      <FormControl>
                                        <Checkbox
                                          checked={value.includes(
                                            String(item.id)
                                          )}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              field.onChange([
                                                ...value,
                                                String(item.id),
                                              ])
                                            } else {
                                              field.onChange(
                                                value.filter(
                                                  (v) => v !== String(item.id)
                                                )
                                              )
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className='text-sm font-normal'>
                                        {item.nama_berkas}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Error message sejajar dengan kolom kanan */}
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='sumber_dana1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih Operator
                    </FormLabel>

                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih Sumber Dana'
                      className='col-span-4 w-full'
                      isPending={pendingSD}
                      items={safeItems}
                      disabled={errorSD}
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nilai_belanja'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nilai Belanja
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nilai belanja'
                        className='col-span-4'
                        {...field}
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
                      Keterangan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Keterangan'
                        className='col-span-4'
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='sp2d-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContentLarge>
    </Dialog>
  )
}
