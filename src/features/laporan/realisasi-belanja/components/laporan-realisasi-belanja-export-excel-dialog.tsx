'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Pengembalian } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// === Schema hanya tahun ===
const formSchema = z.object({
  tahun: z
    .string()
    .min(4, 'Tahun harus terdiri dari 4 digit.')
    .max(4, 'Tahun harus terdiri dari 4 digit.')
    .regex(/^\d{4}$/, 'Tahun hanya boleh berisi angka.'),
  bulan: z
    .string()
    .min(1, 'Bulan wajib dipilih.')
    .regex(/^(0?[1-9]|1[0-2])$/, 'Bulan tidak valid.'),
})

type TahunForm = z.infer<typeof formSchema>

type TahunDialogProps = {
  currentRow?: Pengembalian
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RekapExcelLRABelanja({
  currentRow,
  open,
  onOpenChange,
}: TahunDialogProps) {
  const form = useForm<TahunForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tahun:
        currentRow?.tahun?.toString() || new Date().getFullYear().toString(),
      bulan: (new Date().getMonth() + 1).toString(), // default bulan sekarang
    },
  })

  const onSubmit = async (values: TahunForm) => {
    await toast.promise(
      (async () => {
        const response = await api.get(
          `/pengembalian/rekap/excel/${values.tahun}/${values.bulan}`,
          {
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            params: {
              tahun: values.tahun,
              bulan: values.bulan,
              t: Date.now(), // tambahan biar cache dihindari
            },
          }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'LRA-BELANJA.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()
      })(),
      {
        loading: 'Mengunduh file...',
        success: 'File berhasil diunduh!',
        error: 'Gagal mengunduh file.',
      }
    )
    form.reset()
    onOpenChange(false)
  }

  const months = [
    { label: 'Januari', value: '1' },
    { label: 'Februari', value: '2' },
    { label: 'Maret', value: '3' },
    { label: 'April', value: '4' },
    { label: 'Mei', value: '5' },
    { label: 'Juni', value: '6' },
    { label: 'Juli', value: '7' },
    { label: 'Agustus', value: '8' },
    { label: 'September', value: '9' },
    { label: 'Oktober', value: '10' },
    { label: 'November', value: '11' },
    { label: 'Desember', value: '12' },
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>Pilih Tahun & Bulan</DialogTitle>
          <DialogDescription>
            Pilih tahun dan bulan untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>

        <div className='py-2'>
          <Form {...form}>
            <form
              id='tahun-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              {/* === Select Tahun === */}
              <FormField
                control={form.control}
                name='tahun'
                render={({ field }) => {
                  const currentYear = new Date().getFullYear()
                  const years = Array.from({ length: 5 }, (_, i) =>
                    (currentYear - i).toString()
                  )

                  return (
                    <FormItem className='w-full'>
                      <FormLabel>Tahun</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Pilih tahun' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='w-full'>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              {/* === Select Bulan === */}
              <FormField
                control={form.control}
                name='bulan'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Bulan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Pilih bulan' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='w-full'>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='tahun-form'>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
