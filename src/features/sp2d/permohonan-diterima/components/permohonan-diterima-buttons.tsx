import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefSp2dItem } from './permohonan-diterima-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefSp2dItem()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Permohonan SP2D</span> <Plus size={18} />
      </Button>
    </div>
  )
}
