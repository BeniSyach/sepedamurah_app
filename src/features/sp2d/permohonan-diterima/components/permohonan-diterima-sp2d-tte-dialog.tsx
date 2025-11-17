/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type Sp2dItem,
  useGetRefSKPD,
  type MasterSkpd,
  usePostSp2dKirim,
  useGetAksesKuasaBUD,
  type AksesKuasaBud,
} from '@/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/date-picker'
import { SelectDropdown } from '@/components/select-dropdown'

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

const formSchema = z.object({
  id: z.string().optional(),
  keterangan: z.string().min(1),
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
  tanggal_upload: z.date('tanggal Rekam Harus Ada.'),
  skpd: z.string().min(1, 'SKPD wajib dipilih.'),
  kuasa_bud: z.string().min(1, 'Kuasa BUD wajib dipilih.'),
  no_sp2d: z.string().min(1, 'No SP2D wajib di isi.'),
  id_berkas: z.string().min(1, 'Berkas wajib di isi.'),
  id_penerima: z.string().min(1, 'Penerima wajib di isi.'),
  nama_penerima: z.string().min(1, 'Penerima wajib di isi.'),
  id_operator: z.string().min(1, 'operator wajib di isi.'),
  nama_operator: z.string().min(1, 'operator wajib di isi.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
  id_penandatangan: z.string().min(1, 'Penandatangan Harus Ada.'),
})

type FormValues = z.infer<typeof formSchema>

export function PermohonanDiterimaKirimTTEDialog({
  currentRow,
  open,
  onOpenChange,
}: {
  currentRow?: Sp2dItem
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const user = useAuthStore((s) => s.user)
  const { mutateAsync: post } = usePostSp2dKirim()

  const { data: dataSKPD } = useGetRefSKPD({
    page: 1,
    perPage: 100,
  })

  const itemsSKPD =
    dataSKPD?.data?.map((item: MasterSkpd) => ({
      value: [
        item.kd_opd1,
        item.kd_opd2,
        item.kd_opd3,
        item.kd_opd4,
        item.kd_opd5,
      ]
        .filter(Boolean)
        .join('.'),
      label: item.nm_opd ?? '0',
    })) ?? []

  const { data: dataKuasaBUD } = useGetAksesKuasaBUD({
    page: 1,
    perPage: 100,
  })

  const itemsKuasaBUD =
    dataKuasaBUD?.data?.map((item: AksesKuasaBud) => ({
      id_user: item.user?.id.toString() ?? '',
      name: item.user?.name ?? '-',
      value: [
        item.kd_opd1,
        item.kd_opd2,
        item.kd_opd3,
        item.kd_opd4,
        item.kd_opd5,
      ]
        .filter(Boolean)
        .join('.'),
      label: item.user.name ?? '0',
    })) ?? []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: currentRow?.id_sp2d ?? '',
      keterangan: currentRow?.nama_file ?? '',
      nama_file_asli: undefined,
      skpd: [
        currentRow?.kd_opd1,
        currentRow?.kd_opd2,
        currentRow?.kd_opd3,
        currentRow?.kd_opd4,
        currentRow?.kd_opd5,
      ]
        .filter(Boolean)
        .join('.'),
      tanggal_upload: currentRow?.tanggal_upload
        ? new Date(currentRow.tanggal_upload)
        : new Date(),
      kuasa_bud: [
        currentRow?.kd_opd1,
        currentRow?.kd_opd2,
        currentRow?.kd_opd3,
        currentRow?.kd_opd4,
        currentRow?.kd_opd5,
      ]
        .filter(Boolean)
        .join('.'),
      no_sp2d: '',
      id_berkas: currentRow?.id_sp2d,
      id_penerima: currentRow?.id_user,
      nama_penerima: currentRow?.nama_user,
      id_operator: user?.id.toString() ?? '',
      nama_operator: user?.name,
      kd_opd1: currentRow?.kd_opd1,
      kd_opd2: currentRow?.kd_opd2,
      kd_opd3: currentRow?.kd_opd3,
      kd_opd4: currentRow?.kd_opd4,
      kd_opd5: currentRow?.kd_opd5,
      id_penandatangan: '',
    },
  })

  const fileRef = form.register('nama_file_asli')

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData()
    formData.append(
      'tahun',
      data.tanggal_upload
        ? new Date(data.tanggal_upload).getFullYear().toString()
        : ''
    )
    if (data.tanggal_upload) {
      const d = new Date(data.tanggal_upload)
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
      formData.append('tanggal_upload', formatted)
    } else {
      const now = new Date()
      const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      formData.append('tanggal_upload', formattedNow)
    }
    formData.append('id_berkas', data.id_berkas ?? '')
    formData.append('id_penerima', data.id_penerima ?? '')
    formData.append('nama_penerima', data.nama_penerima ?? '')
    formData.append('id_operator', data.id_operator ?? '')
    formData.append('nama_operator', data.nama_operator ?? '')
    formData.append('kd_opd1', data.kd_opd1 ?? '')
    formData.append('kd_opd2', data.kd_opd2 ?? '')
    formData.append('kd_opd3', data.kd_opd3 ?? '')
    formData.append('kd_opd4', data.kd_opd4 ?? '')
    formData.append('kd_opd5', data.kd_opd5 ?? '')
    formData.append('namafile', data.no_sp2d ?? '')
    formData.append('keterangan', data.keterangan ?? '')
    formData.append('id_penandatangan', data.id_operator ?? '')
    formData.append('status', '0')

    // ✅ Jika user upload file baru
    if (
      data.nama_file_asli instanceof FileList &&
      data.nama_file_asli.length > 0
    ) {
      formData.append('nama_file_asli', data.nama_file_asli[0])
    }

    // Kirim ke backend
    await toast.promise(post(formData), {
      loading: 'Menyimpan perubahan...',
      success: () => {
        onOpenChange(false) // tutup modal
        form.reset()
        return 'Data Permohonan SP2D berhasil ditambahkan!'
      },
      error: (err) => {
        const message =
          err?.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan data.'
        return message
      },
    })
  }

  useEffect(() => {
    const currentValue = [
      currentRow?.kd_opd1,
      currentRow?.kd_opd2,
      currentRow?.kd_opd3,
      currentRow?.kd_opd4,
      currentRow?.kd_opd5,
    ]
      .filter(Boolean)
      .join('.')

    const selected = itemsKuasaBUD.find((x) => x.value === currentValue)

    if (selected) {
      form.setValue('id_penandatangan', selected.id_user)
      form.setValue('kuasa_bud', currentValue)
    }
  }, [itemsKuasaBUD, currentRow, form])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContentLarge
        title='Form Permohonan SP2D'
        description='Lengkapi data di bawah ini.'
      >
        <div className='flex h-full flex-col'>
          <div className='flex flex-1 gap-4 overflow-hidden'>
            <div className='flex-1 overflow-y-auto border-r p-4'>
              <Form {...form}>
                <form
                  id='berkas-masuk-kirim-sp2d-form'
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4 px-0.5'
                >
                  <FormField
                    control={form.control}
                    name='tanggal_upload'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Tanggal SP2D
                        </FormLabel>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='skpd'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          SKPD
                        </FormLabel>
                        <div className='col-span-4'>
                          <SelectDropdown
                            defaultValue={String(field.value ?? '')}
                            onValueChange={(val) => field.onChange(val)}
                            placeholder='Pilih SKPD'
                            className='w-full break-words whitespace-normal'
                            items={itemsSKPD.map(({ label, value }) => ({
                              label,
                              value,
                            }))}
                            disabled
                          />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='kuasa_bud'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Kuasa BUD
                        </FormLabel>
                        <div className='col-span-4'>
                          <SelectDropdown
                            defaultValue={String(field.value ?? '')}
                            onValueChange={(val) => {
                              field.onChange(val)

                              const selected = itemsKuasaBUD.find(
                                (x) => x.value === val
                              )

                              if (selected) {
                                form.setValue(
                                  'id_penandatangan',
                                  selected.id_user
                                )
                              } else {
                                form.setValue('id_penandatangan', '')
                              }
                            }}
                            placeholder='Pilih Kuasa BUD'
                            className='w-full break-words whitespace-normal'
                            items={itemsKuasaBUD.map(({ label, value }) => ({
                              label,
                              value,
                            }))}
                            disabled
                          />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='keterangan'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Uraian SPM
                        </FormLabel>
                        <div className='col-span-4 flex flex-col'>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder='Uraian SPM'
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='no_sp2d'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          No SP2D
                        </FormLabel>
                        <div className='col-span-4 flex flex-col'>
                          <FormControl>
                            <Input {...field} placeholder='No SP2D' />
                          </FormControl>
                          <FormMessage />
                        </div>
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
          </div>
        </div>

        <DialogFooter>
          <Button type='submit' form='berkas-masuk-kirim-sp2d-form'>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContentLarge>
    </Dialog>
  )
}
