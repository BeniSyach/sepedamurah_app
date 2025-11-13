/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CeklisKelengkapanDokumen,
  useGetRefCeklisSPM,
  usePutPermohonanSp2d,
  type Sp2dItem,
  useGetRefJenisSPM,
  useGetLaporanRealisasiSumberDana,
  type LaporanRealisasiSumberDana,
} from '@/api'
import { Check, CheckIcon, Plus, X } from 'lucide-react'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'
import { pdfjs } from 'react-pdf'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import { UrusanSection } from '../../permohonan-sp2d-tte/components/urusan-section'
import { mapRekeningToFormData } from '../../permohonan-sp2d-tte/data/mapRekeningToFormData'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

// ============================
// 🧾 VALIDATION SCHEMA
// ============================
const rekeningSchema = z.object({
  nm_rekening: z.string().min(1),
  nilai: z.string().min(1),
})

const subKegiatanSchema = z.object({
  nm_subkegiatan: z.string().min(1),
  rekening: z.array(rekeningSchema).min(1),
})

const kegiatanSchema = z.object({
  nm_kegiatan: z.string().min(1),
  subKegiatan: z.array(subKegiatanSchema).min(1),
})

const programSchema = z.object({
  nm_program: z.string().min(1),
  kegiatan: z.array(kegiatanSchema).min(1),
})

const bidangSchema = z.object({
  nm_bu: z.string().min(1),
  program: z.array(programSchema).min(1),
})

const urusanSchema = z.object({
  nm_urusan: z.string().min(1),
  bidangUrusan: z.array(bidangSchema).min(1),
})

