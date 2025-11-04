/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useGetRefProgramSp2d } from '@/api'
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
import { KegiatanSection } from './kegiatan-section'

export function ProgramSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  removeProgram,
}: any) {
  const { setValue, watch } = useFormContext()

  // 🔥 Ambil kd_bu1 & kd_bu2 dari form parent
  const kd_bu1 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.kd_bu1`
  )
  const kd_bu2 = watch(
    `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.kd_bu2`
  )

  // 🔁 Daftar kegiatan di bawah program
  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan`,
  })

  // 🔁 Ambil data program dari API
  const { data, isPending, isError } = useGetRefProgramSp2d({
    page: 1,
    perPage: 100,
    kd_bu1,
    kd_bu2,
  })

  // ✅ Bentuk opsi dropdown
  const programOptions =
    data?.data?.map((item: any) => ({
      value: [item.kd_prog1, item.kd_prog2, item.kd_prog3]
        .filter(Boolean)
        .join('.'),
      label: item.nm_program,
      kd_prog1: item.kd_prog1,
      kd_prog2: item.kd_prog2,
      kd_prog3: item.kd_prog3,
    })) ?? []

  // 🧩 Ambil nilai yang aktif di form
  const currentValues =
    control._formValues?.urusan?.[indexUrusan]?.bidangUrusan?.[indexBidang]
      ?.program?.[indexProgram]

  return (
    <div className='mt-3 ml-8 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kd_program`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel className='font-medium'>Program</FormLabel>
              <Button
                type='button'
                size='icon'
                variant='destructive'
                className='h-5 w-5'
                onClick={removeProgram}
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>

            <FormControl>
              {isPending ? (
                <Skeleton className='h-9 w-full' />
              ) : isError ? (
                <div className='text-sm text-red-500'>
                  Gagal memuat data program
                </div>
              ) : (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val)
                    const selected = programOptions.find((p) => p.value === val)

                    // ✅ Simpan kode & nama program ke form
                    setValue(
                      `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kd_prog1`,
                      selected?.kd_prog1 ?? ''
                    )
                    setValue(
                      `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kd_prog2`,
                      selected?.kd_prog2 ?? ''
                    )
                    setValue(
                      `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kd_prog3`,
                      selected?.kd_prog3 ?? ''
                    )
                    setValue(
                      `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.nm_program`,
                      selected?.label ?? ''
                    )

                    // ✅ Kirim nilai program ke semua kegiatan di bawahnya
                    const kegiatanList =
                      control._formValues?.urusan?.[indexUrusan]
                        ?.bidangUrusan?.[indexBidang]?.program?.[indexProgram]
                        ?.kegiatan ?? []

                    kegiatanList.forEach((_: any, ki: number) => {
                      setValue(
                        `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${ki}.kd_prog1`,
                        selected?.kd_prog1 ?? ''
                      )
                      setValue(
                        `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${ki}.kd_prog2`,
                        selected?.kd_prog2 ?? ''
                      )
                      setValue(
                        `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${ki}.kd_prog3`,
                        selected?.kd_prog3 ?? ''
                      )
                      setValue(
                        `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${ki}.nm_program`,
                        selected?.label ?? ''
                      )
                    })
                  }}
                  value={
                    programOptions.find(
                      (p) =>
                        p.kd_prog1 === (currentValues?.kd_prog1 ?? '') &&
                        p.kd_prog2 === (currentValues?.kd_prog2 ?? '') &&
                        p.kd_prog3 === (currentValues?.kd_prog3 ?? '')
                    )?.value || ''
                  }
                >
                  <SelectTrigger className='min-h-[44px] break-words whitespace-normal'>
                    <SelectValue placeholder='Pilih Program' />
                  </SelectTrigger>
                  <SelectContent>
                    {programOptions.map((p) => (
                      <SelectItem
                        key={p.value}
                        value={p.value}
                        className='py-2 break-words whitespace-normal'
                      >
                        {p.kd_prog1}.{p.kd_prog2}.{p.kd_prog3} — {p.label}
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

      {/* ✅ List kegiatan di bawah program */}
      {fields.map((keg, ki) => (
        <KegiatanSection
          key={keg.id}
          control={control}
          indexUrusan={indexUrusan}
          indexBidang={indexBidang}
          indexProgram={indexProgram}
          indexKegiatan={ki}
          removeKegiatan={() => remove(ki)}
        />
      ))}

      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={() =>
          append({
            nm_kegiatan: '',
            subKegiatan: [],
            // default isi kode program biar langsung ikut
            kd_prog1: currentValues?.kd_prog1 ?? '',
            kd_prog2: currentValues?.kd_prog2 ?? '',
            kd_prog3: currentValues?.kd_prog3 ?? '',
            nm_program: currentValues?.nm_program ?? '',
          })
        }
      >
        <Plus className='mr-2 h-4 w-4' /> Tambah Kegiatan
      </Button>
    </div>
  )
}
