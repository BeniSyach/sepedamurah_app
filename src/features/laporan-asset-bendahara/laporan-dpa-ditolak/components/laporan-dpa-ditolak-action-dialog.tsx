'use client'

import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useGetRefAssetBendahara,
  usePostLaporanAssetBendahara,
  usePutLaporanAssetBendahara,
  type LaporanAssetBendahara,
} from '@/api'
import { CheckIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  id: z.string().optional(),
  tahun: z.string().min(1, 'Tahun Harus Ada.'),

  ref_asset_id: z.string().min(1, 'Asset Bendahara harus dipilih.'),

  file: z
    .any()
    .refine(
      (val) =>
        (val instanceof FileList &&
          val.length > 0 &&
          val[0].type === 'application/pdf') ||
        typeof val === 'string',
      'File harus PDF atau file sebelumnya dipertahankan.'
    ),

  kd_opd1: z.string().min(1),
  kd_opd2: z.string().min(1),
  kd_opd3: z.string().min(1),
  kd_opd4: z.string().min(1),
  kd_opd5: z.string().min(1),

  user_id: z.string().min(1),
})
type LaporanAssetBendaharaForm = z.infer<typeof formSchema>

type LaporanAssetBendaharaActionDialogProps = {
  currentRow?: LaporanAssetBendahara
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Ambil tahun sekarang
const currentYear = new Date().getFullYear()

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: LaporanAssetBendaharaActionDialogProps) {
  const isEdit = !!currentRow
  const user = useAuthStore((s) => s.user)
  // Buat array tahun: 3 tahun ke belakang sampai 3 tahun ke depan
  const years = useMemo(() => {
    const arr = []
    for (let y = currentYear - 3; y <= currentYear + 3; y++) {
      arr.push({
        label: y.toString(),
        value: y.toString(),
      })
    }
    return arr
  }, [currentYear])

  /* API */
  const { mutateAsync: postAsync } = usePostLaporanAssetBendahara()
  const { mutateAsync: putAsync } = usePutLaporanAssetBendahara()
  const { data: dataDPA } = useGetRefAssetBendahara({ page: 1, perPage: 9999 })

  /* Form */
  const form = useForm<LaporanAssetBendaharaForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id.toString(),
          tahun: currentRow.tahun,
          ref_asset_id: currentRow.ref_asset_id?.toString(),
          file: currentRow.file,

          kd_opd1: currentRow.kd_opd1,
          kd_opd2: currentRow.kd_opd2,
          kd_opd3: currentRow.kd_opd3,
          kd_opd4: currentRow.kd_opd4,
          kd_opd5: currentRow.kd_opd5,
          user_id: currentRow.user?.id.toString(),
        }
      : {
          id: '',
          tahun: currentYear.toString(),
          ref_asset_id: '',
          file: undefined,

          kd_opd1: user?.kd_opd1 ?? '',
          kd_opd2: user?.kd_opd2 ?? '',
          kd_opd3: user?.kd_opd3 ?? '',
          kd_opd4: user?.kd_opd4 ?? '',
          kd_opd5: user?.kd_opd5 ?? '',
          user_id: user?.id.toString() ?? '',
        },
  })

  const fileRef = form.register('file')

  /* Submit Handler */
  const onSubmit = async (data: LaporanAssetBendaharaForm) => {
    const fd = new FormData()

    Object.entries(data).forEach(([key, val]) => {
      if (key !== 'file') fd.append(key, val as string)
    })

    if (data.file instanceof FileList && data.file.length > 0) {
      fd.append('file', data.file[0])
    }

    const promise = isEdit ? putAsync(fd) : postAsync(fd)

    await toast.promise(promise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data berhasil diperbarui!'
          : 'Data berhasil ditambahkan!'
      },
      error: (err) =>
        err?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data.',
    })
  }

  const listDPA = dataDPA?.data ?? []

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
            {isEdit ? 'Edit Asset Bendahara' : 'Tambah Asset Bendahara'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui data Asset Bendahara.'
              : 'Tambahkan Asset Bendahara baru.'}
          </DialogDescription>
        </DialogHeader>

        <div className='h-[26rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='form-laporan-dpa'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              {/* TAHUN */}
              <FormField
                control={form.control}
                name='tahun'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-3'>
                    <FormLabel className='col-span-2 text-end'>Tahun</FormLabel>

                    <SelectDropdown
                      className='col-span-4'
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      items={years}
                      placeholder='Pilih Tahun'
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* DPA */}
              <FormField
                control={form.control}
                name='ref_asset_id'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih Asset bendahara
                    </FormLabel>

                    {/* ➜ Tambahkan col-span-4 disini agar dropdown lebar */}
                    <div className='col-span-4'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className={cn(
                                'min-h-[2.5rem] w-full justify-between', // tambahkan w-full
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <span className='truncate'>
                                {field.value
                                  ? listDPA.find(
                                      (d) =>
                                        String(d.id) === String(field.value)
                                    )?.nm_asset_bendahara
                                  : 'Pilih Jenis Asset Bendahara'}
                              </span>
                              <CaretSortIcon className='h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent
                          align='start'
                          className='w-[var(--radix-popover-trigger-width)] p-0'
                        >
                          <Command>
                            <CommandInput placeholder='Cari DPA...' />
                            <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                            <CommandGroup>
                              <CommandList>
                                {listDPA.map((d) => (
                                  <CommandItem
                                    key={d.id}
                                    value={d.nm_asset_bendahara}
                                    onSelect={() =>
                                      form.setValue(
                                        'ref_asset_id',
                                        String(d.id)
                                      )
                                    }
                                  >
                                    <CheckIcon
                                      className={cn(
                                        'size-4',
                                        String(d.id) === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {d.nm_asset_bendahara}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {/* FILE */}
              <FormField
                control={form.control}
                name='file'
                render={() => (
                  <FormItem className='grid grid-cols-6 items-center gap-3'>
                    <FormLabel className='col-span-2 text-end'>
                      File PDF
                    </FormLabel>

                    <div className='col-span-4'>
                      <FormControl>
                        <Input
                          type='file'
                          {...fileRef}
                          accept='application/pdf'
                          className='h-9 file:px-3 file:py-1'
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='form-laporan-dpa'>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
