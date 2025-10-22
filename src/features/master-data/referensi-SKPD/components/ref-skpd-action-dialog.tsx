'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostRefSKPD, usePutRefMasterSkpd, type MasterSkpd } from '@/api'
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
import { SelectDropdown } from '@/components/select-dropdown'

const status = [
  {
    value: '1',
    label: 'Aktif',
  },
  {
    value: '0',
    label: 'Tidak Aktif',
  },
]

const formSchema = z.object({
  kd_opd1: z.string().min(1, 'Kode SKPD Ke - 1 Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Ke - 2 Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Ke - 3 Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Ke - 4 Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Ke - 5 Harus Ada.'),
  nm_opd: z.string().min(1, 'Nama SKPD Harus Ada.'),
  status_penerimaan: z.string().min(1, 'Status Penerimaan Harus Ada.'),
})
type SKPDForm = z.infer<typeof formSchema>

type SKPDActionDialogProps = {
  currentRow?: MasterSkpd
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SKPDsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: SKPDActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postRefSKPDAsync } = usePostRefSKPD()
  const { mutateAsync: putRefSKPDAsync } = usePutRefMasterSkpd()

  const form = useForm<SKPDForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      kd_opd1: '',
      kd_opd2: '',
      kd_opd3: '',
      kd_opd4: '',
      kd_opd5: '',
      nm_opd: '',
      status_penerimaan: '',
    },
  })

  const onSubmit = async (data: SKPDForm) => {
    const requestPromise = isEdit
      ? putRefSKPDAsync(data)
      : postRefSKPDAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data SKPD berhasil diperbarui!'
          : 'Data SKPD berhasil ditambahkan!'
      },
      error: (err) => {
        const message =
          err?.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan data.'
        return message
      },
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
          <DialogTitle>{isEdit ? 'Edit SKPD' : 'Tambah Baru SKPD'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui data SKPD di sini. '
              : 'Buat SKPD baru di sini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='SKPD-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kd_opd1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode SKPD 1
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode SKPD ke - 1'
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
                name='kd_opd2'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode SKPD 2
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode SKPD ke - 2'
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
                name='kd_opd3'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode SKPD 3
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode SKPD ke - 3'
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
                name='kd_opd4'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode SKPD 4
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode SKPD ke - 4'
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
                name='kd_opd5'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Kode SKPD 5
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Kode SKPD ke - 5'
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
                name='nm_opd'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama SKPD
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Nama SKPD'
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
                name='status_penerimaan'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Status Penerimaan
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value ?? '')}
                      onValueChange={(val) => field.onChange(val)}
                      placeholder='Pilih Status Penerimaan SKPD'
                      className='col-span-4'
                      items={status.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='SKPD-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
