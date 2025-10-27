/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetRefRekening } from '@/api'
import { Minus } from 'lucide-react'
import { formatRupiahControlled } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  const { data, isPending, isError } = useGetRefRekening({
    page: 1,
    perPage: 100,
  })

  const rekeningList = data?.data || []

  return (
    <div className='mt-3 ml-20 space-y-3 border-l pl-4'>
      {/* ====== PILIH REKENING ====== */}
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening.${indexRek}.nm_rekening`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel className='font-medium'>Rekening</FormLabel>
              <Button
                type='button'
                size='icon'
                variant='destructive'
                className='h-5 w-5'
                onClick={removeRekening}
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>

            <FormControl>
              {isPending ? (
                <p className='text-muted-foreground text-sm'>
                  Memuat data rekening...
                </p>
              ) : isError ? (
                <p className='text-destructive text-sm'>
                  Gagal memuat data rekening.
                </p>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <SelectTrigger className='min-h-[44px] break-words whitespace-normal'>
                    <SelectValue placeholder='Pilih Rekening' />
                  </SelectTrigger>

                  <SelectContent>
                    {rekeningList.map((rek: any) => {
                      const kdFull = [
                        rek.kd_rekening1,
                        rek.kd_rekening2,
                        rek.kd_rekening3,
                        rek.kd_rekening4,
                        rek.kd_rekening5,
                        rek.kd_rekening6,
                      ]
                        .filter(Boolean)
                        .join('.')

                      return (
                        <SelectItem
                          key={kdFull}
                          value={rek.nm_rekening}
                          className='py-2 break-words whitespace-normal'
                        >
                          <span className='block text-left'>
                            <span className='font-semibold'>{kdFull}</span> —{' '}
                            {rek.nm_rekening}
                          </span>
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

      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subKegiatan.${indexSub}.rekening.${indexRek}.nilai`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nilai</FormLabel>
            <FormControl>
              <Input
                type='text'
                inputMode='numeric'
                placeholder='Rp 0,00'
                value={formatRupiahControlled(field.value || '')}
                onChange={(e) => {
                  // Hapus semua karakter selain angka
                  const raw = e.target.value.replace(/\D/g, '')
                  field.onChange(raw)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
