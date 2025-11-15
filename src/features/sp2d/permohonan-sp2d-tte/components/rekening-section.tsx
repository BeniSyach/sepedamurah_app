/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatRupiah } from '@/lib/utils'
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
}: any) {
  return (
    <div className='mt-2'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening.${indexRek}.nm_rekening`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Rekening</FormLabel>
            <FormControl>
              <Input {...field} disabled placeholder='Contoh: Belanja Barang' />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening.${indexRek}.nilai`}
        render={({ field }) => (
          <FormItem>
            <div className='mt-2 flex items-center justify-between'>
              <FormLabel>Nilai</FormLabel>
            </div>
            <FormControl>
              <Input
                {...field}
                readOnly
                placeholder='0'
                className='font-semibold'
                value={formatRupiah(field.value ?? '')}
                onChange={(e) => {
                  // Ambil angka asli tanpa format
                  const raw = e.target.value.replace(/[^0-9]/g, '')

                  // Set angka mentah ke form
                  field.onChange(raw)
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
