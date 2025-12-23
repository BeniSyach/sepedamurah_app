import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefDatRekeningItem } from './ref-rekening-pengembalian-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefDatRekeningItem()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Referensi Rekening</span> <Plus size={18} />
      </Button>
    </div>
  )
}
