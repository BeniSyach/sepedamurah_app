'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type MasterSkpd,
  useGetRefSKPD,
  type Users,
  useUsersQuery,
  type AksesKuasaBud,
  usePostAksesKuasaBud,
  usePutAksesKuasaBud,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  id: z.string().optional(),
  id_kbud: z.string().min(1, 'Role Harus Ada.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
})
type AksesKuasaBUDForm = z.infer<typeof formSchema>

type AksesKuasaBUDActionDialogProps = {
  currentRow?: AksesKuasaBud
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AksesKuasaBUDsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: AksesKuasaBUDActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: postAksesKuasaBUDAsync } = usePostAksesKuasaBud()
  const { mutateAsync: putAksesKuasaBUDAsync } = usePutAksesKuasaBud()

  const { data, isLoading, isError } = useUsersQuery({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // Ambil data dari response
  const items =
    data?.data?.map((item: Users) => ({
      value: item.id?.toString() ?? '',
      label: item.name ?? '',
    })) ?? []

  // Kalau error, bisa fallback ke array kosong
  const safeItems = isError ? [] : items

  const {
    data: dataSKPD,
    isLoading: isLoadingSKPD,
    isError: isErrorSKPD,
  } = useGetRefSKPD({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // Ambil data dari response
  const itemsSKPD =
    dataSKPD?.data?.map((item: MasterSkpd) => ({
      // Gabungkan kd_opd1...5 menjadi satu string
      value: [
        item.kd_opd1,
        item.kd_opd2,
        item.kd_opd3,
        item.kd_opd4,
        item.kd_opd5,
      ]
        .filter(Boolean) // hilangkan undefined/null jika ada
        .join('-'), // hasil: "00-01-01-02-03"

      label: item.nm_opd ?? '',
    })) ?? []

  // Kalau error, bisa fallback ke array kosong
  const safeItemsSKPD = isErrorSKPD ? [] : itemsSKPD

  const form = useForm<AksesKuasaBUDForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow?.id ?? '',
          id_kbud: currentRow?.id_kbud ?? '',
          kd_opd1: currentRow?.kd_opd1 ?? '',
          kd_opd2: currentRow?.kd_opd2 ?? '',
          kd_opd3: currentRow?.kd_opd3 ?? '',
          kd_opd4: currentRow?.kd_opd4 ?? '',
          kd_opd5: currentRow?.kd_opd5 ?? '',
        }
      : {
          id: '',
          id_kbud: '',
          kd_opd1: '',
          kd_opd2: '',
          kd_opd3: '',
          kd_opd4: '',
          kd_opd5: '',
        },
  })

  const onSubmit = async (data: AksesKuasaBUDForm) => {
    const requestPromise = isEdit
      ? putAksesKuasaBUDAsync(data)
      : postAksesKuasaBUDAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Akses KuasaBUD berhasil diperbarui!'
          : 'Data Akses KuasaBUD berhasil ditambahkan!'
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
          <DialogTitle>
            {isEdit ? 'Edit Akses Kuasa BUD' : 'Tambah Baru Akses Kuasa BUD'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui Akses Kuasa BUD disini. '
              : 'Tambah baru Akses Kuasa BUD disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='AksesKuasaBUD-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='id_kbud'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih Kuasa BUD
                    </FormLabel>

                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih Kuasa BUD'
                      className='col-span-4 w-full'
                      isPending={isLoading}
                      items={safeItems}
                      disabled={isError}
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='kd_opd1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih SKPD
                    </FormLabel>

                    <SelectDropdown
                      // 💡 Gunakan gabungan kode SKPD sebagai default value
                      defaultValue={
                        [
                          form.getValues('kd_opd1'),
                          form.getValues('kd_opd2'),
                          form.getValues('kd_opd3'),
                          form.getValues('kd_opd4'),
                          form.getValues('kd_opd5'),
                        ]
                          .filter(Boolean)
                          .join('-') || undefined
                      }
                      onValueChange={(value) => {
                        const parts = value.split('-')
                        form.setValue('kd_opd1', parts[0] ?? '')
                        form.setValue('kd_opd2', parts[1] ?? '')
                        form.setValue('kd_opd3', parts[2] ?? '')
                        form.setValue('kd_opd4', parts[3] ?? '')
                        form.setValue('kd_opd5', parts[4] ?? '')
                        field.onChange(parts[0])
                      }}
                      placeholder='Pilih SKPD'
                      className='col-span-4 w-full'
                      isPending={isLoadingSKPD}
                      items={safeItemsSKPD}
                      disabled={isErrorSKPD}
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='AksesKuasaBUD-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
