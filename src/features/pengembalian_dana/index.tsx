'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import {
  type DatRekeningItem,
  type MasterSkpd,
  useGetDatRekening,
  useGetRefSKPD,
  usePostPengembalian,
} from '@/api'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SelectDropdown } from '@/components/select-dropdown'
import { LaporanPembayaranModal } from './components/pengembalian-dana-modal'

type PengembalianRes = {
  nama: string
  nik: string
  alamat: string
  rekening: string
  jumlah: string
  keterangan: string
  tanggal: string
  link: string
  link_pdf: string
  no_billing: string
  terbilang: string
}

// 🧩 Schema validasi
const formSchema = z.object({
  skpd: z.string().min(1, 'Pilih SKPD/SATKER'),
  nik: z.string().min(16, 'NIK minimal 16 digit'),
  name: z.string().min(3, 'Nama wajib diisi'),
  alamat: z.string().min(5, 'Alamat wajib diisi'),
  tahun: z.string().min(4, 'Tahun wajib dipilih'),
  rekening: z.string().min(1, 'Pilih rekening'),
  jumlah: z.string().min(1, 'Jumlah wajib diisi'),
  keterangan: z.string().min(5, 'Keterangan wajib diisi'),
})

type FormValues = z.infer<typeof formSchema>

const currentYear = new Date().getFullYear()

const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i)

