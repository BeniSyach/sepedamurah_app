'use client'

import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CheckSumberDana,
  useGetCheckSumberDana,
  type Sp2dItem,
} from '@/api'
import { CheckIcon, Trash2, Plus, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { usePutSp2DSumberDana } from '@/api/sp2d/permohonan-sp2d/use-put-sumber-dana-sp2d'
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

/* =======================
   SCHEMA
======================= */
const schema = z.object({
  id: z.string().min(1),
  nilai_belanja: z.number(),
  sumber_dana: z.array(
    z.object({
      kode: z.string().min(1, 'Sumber dana wajib dipilih'),
      nilai: z.number().min(0, 'Nilai tidak boleh minus'),
    })
  ),
})

type FormValues = z.infer<typeof schema>

/* =======================
   COMPONENT
======================= */
export function EditSumberDanaDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Sp2dItem
}) {
  const { mutateAsync: put } = usePutSp2DSumberDana()

  /* ===== Fetch sumber dana ===== */
  const { data } = useGetCheckSumberDana({
    tahun: new Date().getFullYear().toString(),
  })

  const sumberDanaRefs =
    data?.data?.map((item: CheckSumberDana) => ({
      kode: `${item.kd_ref1}.${item.kd_ref2}.${item.kd_ref3}.${item.kd_ref4}.${item.kd_ref5}.${item.kd_ref6}`,
      nama: item.nm_sumber,
      sisa: Number(item.sisa || 0),
      jenis: item.jenis_sumber_dana,
    })) ?? []

  const getJenisByKode = (kode?: string) =>
    sumberDanaRefs.find((x) => x.kode === kode)?.jenis

  /* ===== Form ===== */
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: currentRow.id_sp2d ?? '',
      nilai_belanja: Number(currentRow.nilai_belanja ?? 0),
      sumber_dana: currentRow.sumber_dana?.map((s) => ({
        kode: `${s.kd_ref1}.${s.kd_ref2}.${s.kd_ref3}.${s.kd_ref4}.${s.kd_ref5}.${s.kd_ref6}`,
        nilai: Number(s.nilai ?? 0),
      })) ?? [{ kode: '', nilai: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sumber_dana',
  })

  const sumberDana = form.watch('sumber_dana')
  const nilaiBelanja = form.watch('nilai_belanja')

  const total = sumberDana.reduce((a, b) => a + Number(b.nilai || 0), 0)
  const sisaBelanja = nilaiBelanja - total
  const isCukup = sisaBelanja <= 0

  const hasKhusus = sumberDana.some((s) => getJenisByKode(s.kode) === 'KHUSUS')

  /* ===== Submit ===== */
  const onSubmit = async (values: FormValues) => {
    if (total !== nilaiBelanja) {
      toast.error('Nilai belanja belum terpenuhi')
      return
    }

    const formData = new FormData()
    formData.append('id', values.id)

    formData.append(
      'sumber_dana',
      JSON.stringify(
        values.sumber_dana.map((s) => {
          const [kd_ref1, kd_ref2, kd_ref3, kd_ref4, kd_ref5, kd_ref6] =
            s.kode.split('.')
          return {
            kd_ref1,
            kd_ref2,
            kd_ref3,
            kd_ref4,
            kd_ref5,
            kd_ref6,
            nilai: s.nilai,
          }
        })
      )
    )

    await toast.promise(put(formData), {
      loading: 'Menyimpan sumber dana...',
      success: () => {
        onOpenChange(false)
        return 'Sumber dana berhasil diperbarui'
      },
      error: 'Gagal memperbarui sumber dana',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Edit Sumber Dana SP2D</DialogTitle>
          <DialogDescription>
            Pastikan nilai sumber dana memenuhi nilai belanja
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='edit-sumber-dana-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {/* ===== Ringkasan ===== */}
            <div className='rounded-md border p-3 text-sm'>
              <p>
                Nilai Belanja: <b>Rp {nilaiBelanja.toLocaleString('id-ID')}</b>
              </p>
              <p>
                Total Sumber Dana: <b>Rp {total.toLocaleString('id-ID')}</b>
              </p>
            </div>

            {/* ===== List ===== */}
            {fields.map((row, index) => {
              return (
                <div key={row.id} className='space-y-2 rounded-md border p-3'>
                  {/* ===== Sumber Dana ===== */}
                  <FormField
                    control={form.control}
                    name={`sumber_dana.${index}.kode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sumber Dana</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className='w-full max-w-[100%] justify-between truncate'
                              >
                                {field.value
                                  ? sumberDanaRefs.find(
                                      (x) => x.kode === field.value
                                    )?.nama
                                  : 'Pilih sumber dana'}
                                <ChevronsUpDown className='h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className='p-0'>
                            <Command>
                              <CommandInput placeholder='Cari...' />
                              <CommandList>
                                <CommandEmpty>Tidak ada data</CommandEmpty>
                                <CommandGroup>
                                  {sumberDanaRefs.map((item) => (
                                    <CommandItem
                                      key={item.kode}
                                      disabled={
                                        (item.jenis === 'KHUSUS' &&
                                          sumberDana.length > 1) ||
                                        (hasKhusus &&
                                          getJenisByKode(field.value) !==
                                            'KHUSUS')
                                      }
                                      onSelect={() => {
                                        if (
                                          item.jenis === 'KHUSUS' &&
                                          sumberDana.length > 1
                                        ) {
                                          toast.error(
                                            'Sumber dana KHUSUS harus berdiri sendiri'
                                          )
                                          return
                                        }

                                        if (
                                          hasKhusus &&
                                          getJenisByKode(field.value) !==
                                            'KHUSUS'
                                        ) {
                                          toast.error(
                                            'Sumber dana KHUSUS tidak boleh digabung'
                                          )
                                          return
                                        }

                                        const kebutuhan =
                                          nilaiBelanja -
                                          (total -
                                            Number(
                                              form.getValues(
                                                `sumber_dana.${index}.nilai`
                                              ) || 0
                                            ))

                                        field.onChange(item.kode)

                                        form.setValue(
                                          `sumber_dana.${index}.nilai`,
                                          Math.min(item.sisa, kebutuhan),
                                          { shouldValidate: true }
                                        )
                                      }}
                                    >
                                      <div className='flex w-full justify-between'>
                                        <span>{item.nama}</span>
                                        <span className='text-muted-foreground text-xs'>
                                          Sisa Rp{' '}
                                          {item.sisa.toLocaleString('id-ID')}
                                        </span>
                                      </div>
                                      {item.jenis === 'KHUSUS' && (
                                        <span className='ml-2 text-xs text-red-600'>
                                          KHUSUS
                                        </span>
                                      )}
                                      {field.value === item.kode && (
                                        <CheckIcon className='ml-2 h-4 w-4' />
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  {/* ===== Nilai ===== */}
                  <FormField
                    control={form.control}
                    name={`sumber_dana.${index}.nilai`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nilai</FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            value={`Rp ${Number(
                              field.value || 0
                            ).toLocaleString('id-ID')}`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* ===== Hapus ===== */}
                  {fields.length > 1 && (
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='mr-1 h-4 w-4' />
                      Hapus
                    </Button>
                  )}
                </div>
              )
            })}

            {/* ===== Tambah ===== */}
            <Button
              type='button'
              variant='outline'
              disabled={isCukup || hasKhusus}
              onClick={() => {
                if (hasKhusus) {
                  toast.error('Sumber dana KHUSUS tidak boleh ditambah')
                  return
                }
                append({ kode: '', nilai: 0 })
              }}
            >
              <Plus className='mr-1 h-4 w-4' />
              Tambah Sumber Dana
            </Button>

            <FormMessage />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='edit-sumber-dana-form'>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
