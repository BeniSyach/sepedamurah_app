/* eslint-disable @typescript-eslint/no-explicit-any */
import { Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function RekeningSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  indexKegiatan,
  indexSub,
  indexRek,
  removeRekening,
}: any) {
  return (
    <div className='mt-2 ml-20 grid grid-cols-2 gap-2 border-l pl-4'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening.${indexRek}.nm_rekening`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Rekening</FormLabel>

            <FormControl>
              <Input {...field} placeholder='Contoh: Belanja Barang' />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening.${indexRek}.nilai`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel>Nilai</FormLabel>
              <Button
                type='button'
                size='icon'
                variant='destructive'
                onClick={removeRekening}
                className='h-5 w-5'
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>
            <FormControl>
              <Input {...field} type='number' placeholder='0' />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
