'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePostSpdTerkirim,
  usePutSpdTerkirim,
  type SpdTerkirim,
  useUsersQuery,
  type Users,
} from '@/api'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  id: z.string().optional(),
  nama_file: z.string().min(1, 'Permohonan SPD Harus Ada.'),
  nama_file_asli: z
    .any()
    .refine(
      (val) =>
        (val instanceof FileList &&
          val.length > 0 &&
          val[0].type === 'application/pdf') ||
        (typeof val === 'string' && val.trim() !== ''),
      'File harus PDF atau sudah ada file sebelumnya.'
    ),
  id_operator: z.string().min(1, 'operator Harus Ada.'),
  nama_operator: z.string().min(1, 'operator Harus Ada.'),
  kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
  kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
  id_penerima: z.string().min(1, 'Penerima SPD Harus Ada.'),
  nama_penerima: z.string().min(1, 'Penerima SPD Harus Ada.'),
  keterangan: z.string().min(1, 'Keterangan SPD Harus Ada.'),
  penerima_skpd: z.string().min(1, 'Penerima SKPD Harus Ada.'),
})
type SpdTerkirimForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: SpdTerkirim
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermohonanDiterimaActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const user = useAuthStore((s) => s.user)
  const { mutateAsync: postSPDTerkirimAsync } = usePostSpdTerkirim()
  const { mutateAsync: putSPDTerkirimAsync } = usePutSpdTerkirim()

  const {
    data: dataUsers,
    isLoading: isloadingUsers,
    isError: isErrorUsers,
  } = useUsersQuery({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // Ambil data dari response
  const ItemsUsersAndSKPD =
    dataUsers?.data?.map((item: Users) => ({
      // Gabungkan kd_opd1...5 jadi satu string
      value: [
        item.id,
        item.name,
        item.kd_opd1,
        item.kd_opd2,
        item.kd_opd3,
        item.kd_opd4,
        item.kd_opd5,
      ]
        .filter(Boolean)
        .join('-'), // hasil: "00-01-01-02-03"

      // Gabungkan nama dan nama OPD
      label: `${item.name} - ${item.skpd?.nm_opd ?? ''}`,
    })) ?? []

  const form = useForm<SpdTerkirimForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      id: '',
      nama_file: '',
      nama_file_asli: undefined,
      id_penerima: '',
      nama_penerima: '',
      id_operator: user?.id.toString(),
      nama_operator: user?.name,
      kd_opd1: '',
      kd_opd2: '',
      kd_opd3: '',
      kd_opd4: '',
      kd_opd5: '',
      keterangan: '',
    },
  })
  const fileRef = form.register('nama_file_asli')

  const onSubmit = async (data: SpdTerkirimForm) => {
    const formData = new FormData()
    formData.append('nama_file', data.nama_file ?? '')
    formData.append('id_operator', data.id_operator ?? '')
    formData.append('nama_operator', data.nama_operator ?? '')
    formData.append('id_penerima', data.id_penerima ?? '')
    formData.append('nama_penerima', data.nama_penerima ?? '')
    formData.append('kd_opd1', data.kd_opd1 ?? '')
    formData.append('kd_opd2', data.kd_opd2 ?? '')
    formData.append('kd_opd3', data.kd_opd3 ?? '')
    formData.append('kd_opd4', data.kd_opd4 ?? '')
    formData.append('kd_opd5', data.kd_opd5 ?? '')
    formData.append('keterangan', data.keterangan ?? '')
    formData.append('status', '0')

    // ✅ Jika user upload file baru
    if (
      data.nama_file_asli instanceof FileList &&
      data.nama_file_asli.length > 0
    ) {
      formData.append('nama_file_asli', data.nama_file_asli[0])
    }
    const requestPromise = isEdit
      ? putSPDTerkirimAsync(formData)
      : postSPDTerkirimAsync(formData)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data Permohonan SPD berhasil diperbarui!'
          : 'Data Permohonan SPD berhasil ditambahkan!'
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
          <DialogTitle> {isEdit ? 'Edit SPD' : 'Tambah Baru SPD'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Perbarui SPD disini. ' : 'Tambah baru SPD disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='PermohonanSPD-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='penerima_skpd'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih SKPD
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            disabled={isErrorUsers || isloadingUsers}
                            className='col-span-4 justify-between truncate text-left'
                            title={
                              field.value
                                ? ItemsUsersAndSKPD.find(
                                    (item) => item.value === field.value
                                  )?.label
                                : undefined
                            }
                          >
                            {isloadingUsers ? (
                              <div className='flex items-center gap-2'>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Memuat data...
                              </div>
                            ) : field.value ? (
                              ItemsUsersAndSKPD.find(
                                (item) => item.value === field.value
                              )?.label
                            ) : (
                              'Pilih SKPD'
                            )}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent
                        className='col-span-4 w-[400px] p-0'
                        onWheelCapture={(e) => e.stopPropagation()}
                      >
                        <Command>
                          <CommandInput placeholder='Cari SKPD...' />
                          <CommandEmpty>SKPD tidak ditemukan.</CommandEmpty>

                          <div className='max-h-[300px] overflow-y-auto'>
                            <CommandGroup>
                              {ItemsUsersAndSKPD.map((item) => (
                                <CommandItem
                                  key={item.value}
                                  value={item.value}
                                  className='text-left break-words whitespace-normal'
                                  onSelect={(value) => {
                                    const parts = value.split('-')
                                    field.onChange(value)
                                    form.setValue('id_penerima', parts[0] ?? '')
                                    form.setValue(
                                      'nama_penerima',
                                      parts[1] ?? ''
                                    )
                                    form.setValue('kd_opd1', parts[2] ?? '')
                                    form.setValue('kd_opd2', parts[3] ?? '')
                                    form.setValue('kd_opd3', parts[4] ?? '')
                                    form.setValue('kd_opd4', parts[5] ?? '')
                                    form.setValue('kd_opd5', parts[6] ?? '')
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      field.value === item.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    }`}
                                  />
                                  {item.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </div>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nama_file'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Permohonan SPD
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Permohonan SPD'
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
                name='nama_file_asli'
                render={() => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                    {/* Label di sisi kiri */}
                    <FormLabel className='col-span-2 text-end'>
                      Upload File
                    </FormLabel>

                    {/* Input file */}
                    <div className='col-span-4 flex flex-col'>
                      <FormControl>
                        <Input
                          type='file'
                          {...fileRef}
                          className='file:bg-primary hover:file:bg-primary/90 h-9 px-3 py-1 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1 file:text-gray-500'
                        />
                      </FormControl>

                      {/* Pesan error di bawah input */}
                      <FormMessage className='mt-1 text-xs text-red-500' />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='keterangan'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Keterangan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Keterangan'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='PermohonanSPD-form'>
            Kirim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
