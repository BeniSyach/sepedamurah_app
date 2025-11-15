/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SubKegiatanSection } from './sub-kegiatan-section'

export function KegiatanSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  indexKegiatan,
}: any) {
  const { fields, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan`,
  })

  return (
    <div className='mt-2'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.nm_kegiatan`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel>Nama Kegiatan</FormLabel>
            </div>
            <FormControl>
              <Input
                {...field}
                disabled
                placeholder='Contoh: Kegiatan Keamanan Masyarakat'
              />
            </FormControl>
          </FormItem>
        )}
      />

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
    </div>
  )
}
