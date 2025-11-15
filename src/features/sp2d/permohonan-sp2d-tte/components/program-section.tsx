/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { KegiatanSection } from './kegiatan-section'

export function ProgramSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
}: any) {
  const { fields, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan`,
  })

  return (
    <div className='mt-2'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.nm_program`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel>Nama Program</FormLabel>
            </div>
            <FormControl>
              <Input
                {...field}
                disabled
                placeholder='Contoh: Program Ketentraman Umum'
              />
            </FormControl>
          </FormItem>
        )}
      />

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
    </div>
  )
}
