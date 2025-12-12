/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import {
  type CeklisKelengkapanDokumen,
  useGetRefCeklisSPM,
  usePostPermohonanSp2d,
  usePutPermohonanSp2d,
  type Sp2dItem,
  useGetRefJenisSPM,
} from '@/api'
import { CheckIcon, Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  type CheckSumberDana,
  useGetCheckSumberDana,
} from '@/api/sp2d/check_sd'
import { useAuthStore } from '@/stores/auth-store'
import { formatRupiahControlled } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { mapRekeningToFormData } from '../data/mapRekeningToFormData'
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

// ============================
// 🧾 VALIDATION SCHEMA
// ============================
const rekeningSchema = z.object({
  nm_rekening: z.string().min(1),
  kd_rekening1: z.string().min(1),
  kd_rekening2: z.string().min(1),
  kd_rekening3: z.string().min(1),
  kd_rekening4: z.string().min(1),
  kd_rekening5: z.string().min(1),
  kd_rekening6: z.string().min(1),
  nilai: z.string().min(1),
})

const subKegiatanSchema = z.object({
  nm_subkegiatan: z.string().min(1),
  kd_subkeg1: z.string().min(1),
  kd_subkeg2: z.string().min(1),
  kd_subkeg3: z.string().min(1),
  kd_subkeg4: z.string().min(1),
  kd_subkeg5: z.string().min(1),
  kd_subkeg6: z.string().min(1),
  rekening: z.array(rekeningSchema).min(1),
})

const kegiatanSchema = z.object({
  nm_kegiatan: z.string().min(1),
  kd_keg1: z.string().min(1),
  kd_keg2: z.string().min(1),
  kd_keg3: z.string().min(1),
  kd_keg4: z.string().min(1),
  kd_keg5: z.string().min(1),
  subKegiatan: z.array(subKegiatanSchema).min(1),
})

const programSchema = z.object({
  nm_program: z.string().min(1),
  kd_prog1: z.string().min(1),
  kd_prog2: z.string().min(1),
  kd_prog3: z.string().min(1),
  kegiatan: z.array(kegiatanSchema).min(1),
})

const bidangSchema = z.object({
  nm_bu: z.string().min(1),
  kd_bu1: z.string().min(1),
  kd_bu2: z.string().min(1),
  program: z.array(programSchema).min(1),
})

const urusanSchema = z.object({
  kd_urusan: z.string().min(1),
  bidangUrusan: z.array(bidangSchema).min(1),
})

const formSchema = z
  .object({
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
    urusan: z.array(urusanSchema).optional(),
    sumber_dana: z
      .array(
        z.object({
          kd_ref1: z.string().nullable(),
          kd_ref2: z.string().nullable(),
          kd_ref3: z.string().nullable(),
          kd_ref4: z.string().nullable(),
          kd_ref5: z.string().nullable(),
          kd_ref6: z.string().nullable(),
          sisa: z.union([z.string(), z.number()]),
          nilai: z.union([z.string(), z.number()]),
        })
      )
      .nonempty('Sumber dana wajib diisi'),
  })
  .superRefine((data, ctx) => {
    // jika jenis_berkas bukan 'UP', maka urusan harus diisi minimal 1
    if (data.jenis_berkas !== 'UP') {
      if (!data.urusan || data.urusan.length === 0) {
        ctx.addIssue({
          path: ['urusan'],
          code: 'custom', // ✅ pakai string literal
          message: 'Minimal 1 urusan',
        })
      }
    }
  })

type FormValues = z.infer<typeof formSchema>

