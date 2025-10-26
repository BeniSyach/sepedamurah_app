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
import { SubKegiatanSection } from './sub-kegiatan-section'

export function KegiatanSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  indexKegiatan,
  removeKegiatan,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan`,
  })

  return (
    <div className='mt-3 ml-12 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.nm_kegiatan`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel>Nama Kegiatan</FormLabel>
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
              <Input
                {...field}
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

      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={() => append({ nm_subkegiatan: '', rekening: [] })}
      >
        <Plus className='mr-2 h-4 w-4' /> Tambah Sub Kegiatan
      </Button>
    </div>
  )
}
