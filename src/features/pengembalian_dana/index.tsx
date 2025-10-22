'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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

// 🧩 Schema validasi
const formSchema = z.object({
  opd: z.string().min(1, 'Pilih SKPD/SATKER'),
  nik: z.string().min(16, 'NIK minimal 16 digit'),
  name: z.string().min(3, 'Nama wajib diisi'),
  alamat: z.string().min(5, 'Alamat wajib diisi'),
  tahun: z.string().min(4, 'Tahun wajib dipilih'),
  rekening: z.string().min(1, 'Pilih rekening'),
  jumlah: z.string().min(1, 'Jumlah wajib diisi'),
})

type FormValues = z.infer<typeof formSchema>

export default function PengembalianDanaForm() {
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opd: '',
      nik: '',
      name: '',
      alamat: '',
      tahun: '',
      rekening: '',
      jumlah: '',
    },
  })

  const onSubmit = async () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Mengirim data...',
      success: 'Data pengembalian berhasil dikirim!',
      error: 'Terjadi kesalahan. Coba lagi.',
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
                name='opd'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-gray-200'>
                      SKPD / SATKER
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'>
                          <SelectValue placeholder='Pilih SKPD/SATKER' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Dinas Pendidikan'>
                          Dinas Pendidikan
                        </SelectItem>
                        <SelectItem value='Dinas Kesehatan'>
                          Dinas Kesehatan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                        {[2022, 2023, 2024, 2025].map((t) => (
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-gray-200'>
                      Rekening
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'>
                          <SelectValue placeholder='Pilih Rekening' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='5.2.1.01.01 - Belanja Barang'>
                          5.2.1.01.01 - Belanja Barang
                        </SelectItem>
                        <SelectItem value='5.2.2.01.02 - Belanja Jasa'>
                          5.2.2.01.02 - Belanja Jasa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
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

          <button
            id='laporan-bayar'
            className='mt-6 flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2 text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg focus:ring-2 focus:ring-amber-400 focus:outline-none'
          >
            <i className='zmdi zmdi-assignment text-lg'></i>
            <span>Cek Laporan Pembayaran</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
