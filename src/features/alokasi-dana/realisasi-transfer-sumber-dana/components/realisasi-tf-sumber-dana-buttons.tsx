import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefRealisasiTransferSumberDana } from './realisasi-tf-sumber-dana-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefRealisasiTransferSumberDana()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Sumber Dana</span> <Plus size={18} />
      </Button>
    </div>
  )
}
