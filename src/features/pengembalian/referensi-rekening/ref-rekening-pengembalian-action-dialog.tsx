'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostDatRekening,
  usePutDatRekening,
  type DatRekeningItem,
} from '@/api'
import { toast } from 'sonner'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  kd_rek1: z.string().length(1, 'Kode Rekening 1 harus 1 karakter'),
  kd_rek2: z.string().length(1, 'Kode Rekening 2 harus 1 karakter'),
  kd_rek3: z.string().length(1, 'Kode Rekening 3 harus 1 karakter'),
  kd_rek4: z.string().length(2, 'Kode Rekening 4 harus 2 karakter'),
  kd_rek5: z
    .string()
    .length(2, 'Kode Rekening 5 harus 2 karakter')
    .or(z.literal('')),
  kd_rek6: z
    .string()
    .length(3, 'Kode Rekening 6 harus 3 karakter')
    .or(z.literal('')),
  nm_rekening: z.string().min(1, 'Nama Rekening wajib diisi'),
  tahun_rek: z.string().min(4, 'Tahun Rekening wajib dipilih'),
  status_rek: z.string().min(1, 'Status wajib diisi'),
})

type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: DatRekeningItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

const currentYear = new Date().getFullYear()

const tahunOptions = Array.from({ length: 7 }, (_, i) =>
  String(currentYear - 3 + i)
)

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: postDatRekeningItemAsync } = usePostDatRekening()
  const { mutateAsync: putDatRekeningItemAsync } = usePutDatRekening()

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          kd_rek1: currentRow.kd_rek1,
          kd_rek2: currentRow.kd_rek2,
          kd_rek3: currentRow.kd_rek3,
          kd_rek4: currentRow.kd_rek4,
          kd_rek5: currentRow.kd_rek5,
          kd_rek6: currentRow.kd_rek6,
          nm_rekening: currentRow.nm_rekening,
          tahun_rek: currentRow.tahun_rek,
          status_rek: currentRow.status_rek,
        }
      : {
          kd_rek1: '',
          kd_rek2: '',
          kd_rek3: '',
          kd_rek4: '',
          kd_rek5: '',
          kd_rek6: '',
          nm_rekening: '',
          tahun_rek: String(currentYear),
          status_rek: '', // default Aktif
        },
  })

  const onSubmit = async (data: UserForm) => {
    const payload = {
      kd_rek1: data.kd_rek1,
      kd_rek2: data.kd_rek2,
      kd_rek3: data.kd_rek3,
      kd_rek4: data.kd_rek4,
      kd_rek5: data.kd_rek5,
      kd_rek6: data.kd_rek6,
      nm_rekening: data.nm_rekening,
      tahun_rek: data.tahun_rek,
      status_rek: data.status_rek,
    }

    const requestPromise = isEdit
      ? putDatRekeningItemAsync(payload)
      : postDatRekeningItemAsync(payload)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan rekening...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data rekening berhasil diperbarui'
          : 'Data rekening berhasil ditambahkan'
      },
      error: (err) =>
        err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data',
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
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit
              ? 'Edit Realisasi Transfer Sumber Dana'
              : 'Tambah Baru Realisasi Transfer Sumber Dana'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Realisasi Transfer Sumber Dana disini. '
              : 'Tambah baru Realisasi Transfer Sumber Dana disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='ref-rekening-pengembalian-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='tahun_rek'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun Rekening</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih tahun rekening' />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {tahunOptions.map((tahun) => (
                          <SelectItem key={tahun} value={tahun}>
                            {tahun}
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
                name='kd_rek1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Rekening 1</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Kode Rekening 1'
                        maxLength={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='kd_rek2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Rekening 2</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Kode Rekening 2'
                        maxLength={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='kd_rek3'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Rekening 3</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Kode Rekening 3'
                        maxLength={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='kd_rek4'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Rekening 4</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Kode Rekening 4'
                        maxLength={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='kd_rek5'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Rekening 5</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Kode Rekening 5'
                        maxLength={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='kd_rek6'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Rekening 6</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Kode Rekening 6'
                        maxLength={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nm_rekening'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Rekening</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder='Nama Rekening' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status_rek'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Rekening</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih status rekening' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>Aktif</SelectItem>
                        <SelectItem value='0'>Tidak Aktif</SelectItem>
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
          <Button type='submit' form='ref-rekening-pengembalian-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
