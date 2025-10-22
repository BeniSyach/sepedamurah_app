import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefPaguSumberDana } from './pagu-sumber-dana-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefPaguSumberDana()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Pagu</span> <Plus size={18} />
      </Button>
    </div>
  )
}
