/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useGetRefBidangUrusanSp2d } from '@/api'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ProgramSection } from './program-section'

export function BidangUrusanSection({
  control,
  indexUrusan,
  indexBidang,
  removeBidang,
}: any) {
  const userRole = localStorage.getItem('user_role') ?? ''
  const { setValue, getValues, watch } = useFormContext()
  const kd_urusan = watch(`urusan.${indexUrusan}.kd_urusan`)
  const kd_bu1 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.kd_bu1`
  )
  const kd_bu2 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.kd_bu2`
  )

  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program`,
  })

  // 🔥 Ambil bidang urusan berdasarkan kd_urusan
  const { data, isPending, isError } = useGetRefBidangUrusanSp2d({
    page: 1,
    perPage: 100,
    kd_urusan: kd_urusan,
    role: userRole,
  })

  const bidangOptions =
    data?.data?.map((item: any) => ({
      value: [item.kd_bu1, item.kd_bu2].filter(Boolean).join('.'),
      label: item.nm_bu,
      kd_bu1: item.kd_bu1,
      kd_bu2: item.kd_bu2,
    })) ?? []

  return (
    <div className='mt-3 ml-4 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.kd_bu2`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel className='font-medium'>Bidang Urusan</FormLabel>
              <Button
                type='button'
                size='icon'
                variant='destructive'
                className='h-5 w-5'
                onClick={removeBidang}
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>
            <FormControl>
              {isPending ? (
                <Skeleton className='h-9 w-full' />
              ) : isError ? (
                <div className='text-sm text-red-500'>
                  Gagal memuat data bidang urusan
                </div>
              ) : (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val)
                    const selected = bidangOptions.find((b) => b.value === val)

                    // Set nilai bidang urusan di form
                    setValue(
                      `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.kd_bu1`,
                      selected?.kd_bu1 ?? ''
                    )
                    setValue(
                      `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.kd_bu2`,
                      selected?.kd_bu2 ?? ''
                    )
                    setValue(
                      `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.nm_bu`,
                      selected?.label ?? ''
                    )
                  }}
                  value={
                    bidangOptions.find(
                      (b) => b.kd_bu1 === kd_bu1 && b.kd_bu2 === kd_bu2
                    )?.value || ''
                  }
                >
                  <SelectTrigger className='min-h-[44px] break-words whitespace-normal'>
                    <SelectValue placeholder='Pilih Bidang Urusan' />
                  </SelectTrigger>
                  <SelectContent>
                    {bidangOptions.length === 0 ? (
                      <div className='text-muted-foreground p-2 text-sm'>
                        Tidak ada bidang urusan untuk urusan ini
                      </div>
                    ) : (
                      bidangOptions.map((b) => (
                        <SelectItem
                          key={b.value}
                          value={b.value}
                          className='py-2 break-words whitespace-normal'
                        >
                          <span className='block text-left'>
                            <span className='font-semibold'>
                              {b.kd_bu1}.{b.kd_bu2}
                            </span>{' '}
                            — {b.label}
                          </span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* daftar program */}
      {fields.map((prog, pi) => (
        <ProgramSection
          key={prog.id}
          control={control}
          indexUrusan={indexUrusan}
          indexBidang={indexBidang}
          indexProgram={pi}
          removeProgram={() => remove(pi)}
        />
      ))}

      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={() => {
          // ✅ saat tambah program, ikutkan kd_bu1 dan kd_bu2
          const bidang = getValues(
            `urusan.${indexUrusan}.bidangUrusan.${indexBidang}`
          )
          append({
            nm_program: '',
            kd_program: '',
            kegiatan: [],
            kd_bu1: bidang?.kd_bu1 ?? '',
            kd_bu2: bidang?.kd_bu2 ?? '',
          })
        }}
      >
        <Plus className='mr-2 h-4 w-4' /> Tambah Program
      </Button>
    </div>
  )
}
