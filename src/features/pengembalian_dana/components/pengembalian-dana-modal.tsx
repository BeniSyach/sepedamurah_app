'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Pengembalian } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { Dialog, DialogContentLarge } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PengembalianDanaTable } from './pengembalian-dana-table-'

// 🧩 Schema validasi
const filterSchema = z.object({
  nik: z
    .string()
    .min(16, 'NIK minimal 16 digit')
    .regex(/^\d+$/, 'NIK hanya boleh angka'),
})

type FormValues = z.infer<typeof filterSchema>

type PengembalianDanaActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LaporanPembayaranModal({
  open,
  onOpenChange,
}: PengembalianDanaActionDialogProps) {
  const [pengembalianData, setPengembalianData] = useState<Pengembalian[]>([])
  const form = useForm<FormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { nik: '' },
  })

  const onSubmit = async (data: FormValues) => {
    const promise = api.get('/pengembalian', {
      params: {
        page: 1,
        perPage: 100,
        nik: data.nik,
      },
    })

    await toast.promise(promise, {
      loading: 'Mengecek Data...',
      success: 'Data Berhasil diambil',
      error: 'Terjadi kesalahan. Coba lagi.',
    })

    const response = await promise
    setPengembalianData(response.data.data) // simpan di state
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
        title='Cek Laporan Pembayaran'
        description='Apabila terdapat kesalahan pada data yang belum dibayarkan, dan
            ingin dilakukan perubahan atau penghapusan data dapat menghubungi
            Sdr. Arfan Saragih : 0813-7577-4567'
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-2'
          >
            <FormField
              control={form.control}
              name='nik'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='dark:text-gray-200'>
                    Masukkan NIK
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='NIK'
                      {...field}
                      className='dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type='submit'
              className='mt-2 rounded-lg bg-indigo-500 px-4 py-2 text-white shadow transition-colors hover:bg-indigo-600 sm:mt-6 sm:ml-2 dark:bg-indigo-600 dark:hover:bg-indigo-700'
            >
              Cari
            </button>
          </form>
        </Form>

        {/* Table */}
        <div className='max-h-[300px] overflow-y-auto'>
          <PengembalianDanaTable data={pengembalianData} />
        </div>
      </DialogContentLarge>
    </Dialog>
  )
}
