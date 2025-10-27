/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from 'react-hook-form'
import { type SubKegiatan, useGetRefSubKegiatan } from '@/api'
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening`,
  })

  const { data, isPending, isError } = useGetRefSubKegiatan({
    page: 1,
    perPage: 100,
  })

  const subList = data?.data || []

  return (
    <div className='mt-3 ml-16 space-y-3 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.kd_subkegiatan`} // kirim gabungan kode
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel>Sub Kegiatan</FormLabel>
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
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Sub Kegiatan' />
                  </SelectTrigger>
                  <SelectContent>
                    {subList.map((sub: SubKegiatan) => {
                      const kdFull = [
                        sub.kd_subkeg1,
                        sub.kd_subkeg2,
                        sub.kd_subkeg3,
                        sub.kd_subkeg4,
                        sub.kd_subkeg5,
                        sub.kd_subkeg6,
                      ]
                        .filter(Boolean)
                        .join('.')

                      return (
                        <SelectItem key={kdFull} value={kdFull}>
                          {kdFull} — {sub.nm_subkegiatan}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            </FormControl>
            <FormMessage />
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