// ============================
// 🎨 COMPONENT
// ============================
export function PermohonanPenerbitanSP2DActionDialog({
  currentRow,
  open,
  edit,
  onOpenChange,
}: {
  currentRow?: Sp2dItem
  open: boolean
  edit: string
  onOpenChange: (open: boolean) => void
}) {
  const isEdit = !!currentRow
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [openConfirm, setOpenConfirm] = useState(false)
  const [hasConfirmedBerkas, setHasConfirmedBerkas] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [openFirst, setOpenFirst] = useState(false)
  const [openSecond, setOpenSecond] = useState(false)

  const { mutateAsync: post } = usePostPermohonanSp2d()
  const { mutateAsync: put } = usePutPermohonanSp2d()

  // jenis_bekas
  const { data, isLoading, isError } = useGetRefCeklisSPM({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  const { data: dataSD } = useGetCheckSumberDana({
    tahun: new Date().getFullYear().toString(),
  })
  const itemsSD =
    dataSD?.data?.map((item: CheckSumberDana) => ({
      value: {
        kd_ref1: item.kd_ref1,
        kd_ref2: item.kd_ref2,
        kd_ref3: item.kd_ref3,
        kd_ref4: item.kd_ref4,
        kd_ref5: item.kd_ref5,
        kd_ref6: item.kd_ref6,
        sisa: item.sisa,
        nm_sumber: item.nm_sumber,
        jenis_sumber_dana: item.jenis_sumber_dana,
      },
      label: `${item.nm_sumber}`,
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
          nama_file_asli: currentRow.nama_file_asli ?? '',
          id_user: currentRow.id_user ?? '',
          nama_user: currentRow.nama_user ?? '',
          agreement: currentRow.agreement ?? '',
          // ✅ Gunakan helper yang menggabungkan rekening berdasarkan urusan
          urusan: mapRekeningToFormData(currentRow),

          sumber_dana:
            currentRow.sumber_dana?.map((s) => ({
              kd_ref1: s.kd_ref1,
              kd_ref2: s.kd_ref2,
              kd_ref3: s.kd_ref3,
              kd_ref4: s.kd_ref4,
              kd_ref5: s.kd_ref5,
              kd_ref6: s.kd_ref6,
              sisa: s.sisa ?? 0,
              nilai: s.nilai ?? 0,
            })) ?? [],
        }
      : {
          id: '',
          no_spm: '',
          jenis_berkas: '',
          id_berkas: [],
          kd_opd1: user?.kd_opd1,
          kd_opd2: user?.kd_opd2,
          kd_opd3: user?.kd_opd3,
          kd_opd4: user?.kd_opd4,
          kd_opd5: user?.kd_opd5,
          nilai_belanja: '',
          nama_file: '',
          nama_file_asli: undefined,
          id_user: user?.id.toString() ?? '',
          nama_user: user?.name,
          agreement: '',
          urusan: [],
          sumber_dana: [],
        },
  })
  const { control, setValue } = form
  // console.log('form errors', form.formState.errors)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'urusan',
  })

  const urusan = useWatch({ control, name: 'urusan' })

  // 🔹 Hitung total nilai otomatis
  useEffect(() => {
    if (!urusan || urusan.length === 0) return

    let total = 0

    try {
      urusan.forEach((u) =>
        u.bidangUrusan?.forEach((b) =>
          b.program?.forEach((p) =>
            p.kegiatan?.forEach((k) =>
              k.subKegiatan?.forEach((s) =>
                s.rekening?.forEach((r) => {
                  const val = parseFloat(r.nilai)
                  if (!isNaN(val)) total += val
                })
              )
            )
          )
        )
      )

      if (total > 0) {
        setValue('nilai_belanja', total.toString())
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menghitung total nilai.'
      toast.error(errorMessage)
    }
  }, [urusan, setValue])

  // 🔹 Cek apakah nilai otomatis dari urusan
  const adaNilaiOtomatis =
    urusan?.some((u) =>
      u.bidangUrusan?.some((b) =>
        b.program?.some((p) =>
          p.kegiatan?.some((k) =>
            k.subKegiatan?.some((s) =>
              s.rekening?.some((r) => r.nilai && r.nilai !== '')
            )
          )
        )
      )
    ) ?? false

  const jenisBerkasValue = form.watch('jenis_berkas') // ceklis Berkas SPM
  const { data: dataJenisSPM, isLoading: pendingJenisSPM } = useGetRefJenisSPM({
    page: 1,
    perPage: 100,
    search: jenisBerkasValue || '',
  })

  const SelectedjenisBerkasValue = useWatch({ control, name: 'jenis_berkas' })

  useEffect(() => {
    setValue('id_berkas', [])
  }, [SelectedjenisBerkasValue, setValue])

  const ceklisList = dataJenisSPM?.data || []

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData()
    formData.append('id', data.id || '')
    formData.append('nama_file', data.nama_file)
    formData.append('id_user', data.id_user)
    formData.append('nama_user', data.nama_user)
    formData.append('kd_opd1', data.kd_opd1)
    formData.append('kd_opd2', data.kd_opd2)
    formData.append('kd_opd3', data.kd_opd3)
    formData.append('kd_opd4', data.kd_opd4)
    formData.append('kd_opd5', data.kd_opd5)
    formData.append('urusan', 'Penerbitan SP2D')
    formData.append('sp2d_rek', JSON.stringify(data.urusan))
    formData.append('sumber_dana', JSON.stringify(data.sumber_dana))
    formData.append('tahun', new Date().getFullYear().toString())
    formData.append('no_spm', data.no_spm)
    formData.append('jenis_berkas', data.jenis_berkas)
    formData.append('nilai_belanja', data.nilai_belanja)
    formData.append('agreement', data.agreement)
    formData.append('id_berkas', JSON.stringify(data.id_berkas))
    // Jika user upload file baru
    if (
      data.nama_file_asli instanceof FileList &&
      data.nama_file_asli.length > 0
    ) {
      formData.append('nama_file_asli', data.nama_file_asli[0])
    }

    const req = isEdit ? put(formData) : post(formData)
    await toast.promise(req, {
      loading: 'Menyimpan data...',
      success: () => {
        onOpenChange(false)
        queryClient.invalidateQueries({
          queryKey: ['useGetCheckSumberDana'],
        })
        form.reset()
        return isEdit ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!'
      },
      error: 'Gagal menyimpan data.',
    })
  }

  const sumberDana = useWatch({ control: form.control, name: 'sumber_dana' })
  const nilaiBelanjaRaw = useWatch({
    control: form.control,
    name: 'nilai_belanja',
  })
  const nilaiBelanja = Number(nilaiBelanjaRaw) || 0

  useEffect(() => {
    if (!open) return
    if (!sumberDana?.length || !nilaiBelanja) return
    if (edit == 'edit' || edit == 'add') {
      let sisaBelanja = Number(nilaiBelanja)
      const updated = sumberDana.map((sd: any) => {
        const sisa = Number(sd.sisa ?? 0)
        const alokasi = Math.min(sisaBelanja, sisa)
        sisaBelanja -= alokasi

        return {
          ...sd,
          sisa, // pastikan number
          nilai: alokasi, // pastikan number
        }
      })

      if (sisaBelanja > 0) {
        toast.warning(
          'Total sisa sumber dana tidak mencukupi nilai belanja, silahkan tambahkan sumber dana yg lain !'
        )
      } else {
        toast.success('Total sisa sumber dana sudah mencukupi nilai belanja')
      }

      // hanya update jika ada perubahan sesungguhnya
      const isDifferent = JSON.stringify(updated) !== JSON.stringify(sumberDana)
      if (isDifferent) {
        form.setValue('sumber_dana', updated)
      }
    }
  }, [sumberDana, nilaiBelanja])

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
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Urusan & Program</FormLabel>
                      <Button
                        type='button'
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          if (!hasConfirmedBerkas) {
                            setOpenConfirm(true) // buka modal dulu
                            return
                          }

                          // Sudah konfirmasi → langsung append
                          append({
                            kd_urusan: '',
                            bidangUrusan: [],
                          })
                        }}
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
                    name='nilai_belanja'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nilai Belanja</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='numeric'
                            placeholder='Nilai Belanja'
                            value={formatRupiahControlled(field.value || '')}
                            onChange={(e) => {
                              // hanya ambil angka saja (hilangkan non-digit)
                              const raw = e.target.value.replace(/\D/g, '')
                              field.onChange(raw)
                            }}
                            readOnly={adaNilaiOtomatis} // tidak bisa diedit kalau otomatis
                            className={
                              adaNilaiOtomatis
                                ? 'cursor-not-allowed bg-gray-100'
                                : ''
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='sumber_dana'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sumber Dana</FormLabel>
                        <FormControl>
                          <Command className='rounded-md border'>
                            <CommandInput placeholder='Pilih sumber dana...' />
                            <CommandList>
                              {itemsSD.length === 0 && (
                                <CommandEmpty>Tidak ada data</CommandEmpty>
                              )}
                              <CommandGroup>
                                {itemsSD.map((r) => {
                                  const sumberDana = field.value || []
                                  const nilaiBelanja = Number(
                                    form.watch('nilai_belanja') || 0
                                  )
                                  const totalAlokasi = sumberDana.reduce(
                                    (sum: number, sd: any) =>
                                      sum + Number(sd.nilai || sd.sisa || 0),
                                    0
                                  )

                                  const selected = sumberDana.some(
                                    (v: any) =>
                                      v.kd_ref1 === r.value.kd_ref1 &&
                                      v.kd_ref2 === r.value.kd_ref2 &&
                                      v.kd_ref3 === r.value.kd_ref3 &&
                                      v.kd_ref4 === r.value.kd_ref4 &&
                                      v.kd_ref5 === r.value.kd_ref5 &&
                                      v.kd_ref6 === r.value.kd_ref6
                                  )
                                  // ----------------------------------------------------------
                                  // RULE 1: Jika jenis_sumber_dana = KHUSUS => tidak boleh multi
                                  // ----------------------------------------------------------
                                  const adaKhusus = sumberDana.some(
                                    (sd: any) =>
                                      sd.jenis_sumber_dana === 'KHUSUS'
                                  )
                                  const iniKhusus =
                                    r.value.jenis_sumber_dana === 'KHUSUS'

                                  // Jika sudah punya 1 KHUSUS → semua selain dirinya harus disabled
                                  if (adaKhusus && !selected && !iniKhusus) {
                                    return (
                                      <CommandItem
                                        key={r.label}
                                        disabled={true}
                                        className='cursor-not-allowed opacity-40'
                                      >
                                        <span>{r.label}</span>
                                      </CommandItem>
                                    )
                                  }

                                  // Jika mau memilih KHUSUS tapi sumber dana sudah lebih dari 0 → tidak boleh multi
                                  const disableKhusus =
                                    iniKhusus &&
                                    sumberDana.length > 0 &&
                                    !selected

                                  // ----------------------------------------------------------
                                  // RULE 2: Jika totalAlokasi >= nilaiBelanja → disabled
                                  // ----------------------------------------------------------
                                  const disabled =
                                    (!selected &&
                                      totalAlokasi >= nilaiBelanja) ||
                                    disableKhusus

                                  return (
                                    <CommandItem
                                      key={r.label}
                                      disabled={disabled}
                                      onSelect={() => {
                                        // BLOKIR KHUSUS JIKA SUDAH ADA SUMBER LAIN
                                        if (disableKhusus) {
                                          alert(
                                            'Sumber dana KHUSUS tidak boleh digabung dengan sumber dana lain.'
                                          )
                                          return
                                        }

                                        // HAPUS jika sudah ada
                                        if (selected) {
                                          field.onChange(
                                            sumberDana.filter(
                                              (v: any) =>
                                                !(
                                                  v.kd_ref1 ===
                                                    r.value.kd_ref1 &&
                                                  v.kd_ref2 ===
                                                    r.value.kd_ref2 &&
                                                  v.kd_ref3 ===
                                                    r.value.kd_ref3 &&
                                                  v.kd_ref4 ===
                                                    r.value.kd_ref4 &&
                                                  v.kd_ref5 ===
                                                    r.value.kd_ref5 &&
                                                  v.kd_ref6 === r.value.kd_ref6
                                                )
                                            )
                                          )
                                          return
                                        }

                                        // CEK TOTAL — jika kurang dari nilai belanja nanti dicek ulang
                                        const newTotal =
                                          totalAlokasi +
                                          Number(r.value.sisa || 0)

                                        if (
                                          newTotal < nilaiBelanja &&
                                          iniKhusus
                                        ) {
                                          setShowAlert(true)
                                          return
                                        }

                                        // TAMBAH data sumber dana
                                        field.onChange([...sumberDana, r.value])
                                      }}
                                      className={
                                        disabled
                                          ? 'cursor-not-allowed opacity-50'
                                          : ''
                                      }
                                    >
                                      <span>{r.label}</span>
                                      {selected && (
                                        <CheckIcon className='ml-auto h-4 w-4' />
                                      )}
                                    </CommandItem>
                                  )
                                })}
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
                    name='nama_file'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uraian SPM</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder='Uraian SPM' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='nama_file_asli'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload File</FormLabel>
                        <FormControl>
                          <Input
                            type='file'
                            accept='application/pdf'
                            className='file:bg-primary hover:file:bg-primary/90 h-9 px-3 py-1 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1 file:text-gray-500'
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='agreement'
                    render={({ field }) => (
                      <FormItem className='flex items-start space-y-0 space-x-3'>
                        <FormControl>
                          <Checkbox
                            checked={field.value === 'YA'}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? 'YA' : '')
                            }
                          />
                        </FormControl>
                        <FormLabel className='text-sm leading-tight'>
                          Dengan ini menyatakan bahwa dokumen telah sesuai
                          dengan ketentuan yang berlaku, terhadap dokumen
                          pertanggungjawaban disimpan oleh Perangkat Daerah.
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
        </div>

        <DialogFooter className='mt-2'>
          <Button type='button' onClick={() => setOpenFirst(true)}>
            Kirim
          </Button>
        </DialogFooter>
      </DialogContentLarge>
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah daftar berkas yang Anda ceklis sudah sesuai?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                //  ❌ TIDAK → kosongkan id_berkas
                form.setValue('id_berkas', [])
              }}
            >
              Tidak
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                //  ✅ YA → set flag agar next click tidak tanya lagi
                setHasConfirmedBerkas(true)

                // lakukan append urusan baru
                append({
                  kd_urusan: '',
                  bidangUrusan: [],
                })

                setOpenConfirm(false)
              }}
            >
              Ya, sesuai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Peringatan</AlertDialogTitle>
            <AlertDialogDescription>
              Sumber dana KHUSUS tidak mencukupi total belanja.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* ===== POPUP 1 ===== */}
      <AlertDialog open={openFirst} onOpenChange={setOpenFirst}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah jenis belanja sudah benar?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenFirst(false)
                setTimeout(() => setOpenSecond(true), 50)
              }}
            >
              Ya
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== POPUP 2 ===== */}
      <AlertDialog open={openSecond} onOpenChange={setOpenSecond}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah sumber dana sudah benar?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenSecond(false)
                form.handleSubmit(onSubmit)()
              }}
            >
              Ya, Kirim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
