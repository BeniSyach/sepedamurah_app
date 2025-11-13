/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useGetRefKegiatanSp2d } from '@/api'
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
import { SubKegiatanSection } from './sub-kegiatan-section'

export function KegiatanSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  indexKegiatan,
  removeKegiatan,
}: any) {
  const { setValue, watch } = useFormContext()

  // ✅ Ambil kd_prog dari parent (ProgramSection)
  const kd_prog1 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kd_prog1`
  )
  const kd_prog2 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kd_prog2`
  )
  const kd_prog3 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kd_prog3`
  )

  // 🔥 Ambil data kegiatan berdasarkan program
  const { data, isPending, isError } = useGetRefKegiatanSp2d({
    page: 1,
    perPage: 200,
    kd_prog1,
    kd_prog2,
    kd_prog3,
  })

  // handle subkegiatan
  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan`,
  })

  const kegiatanOptions =
    data?.data?.map((item: any) => ({
      value: [
        item.kd_keg1,
        item.kd_keg2,
        item.kd_keg3,
        item.kd_keg4,
        item.kd_keg5,
      ]
        .filter(Boolean)
        .join('.'),
      label: item.nm_kegiatan,
      ...item,
    })) ?? []

  return (
    <div className='mt-3 ml-12 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.kd_keg5`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel className='font-medium'>Kegiatan</FormLabel>
              <Button
                type='button'
                size='icon'
                variant='destructive'
                className='h-5 w-5'
                onClick={removeKegiatan}
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>

            <FormControl>
              {isPending ? (
                <Skeleton className='h-9 w-full' />
              ) : isError ? (
                <div className='text-sm text-red-500'>
                  Gagal memuat data kegiatan
                </div>
              ) : (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val)
                    const selected = kegiatanOptions.find(
                      (k) => k.value === val
                    )
                    if (selected) {
                      // ✅ Simpan kode dan nama kegiatan ke form
                      const basePath = `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}`
                      setValue(`${basePath}.kd_keg1`, selected.kd_keg1 ?? '')
                      setValue(`${basePath}.kd_keg2`, selected.kd_keg2 ?? '')
                      setValue(`${basePath}.kd_keg3`, selected.kd_keg3 ?? '')
                      setValue(`${basePath}.kd_keg4`, selected.kd_keg4 ?? '')
                      setValue(`${basePath}.kd_keg5`, selected.kd_keg5 ?? '')
                      setValue(
                        `${basePath}.nm_kegiatan`,
                        selected.nm_kegiatan ?? selected.label
                      )

                      // ✅ Reset subKegiatan lama agar fetch ulang berdasarkan kegiatan baru
                      setValue(`${basePath}.subKegiatan`, [])
                    }
                  }}
                  value={
                    kegiatanOptions.find(
                      (k) =>
                        k.value ===
                        [
                          control._formValues?.urusan?.[indexUrusan]
                            ?.bidangUrusan?.[indexBidang]?.program?.[
                            indexProgram
                          ]?.kegiatan?.[indexKegiatan]?.kd_keg1,
                          control._formValues?.urusan?.[indexUrusan]
                            ?.bidangUrusan?.[indexBidang]?.program?.[
                            indexProgram
                          ]?.kegiatan?.[indexKegiatan]?.kd_keg2,
                          control._formValues?.urusan?.[indexUrusan]
                            ?.bidangUrusan?.[indexBidang]?.program?.[
                            indexProgram
                          ]?.kegiatan?.[indexKegiatan]?.kd_keg3,
                          control._formValues?.urusan?.[indexUrusan]
                            ?.bidangUrusan?.[indexBidang]?.program?.[
                            indexProgram
                          ]?.kegiatan?.[indexKegiatan]?.kd_keg4,
                          control._formValues?.urusan?.[indexUrusan]
                            ?.bidangUrusan?.[indexBidang]?.program?.[
                            indexProgram
                          ]?.kegiatan?.[indexKegiatan]?.kd_keg5,
                        ]
                          .filter(Boolean)
                          .join('.')
                    )?.value || ''
                  }
                >
                  <SelectTrigger className='min-h-[44px] break-words whitespace-normal'>
                    <SelectValue placeholder='Pilih Kegiatan' />
                  </SelectTrigger>
                  <SelectContent>
                    {kegiatanOptions.map((k) => (
                      <SelectItem
                        key={k.value}
                        value={k.value}
                        className='py-2 break-words whitespace-normal'
                      >
                        <span className='block text-left'>
                          <span className='font-semibold'>{k.value}</span> —{' '}
                          {k.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ✅ daftar sub kegiatan */}
      {fields.map((sub, si) => (
        <SubKegiatanSection
          key={sub.id}
          control={control}
          indexUrusan={indexUrusan}
          indexBidang={indexBidang}
          indexProgram={indexProgram}
          indexKegiatan={indexKegiatan}
          indexSub={si}
          removeSubKegiatan={() => remove(si)}
        />
      ))}

      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={() =>
          append({
            nm_subkegiatan: '',
            rekening: [],
          })
        }
      >
        <Plus className='mr-2 h-4 w-4' /> Tambah Sub Kegiatan
      </Button>
    </div>
  )
}
