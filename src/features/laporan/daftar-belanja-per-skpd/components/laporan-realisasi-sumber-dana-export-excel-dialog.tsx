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
})

type TahunForm = z.infer<typeof formSchema>

type TahunDialogProps = {
  currentRow?: Pengembalian
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RekapExcelLRASD({
  currentRow,
  open,
  onOpenChange,
}: TahunDialogProps) {
  const form = useForm<TahunForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tahun:
        currentRow?.tahun?.toString() || new Date().getFullYear().toString(),
    },
  })

  const onSubmit = async (values: TahunForm) => {
    await toast.promise(
      (async () => {
        const response = await api.get(
          `/laporan/realisasi-sumber-dana/download/excel/${values.tahun}`,
          {
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            params: {
              t: Date.now(), // tambahkan query timestamp supaya cache benar-benar dilewati
            },
          }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'LRA-SUMBER-DANA.xlsx')
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
          <DialogTitle>Pilih Tahun</DialogTitle>
          <DialogDescription>
            Masukkan tahun untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>

        <div className='py-2'>
          <Form {...form}>
            <form
              id='tahun-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
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
