/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from 'react-hook-form'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  removeBidang,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program`,
  })

  return (
    <div className='mt-3 ml-4 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.nm_bu`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel className='font-medium'>Nama Bidang Urusan</FormLabel>
              <Button
                type='button'
                disabled
                size='icon'
                variant='destructive'
                className='h-5 w-5'
                onClick={removeBidang}
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>
            <FormControl>
              <Input
                {...field}
                disabled
                placeholder='Contoh: Bidang Ketentraman dan Ketertiban'
              />
            </FormControl>
          </FormItem>
        )}
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

      <Button
        disabled
        type='button'
        size='sm'
        variant='outline'
        onClick={() => append({ nm_program: '', kegiatan: [] })}
      >
        <Plus className='mr-2 h-4 w-4' /> Tambah Program
      </Button>
    </div>
  )
}
