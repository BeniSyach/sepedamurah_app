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
  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening`,
  })

  return (
    <div className='mt-3 ml-16 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.nm_subkegiatan`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel>Nama Sub Kegiatan</FormLabel>
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
              <Input
                {...field}
                placeholder='Contoh: Sub Kegiatan Patroli Malam'
              />
            </FormControl>
          </FormItem>
        )}
      />

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
