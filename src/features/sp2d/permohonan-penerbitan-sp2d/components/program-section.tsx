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
import { KegiatanSection } from './kegiatan-section'

export function ProgramSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  removeProgram,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan`,
  })

  return (
    <div className='mt-3 ml-8 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.nm_program`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel>Nama Program</FormLabel>
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
              <Input
                {...field}
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

      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={() => append({ nm_kegiatan: '', subKegiatan: [] })}
      >
        <Plus className='mr-2 h-4 w-4' /> Tambah Kegiatan
      </Button>
    </div>
  )
}