export default function PengembalianDanaForm() {
  const [open, setOpen] = useState(false)
  const [resultData, setResultData] = useState<PengembalianRes | null>(null)
  const [openResult, setOpenResult] = useState(false)
  const router = useRouter()

  const { mutateAsync: post } = usePostPengembalian()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skpd: '',
      nik: '',
      name: '',
      alamat: '',
      tahun: '',
      rekening: '',
      jumlah: '',
    },
  })

  const { data: dataRek } = useGetDatRekening({
    page: 1,
    perPage: 100,
    status_rek: '1',
  })

  const itemsRek =
    dataRek?.data?.map((item: DatRekeningItem) => {
      const kode = [
        item.kd_rek1,
        item.kd_rek2,
        item.kd_rek3,
        item.kd_rek4,
        item.kd_rek5,
        item.kd_rek6,
        item.nm_rekening,
      ]
        .filter(Boolean)
        .join('.')

      return {
        value: kode,
        label: `${kode} - ${item.nm_rekening ?? '-'}`,
      }
    }) ?? []

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

  const onSubmit = async (data: FormValues) => {
    await toast.promise(post(data), {
      loading: 'Tunggu Sebentar',
      success: (res) => {
        if (res) {
          setResultData({
            ...res,
            keterangan: res.keterangan ?? '',
          })
          setOpenResult(true)
          return 'Pengembalian berhasil dikirim!'
        }
      },
      error: 'Gagal melakukan aksi.',
    })
  }

  return (
    <motion.div
      className='flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-100 to-indigo-50 p-6 transition-colors duration-500 dark:from-gray-900 dark:via-slate-950 dark:to-gray-900'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🔙 Tombol Back */}
      <Button
        type='button'
        onClick={() => router.history.back()} // ⬅️ ini versi TanStack Router
        className='hover:text-indigo-60 absolute top-6 left-6 flex items-center gap-2 transition-colors'
      >
        <ArrowLeft className='h-5 w-5' />
        <span className='text-sm font-medium'>Kembali</span>
      </Button>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='grid w-full max-w-5xl gap-8 overflow-hidden rounded-2xl bg-white/70 shadow-2xl ring-1 ring-gray-200 backdrop-blur-lg md:grid-cols-2 dark:bg-gray-900/70 dark:ring-gray-800'
      >
        {/* 🧾 Bagian kiri: Form */}
        <div className='relative p-8'>
          <div className='mb-6 flex items-center gap-3'>
            <img
              src='/images/logo-sepeda-murah.png'
              alt='Logo'
              className='h-10 w-10 drop-shadow-md'
            />
            <div>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>
                Pengembalian Dana
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Lengkapi form berikut untuk laporan pengembalian dana.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='skpd'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKPD</FormLabel>
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
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nik'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-gray-200'>NIK</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nomor Induk Kependudukan'
                        {...field}
                        className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-gray-200'>
                      Nama Lengkap
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nama sesuai KTP'
                        {...field}
                        className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='alamat'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-gray-200'>
                      Alamat Lengkap
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder='Alamat lengkap Anda'
                        {...field}
                        value={field.value || ''} // pastikan tidak undefined
                        onChange={field.onChange}
                        className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tahun'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-gray-200'>Tahun</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'>
                          <SelectValue placeholder='Pilih Tahun' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((t) => (
                          <SelectItem key={t} value={String(t)}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='rekening'
                render={({ field }) => {
                  const selected = itemsRek.find((i) => i.value === field.value)

                  return (
                    <FormItem>
                      <FormLabel>Rekening</FormLabel>
                      <div className='col-span-4'>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className='w-100'>
                                <SelectDropdown
                                  defaultValue={String(field.value ?? '')}
                                  onValueChange={(val) => field.onChange(val)}
                                  placeholder='Pilih Rekening'
                                  // ⬇️ tambahkan truncate agar teks di trigger terpotong
                                  className='w-100 truncate'
                                  items={itemsRek.map(({ label, value }) => ({
                                    label,
                                    value,
                                  }))}
                                />
                              </div>
                            </TooltipTrigger>

                            {selected?.label && (
                              <TooltipContent className='z-[9999] max-w-[300px]'>
                                {selected.label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name='jumlah'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-gray-200'>
                      Jumlah (Rupiah)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan jumlah pengembalian'
                        {...field}
                        className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '')
                          field.onChange(
                            new Intl.NumberFormat('id-ID').format(Number(value))
                          )
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='keterangan'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-gray-200'>
                      Keterangan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder='Keterangan'
                        {...field}
                        value={field.value || ''} // pastikan tidak undefined
                        onChange={field.onChange}
                        className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-600 dark:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800'
              >
                Simpan
              </Button>

              <p className='mt-4 text-center text-sm text-gray-500 dark:text-gray-400'>
                Ada pertanyaan?{' '}
                <a
                  href='/auth'
                  className='text-indigo-600 hover:underline dark:text-indigo-400'
                >
                  Hubungi kami
                </a>
              </p>
            </form>
          </Form>
        </div>

        {/* 🎨 Bagian kanan: ilustrasi + tombol */}
        <div className='hidden flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-200 md:flex dark:from-gray-800 dark:via-gray-900 dark:to-gray-800'>
          <img
            src='/images/ewallet.svg'
            alt='Ilustrasi Pengembalian Dana'
            className='w-[80%] drop-shadow-2xl'
          />
          <Button
            type='button'
            onClick={() => setOpen(true)}
            className='my-5 bg-yellow-400'
          >
            Cek Laporan Pembayaran
          </Button>
          {/* Trigger Modal */}
          <LaporanPembayaranModal
            key='cek-pengembalian-dana'
            open={open}
            onOpenChange={setOpen}
          />
        </div>
        {/* hasil sukses */}
        <Dialog open={openResult} onOpenChange={setOpenResult}>
          <DialogContent className='max-w-lg'>
            <DialogHeader>
              <DialogTitle>Data Pengembalian</DialogTitle>
            </DialogHeader>
            {resultData && (
              <div className='space-y-2 text-sm'>
                <table className='w-full border-collapse'>
                  <tbody>
                    <tr>
                      <td className='w-1/3 font-medium'>Rekening</td>
                      <td>: {resultData.rekening}</td>
                    </tr>
                    <tr>
                      <td>NIK</td>
                      <td>: {resultData.nik}</td>
                    </tr>
                    <tr>
                      <td>Atas Nama</td>
                      <td>: {resultData.nama}</td>
                    </tr>
                    <tr>
                      <td>Jumlah</td>
                      <td>: {resultData.jumlah}</td>
                    </tr>
                    <tr>
                      <td>Terbilang</td>
                      <td>: {resultData.terbilang} Rupiah</td>
                    </tr>
                    <tr>
                      <td>Keterangan</td>
                      <td>: {resultData.keterangan}</td>
                    </tr>
                    <tr>
                      <td>Tanggal</td>
                      <td>: {resultData.tanggal}</td>
                    </tr>
                    <tr>
                      <td>NO STS</td>
                      <td>: {resultData.no_billing}</td>
                    </tr>
                  </tbody>
                </table>

                <div className='mt-4 flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => window.open(resultData.link, '_blank')}
                  >
                    Cetak Dokumen
                  </Button>
                  <Button
                    onClick={() => window.open(resultData.link_pdf, '_blank')}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  )
}
