'use client'

import { z } from 'zod'
import { format } from 'date-fns'
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
import { DatePicker } from '@/components/date-picker'

// === Schema hanya tahun ===
const formSchema = z
  .object({
    tanggal_awal: z.date('Tanggal awal wajib diisi'),
    tanggal_akhir: z.date('Tanggal akhir wajib diisi'),
  })
  .refine(
    (data) => data.tanggal_awal <= data.tanggal_akhir,
    'Tanggal awal tidak boleh lebih besar dari tanggal akhir'
  )

type TahunForm = z.infer<typeof formSchema>

type TahunDialogProps = {
  currentRow?: Pengembalian
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PengembalianRekapExcel({
  open,
  onOpenChange,
}: TahunDialogProps) {
  const form = useForm<TahunForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggal_awal: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ),
      tanggal_akhir: new Date(),
    },
  })

  const onSubmit = async (values: TahunForm) => {
    await toast.promise(
      (async () => {
        const tanggal_awal = format(values.tanggal_awal, 'yyyy-MM-dd')
        const tanggal_akhir = format(values.tanggal_akhir, 'yyyy-MM-dd')
        const response = await api.get('/pengembalian/rekap/excel', {
          responseType: 'blob',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
          params: {
            start_date: tanggal_awal,
            end_date: tanggal_akhir,
            t: Date.now(),
          },
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Pengembalian.xlsx')
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
              id='tanggal-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              {/* === Tanggal Awal === */}
              <FormField
                control={form.control}
                name='tanggal_awal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Awal</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        placeholder='Pilih tanggal awal'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* === Tanggal Akhir === */}
              <FormField
                control={form.control}
                name='tanggal_akhir'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Akhir</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        placeholder='Pilih tanggal akhir'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='tanggal-form'>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
