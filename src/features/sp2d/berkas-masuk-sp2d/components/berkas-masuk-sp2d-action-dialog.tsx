'use client'

import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CeklisKelengkapanDokumen,
  useGetRefCeklisSPM,
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
import { UrusanSection } from '../../permohonan-penerbitan-sp2d/components/urusan-section'
import { mapRekeningToFormData } from '../../permohonan-penerbitan-sp2d/data/mapRekeningToFormData'

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
  nama_file_asli: z.string().min(1),
  id_user: z.string().min(1),
  nama_user: z.string().min(1),
  agreement: z.string().min(1),
  urusan: z.array(urusanSchema).nonempty('Minimal 1 urusan'),
  sumber_dana: z.array(z.string().min(1)).nonempty('Sumber dana wajib diisi'),
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

  const fileRef = form.register('nama_file_asli')

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
    const req = put(formData)
    await toast.promise(req, {
      loading: 'Menyimpan data...',
      success: () => {
        onOpenChange(false)
        return isEdit ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!'
      },
      error: 'Gagal menyimpan data.',
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
        title='Form Permohonan SP2D'
        description='Lengkapi data di bawah ini.'
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

              {/* === URUSAN SECTION === */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <FormLabel>Urusan & Program</FormLabel>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
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
                            {itemsSD.map((r) => (
                              <CommandItem
                                key={r.value}
                                onSelect={() => {
                                  if (!field.value.includes(r.value)) {
                                    field.onChange([...field.value, r.value])
                                  } else {
                                    field.onChange(
                                      field.value.filter((v) => v !== r.value)
                                    )
                                  }
                                }}
                              >
                                <span>{r.label}</span>
                                {field.value.includes(r.value) && (
                                  <CheckIcon className='ml-auto h-4 w-4' />
                                )}
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
                  <FormItem>
                    <FormLabel>Nilai Belanja</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Nilai Belanja' />
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
                render={() => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <Input type='file' {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='sp2d-form'>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContentLarge>
    </Dialog>
  )
}