const formSchema = z.object({
  id_sp2d: z.string().optional(),
  no_spm: z.string().min(1, 'Nomor SPM wajib diisi'),
  jenis_berkas: z.string().min(1),
  id_berkas: z.array(z.string().min(1)).nonempty(),
  kd_opd1: z.string().min(1),
  kd_opd2: z.string().min(1),
  kd_opd3: z.string().min(1),
  kd_opd4: z.string().min(1),
  kd_opd5: z.string().min(1),
  nilai_belanja: z.string().min(1),
  nama_file: z.string().min(1),
  nama_file_asli: z.string().min(1),
  id_user: z.string().min(1),
  nama_user: z.string().min(1),
  agreement: z.string().min(1),
  urusan: z.array(urusanSchema).nonempty('Minimal 1 urusan'),
  sumber_dana: z.array(z.string().min(1)).nonempty('Sumber dana wajib diisi'),
  passphrase: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// ============================
// 🎨 COMPONENT
// ============================
export function PermohonanPenerbitanPeriksaDialog({
  currentRow,
  open,
  onOpenChange,
  onAction,
}: {
  currentRow?: Sp2dItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction?: (action: 'terima' | 'tolak', id: string) => void
}) {
  const isEdit = !!currentRow
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  // const [numPages, setNumPages] = useState<number>(0)
  const { mutateAsync: put } = usePutPermohonanSp2d()

  // jenis_bekas
  const { data, isLoading, isError } = useGetRefCeklisSPM({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  const { data: dataSD } = useGetLaporanRealisasiSumberDana({
    tahun: new Date().getFullYear().toString(),
  })
  const itemsSD =
    dataSD?.data?.map((item: LaporanRealisasiSumberDana) => ({
      value: [
        item.kd_ref1,
        item.kd_ref2,
        item.kd_ref3,
        item.kd_ref4,
        item.kd_ref5,
        item.kd_ref6,
      ]
        .filter(Boolean)
        .join('.'),
      label: item.nm_sumber ?? '',
    })) ?? []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id_sp2d: currentRow.id_sp2d ?? '',
          no_spm: currentRow.no_spm ?? '',
          jenis_berkas: currentRow.jenis_berkas ?? '',
          id_berkas: currentRow.id_berkas
            ? Array.isArray(currentRow.id_berkas)
              ? currentRow.id_berkas.map(String) // kalau sudah array
              : String(currentRow.id_berkas)
                  .split(',')
                  .map((v) => v.trim()) // kalau masih string "28,29,30"
            : [],
          kd_opd1: currentRow.kd_opd1 ?? '',
          kd_opd2: currentRow.kd_opd2 ?? '',
          kd_opd3: currentRow.kd_opd3 ?? '',
          kd_opd4: currentRow.kd_opd4 ?? '',
          kd_opd5: currentRow.kd_opd5 ?? '',
          nilai_belanja: currentRow.nilai_belanja ?? '',
          nama_file: currentRow.nama_file ?? '',
          nama_file_asli: currentRow.nama_file_asli ?? '',
          id_user: currentRow.id_user ?? '',
          nama_user: currentRow.nama_user ?? '',
          agreement: currentRow.agreement ?? '',
          // ✅ Gunakan helper yang menggabungkan rekening berdasarkan urusan
          urusan: mapRekeningToFormData(currentRow),

          sumber_dana:
            currentRow.sumber_dana?.map(
              (s) =>
                `${s.kd_ref1}.${s.kd_ref2}.${s.kd_ref3}.${s.kd_ref4}.${s.kd_ref5}.${s.kd_ref6}`
            ) ?? [],
        }
      : {
          id_sp2d: '',
          no_spm: '',
          jenis_berkas: '',
          id_berkas: [],
          kd_opd1: '',
          kd_opd2: '',
          kd_opd3: '',
          kd_opd4: '',
          kd_opd5: '',
          nilai_belanja: '',
          nama_file: '',
          nama_file_asli: '',
          id_user: '',
          nama_user: '',
          agreement: '',
          urusan: [],
          sumber_dana: [],
        },
  })

  useEffect(() => {
    if (!currentRow?.id_sp2d || !open) return

    let isMounted = true
    let pdfUrl: string | null = null

    const fetchPdf = async () => {
      try {
        const response = await api.get<Blob>(
          `/sp2d/permohonan-sp2d/download/${currentRow.id_sp2d}`,
          {
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            params: { t: Date.now() }, // bypass cache
          }
        )

        const blob = new Blob([response.data], { type: 'application/pdf' })
        pdfUrl = URL.createObjectURL(blob)

        if (isMounted) {
          setFileUrl(pdfUrl)
          toast.success('File berhasil diambil!')
        }
      } catch (err: unknown) {
        const error = err as AxiosError
        toast.error(
          `Gagal mengambil file: ${error.response?.data || error.message || 'Unknown error'}`
        )
      }
    }

    fetchPdf()

    return () => {
      isMounted = false
      if (pdfUrl) URL.revokeObjectURL(pdfUrl) // revoke URL lokal
      setFileUrl(null)
      // setNumPages(0);
    }
  }, [currentRow?.id_sp2d, open])

  // const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
  //   setNumPages(numPages)
  // }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'urusan',
  })

  const jenisBerkasValue = form.watch('jenis_berkas') // ceklis Berkas SPM
  const { data: dataJenisSPM, isLoading: pendingJenisSPM } = useGetRefJenisSPM({
    page: 1,
    perPage: 100,
    search: jenisBerkasValue || '',
  })

  const ceklisList = dataJenisSPM?.data || []

  const handleAction = async (action: 'terima' | 'tolak') => {
    if (!currentRow?.id_sp2d) return
    const now = new Date()
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const user = useAuthStore.getState().user
    if (!user) {
      toast.error('User belum login.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('id_sp2d', currentRow.id_sp2d)
      formData.append('id_operator', user.id.toString())
      formData.append('nama_operator', user.name)

      if (action === 'terima') {
        formData.append('proses', '1')
        formData.append('diterima', formatted)
        formData.append('alasan_tolak', '')
        formData.append('ditolak', '')
      } else {
        const alasan = prompt('Masukkan alasan penolakan:')
        if (!alasan) return toast.error('Alasan wajib diisi.')
        formData.append('proses', '0')
        formData.append('alasan_tolak', alasan)
        formData.append('ditolak', formatted)
        formData.append('diterima', '')
      }

      // Kirim ke backend
      await toast.promise(put(formData), {
        loading: action === 'terima' ? 'Menerima...' : 'Menolak...',
        success: () => {
          onOpenChange(false) // tutup modal
          onAction?.(action, currentRow.id_sp2d) // callback ke parent
          return `Berhasil ${action === 'terima' ? 'Diterima' : 'Ditolak'}!`
        },
        error: 'Gagal melakukan aksi.',
      })

      onAction?.(action, currentRow.id_sp2d) // callback ke parent
    } catch (err: unknown) {
      const error = err as AxiosError
      toast.error(
        `Gagal mengambil file: ${error.response?.data || error.message || 'Unknown error'}`
      )
    }
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
        title='Form Permohonan SP2D'
        description='Lengkapi data di bawah ini.'
      >
        <div className='flex h-full flex-col'>
          {/* FORM + DOCUMENT */}
          <div className='flex flex-1 gap-4 overflow-hidden'>
            <div className='flex-1 overflow-y-auto border-r p-4'>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name='no_spm'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1 pb-5'>
                      <FormLabel className='col-span-2 text-end'>
                        No SPM
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='No SPM'
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
                            disabled
                          >
                            {data?.data?.map(
                              (item: CeklisKelengkapanDokumen) => (
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
                              )
                            )}
                          </RadioGroup>
                        )}
                      </FormControl>

                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />

                {/* === LIST CEKLIS BERKAS === */}
                {jenisBerkasValue && (
                  <FormField
                    control={form.control}
                    name='id_berkas'
                    render={() => (
                      <FormItem className='mt-4 grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1 pb-5'>
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
                                            disabled
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

                {/* === URUSAN SECTION === */}
                <div className='space-y-3 pb-5'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Urusan & Program</FormLabel>
                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      disabled
                      onClick={() =>
                        append({
                          nm_urusan: '',
                          bidangUrusan: [
                            {
                              nm_bu: '',
                              program: [
                                {
                                  nm_program: '',
                                  kegiatan: [
                                    {
                                      nm_kegiatan: '',
                                      subKegiatan: [
                                        {
                                          nm_subkegiatan: '',
                                          rekening: [
                                            { nm_rekening: '', nilai: '' },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        })
                      }
                    >
                      <Plus className='mr-1 h-4 w-4' /> Tambah Urusan
                    </Button>
                  </div>

                  {fields.map((f, i) => (
                    <UrusanSection
                      key={f.id}
                      control={form.control}
                      indexUrusan={i}
                      removeUrusan={() => remove(i)}
                    />
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name='sumber_dana'
                  render={({ field }) => (
                    <FormItem className='pb-5'>
                      <FormLabel>Sumber Dana</FormLabel>
                      <FormControl>
                        <Command className='rounded-md border'>
                          <CommandInput placeholder='Pilih sumber dana...' />
                          <CommandList>
                            {field.value.length === 0 && (
                              <CommandEmpty>
                                Tidak ada yang dipilih
                              </CommandEmpty>
                            )}
                            <CommandGroup>
                              {itemsSD
                                .filter((r) => field.value.includes(r.value))
                                .map((r) => (
                                  <CommandItem
                                    disabled
                                    key={r.value}
                                    onSelect={() => {
                                      field.onChange(
                                        field.value.filter((v) => v !== r.value)
                                      )
                                    }}
                                  >
                                    <span>{r.label}</span>
                                    <CheckIcon className='ml-auto h-4 w-4' />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='nilai_belanja'
                  render={({ field }) => (
                    <FormItem className='pb-5'>
                      <FormLabel>Nilai Belanja</FormLabel>
                      <FormControl>
                        <Input {...field} disabled readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='nama_file'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uraian SPM</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </div>

            {/* PDF Preview */}
            <div className='flex-1 overflow-auto border-l p-4'>
              {fileUrl ? (
                <iframe
                  src={fileUrl}
                  className='h-full w-full'
                  title='PDF Viewer'
                  frameBorder='0'
                />
              ) : (
                <p className='mt-10 text-center'>Loading PDF...</p>
              )}
            </div>
          </div>

          <DialogFooter className='mt-2 flex justify-end gap-2'>
            <Button
              variant='outline'
              className='flex items-center gap-2'
              onClick={() => handleAction('terima')}
            >
              <Check size={16} /> Terima
            </Button>
            <Button
              variant='destructive'
              className='flex items-center gap-2'
              onClick={() => handleAction('tolak')}
            >
              <X size={16} /> Tolak
            </Button>
          </DialogFooter>
        </div>
      </DialogContentLarge>
    </Dialog>
  )
}
