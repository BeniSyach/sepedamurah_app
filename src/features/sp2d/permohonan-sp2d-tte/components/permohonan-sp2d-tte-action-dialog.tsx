/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CeklisKelengkapanDokumen,
  useGetRefCeklisSPM,
  type Sp2dItem,
  useGetRefSumberDana,
  type SumberDana,
  useGetRefJenisSPM,
} from '@/api'
import { CheckIcon, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useSignSp2dKirim } from '@/api/sp2d/sign-sp2d'
import { formatRupiah } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogContentLarge,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { mapRekeningToFormData } from '../data/mapRekeningToFormData'
import PdfEditorPdfLib from './pdf-sp2d-tte'
import { UrusanSection } from './urusan-section'

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

const passSchema = z.object({
  passphrase: z.string().min(3, 'Passphrase wajib diisi'),
})

const formSchema = z.object({
  id: z.string().optional(),
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
export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: {
  currentRow?: Sp2dItem
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isEdit = !!currentRow
  const { mutateAsync: post } = useSignSp2dKirim()
  // generatePdf selalu async
  const [generatePdf, setGeneratePdf] = useState<() => Promise<void>>(
    async () => {}
  )

  const handleSave = async () => {
    await generatePdf()
  }

  // jenis_bekas
  const { data, isLoading, isError } = useGetRefCeklisSPM({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  const { data: dataSD } = useGetRefSumberDana({
    page: 1,
    perPage: 1000,
    status: '1',
  })
  const itemsSD =
    dataSD?.data?.map((item: SumberDana) => ({
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
      label: item.nm_ref ?? '',
    })) ?? []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id_sp2d ?? '',
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
          nama_file_asli: '',
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
          id: '',
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

  // === Form Passphrase ===
  const passForm = useForm({
    resolver: zodResolver(passSchema),
    defaultValues: { passphrase: '' },
  })

  // Simulasi dialog passphrase aktif via form field
  const showPassDialog = !!form.watch('passphrase')

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

  const onSubmit = async (data: FormValues) => {
    if (!data.nama_file_asli) {
      toast.error('Silakan export PDF terlebih dahulu')
      return
    }

    const payload = {
      id_sp2d: data.id ?? '', // FIX → tidak pernah undefined
      nama_file: data.nama_file ?? '', // FIX → tidak pernah undefined
      passphrase: data.passphrase ?? '', // FIX → tidak pernah undefined
      tampilan: 'invisible',
      file: data.nama_file_asli,
    }

    const req = post(payload)
    await toast.promise(req, {
      loading: 'Mengirim & menandatangani PDF...',
      success: () => {
        onOpenChange(false)
        return 'PDF berhasil ditandatangani!'
      },
      error: (err) => {
        return err.response.data.detail.error
      },
    })
  }

  const onSubmitPass = async (values: any) => {
    await handleSave() // 🚀 Generate PDF dulu

    form.setValue('passphrase', values.passphrase)
    onSubmit(form.getValues())
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
            <div className='flex-1 overflow-y-auto border-r p-3'>
              <Form {...form}>
                <form
                  id='sp2d-tte-form'
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4 px-0.5'
                >
                  <FormField
                    control={form.control}
                    name='no_spm'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-5 items-center gap-x-2 gap-y-0 pb-3'>
                        <FormLabel className='col-span-1 text-end'>
                          No SPM
                        </FormLabel>

                        <FormControl className='col-span-4'>
                          <Input
                            placeholder='No SPM'
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
                      <FormItem className='grid grid-cols-5 items-center gap-x-2 gap-y-0 pb-3'>
                        <FormLabel className='col-span-1 pt-2 text-end'>
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
                        <FormItem className='grid grid-cols-5 items-start gap-x-2 gap-y-0 pb-3'>
                          {/* Label kolom kiri */}
                          <FormLabel className='col-span-1 pt-2 text-end'>
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
                                                      (v) =>
                                                        v !== String(item.id)
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
                            {/* <CommandInput
                            disabled
                            placeholder='Pilih sumber dana...'
                          /> */}
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
                                          field.value.filter(
                                            (v) => v !== r.value
                                          )
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
                          <Input
                            {...field}
                            readOnly
                            placeholder='0'
                            className='font-semibold'
                            value={formatRupiah(field.value ?? '')}
                            onChange={(e) => {
                              // Ambil angka asli tanpa format
                              const raw = e.target.value.replace(/[^0-9]/g, '')

                              // Set angka mentah ke form
                              field.onChange(raw)
                            }}
                          />
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
                </form>
              </Form>
            </div>
            <div className='flex-1 overflow-auto border-l p-10'>
              <PdfEditorPdfLib
                currentRow={currentRow}
                onExport={(file) => {
                  form.setValue('nama_file_asli', file) // ← simpan ke form
                }}
                onSaveTrigger={(fn) => setGeneratePdf(() => fn)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              onClick={() => form.setValue('passphrase', 'open')}
            >
              Passpharase
            </Button>
          </DialogFooter>
        </div>
      </DialogContentLarge>
      {/* === DIALOG PASSPHRASE === */}
      <Dialog
        open={showPassDialog}
        onOpenChange={(v) => {
          if (!v) form.setValue('passphrase', '')
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Masukkan Passphrase</DialogTitle>
          </DialogHeader>

          <Form {...passForm}>
            <form
              onSubmit={passForm.handleSubmit(onSubmitPass)}
              className='space-y-3'
            >
              <FormField
                control={passForm.control}
                name='passphrase'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passphrase</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Ketik passphrase...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => form.setValue('passphrase', '')}
                >
                  Batal
                </Button>

                <Button type='submit'>Kirim</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
