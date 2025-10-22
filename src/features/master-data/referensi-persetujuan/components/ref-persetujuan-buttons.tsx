import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefPersetujuan } from './ref-persetujuan-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefPersetujuan()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Konten</span> <Plus size={18} />
      </Button>
    </div>
  )
}
