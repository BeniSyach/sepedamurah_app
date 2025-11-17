/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ProgramSection } from './program-section'

export function BidangUrusanSection({
  control,
  indexUrusan,
  indexBidang,
}: any) {
  const { fields, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program`,
  })

  return (
    <div>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.nm_bu`}
        render={({ field }) => {
          const kd =
            control._formValues.urusan[indexUrusan]?.bidangUrusan?.[indexBidang]
              .kd_bu || ''
          const nm = field.value || ''
          return (
            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel className='font-medium'>Bidang Urusan</FormLabel>
              </div>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  value={`${kd} - ${nm}`}
                  placeholder='Contoh: Bidang Ketentraman dan Ketertiban'
                />
              </FormControl>
            </FormItem>
          )
        }}
      />

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
    </div>
  )
}
