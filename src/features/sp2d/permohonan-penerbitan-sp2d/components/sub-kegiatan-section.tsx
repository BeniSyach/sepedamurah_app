/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useFormContext } from 'react-hook-form'
import { type SubKegiatan, useGetRefSubKegiatanSp2d } from '@/api'
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RekeningSection } from './rekening-section'

export function SubKegiatanSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  indexKegiatan,
  indexSub,
  removeSubKegiatan,
}: any) {
  const { watch, setValue } = useFormContext()

  // ✅ ambil kode kegiatan dari parent (yang dipilih user di KegiatanSection)
  const kd_keg1 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.kd_keg1`
  )
  const kd_keg2 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.kd_keg2`
  )
  const kd_keg3 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.kd_keg3`
  )
  const kd_keg4 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.kd_keg4`
  )
  const kd_keg5 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.kd_keg5`
  )

  // 🔥 Ambil sub kegiatan berdasarkan kegiatan terpilih
  const { data, isPending, isError } = useGetRefSubKegiatanSp2d({
    page: 1,
    perPage: 200,
    kd_keg1,
    kd_keg2,
    kd_keg3,
    kd_keg4,
    kd_keg5,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening`,
  })

  // ✅ Bentuk daftar opsi
  const subOptions =
    data?.data?.map((item: SubKegiatan) => ({
      value: [
        item.kd_subkeg1,
        item.kd_subkeg2,
        item.kd_subkeg3,
        item.kd_subkeg4,
        item.kd_subkeg5,
        item.kd_subkeg6,
      ]
        .filter(Boolean)
        .join('.'),
      label: item.nm_subkegiatan,
      ...item,
    })) ?? []

  // ✅ ambil kode sub kegiatan yang sedang dipilih (buat dikirim ke RekeningSection)
  const selectedSub = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}`
  )

  return (
    <div className='mt-3 ml-16 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.kd_subkegiatan`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel className='font-medium'>Sub Kegiatan</FormLabel>
              <Button
                type='button'
                size='icon'
                variant='destructive'
                className='h-5 w-5'
                onClick={removeSubKegiatan}
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>

            <FormControl>
              {isPending ? (
                <p className='text-muted-foreground text-sm'>
                  Memuat data sub kegiatan...
                </p>
              ) : isError ? (
                <p className='text-destructive text-sm'>
                  Gagal memuat data sub kegiatan.
                </p>
              ) : (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val)
                    const selected = subOptions.find((s) => s.value === val)
                    if (selected) {
                      // ✅ Simpan semua kode & nama sub kegiatan ke form
                      const basePath = `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}`
                      setValue(
                        `${basePath}.nm_subkegiatan`,
                        selected.nm_subkegiatan ?? selected.label
                      )
                      setValue(
                        `${basePath}.kd_subkeg1`,
                        selected.kd_subkeg1 ?? ''
                      )
                      setValue(
                        `${basePath}.kd_subkeg2`,
                        selected.kd_subkeg2 ?? ''
                      )
                      setValue(
                        `${basePath}.kd_subkeg3`,
                        selected.kd_subkeg3 ?? ''
                      )
                      setValue(
                        `${basePath}.kd_subkeg4`,
                        selected.kd_subkeg4 ?? ''
                      )
                      setValue(
                        `${basePath}.kd_subkeg5`,
                        selected.kd_subkeg5 ?? ''
                      )
                      setValue(
                        `${basePath}.kd_subkeg6`,
                        selected.kd_subkeg6 ?? ''
                      )

                      // ✅ kosongkan dulu rekening jika subkegiatan berubah
                      setValue(`${basePath}.rekening`, [])
                    }
                  }}
                  value={field.value || ''}
                >
                  <SelectTrigger className='min-h-[44px] break-words whitespace-normal'>
                    <SelectValue placeholder='Pilih Sub Kegiatan' />
                  </SelectTrigger>

                  <SelectContent>
                    {subOptions.map((sub) => (
                      <SelectItem
                        key={sub.value}
                        value={sub.value}
                        className='py-2 break-words whitespace-normal'
                      >
                        <span className='block text-left'>
                          <span className='font-semibold'>{sub.value}</span> —{' '}
                          {sub.label}
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

      {/* ✅ Kirim kode sub kegiatan ke RekeningSection */}
      {fields.map((rek, ri) => (
        <RekeningSection
          key={rek.id}
          control={control}
          indexUrusan={indexUrusan}
          indexBidang={indexBidang}
          indexProgram={indexProgram}
          indexKegiatan={indexKegiatan}
          indexSub={indexSub}
          indexRek={ri}
          removeRekening={() => remove(ri)}
          kd_subkeg1={selectedSub?.kd_subkeg1}
          kd_subkeg2={selectedSub?.kd_subkeg2}
          kd_subkeg3={selectedSub?.kd_subkeg3}
          kd_subkeg4={selectedSub?.kd_subkeg4}
          kd_subkeg5={selectedSub?.kd_subkeg5}
          kd_subkeg6={selectedSub?.kd_subkeg6}
        />
      ))}

      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={() => append({ nm_rekening: '', nilai: '' })}
      >
        <Plus className='mr-2 h-4 w-4' /> Tambah Rekening
      </Button>
    </div>
  )
}
