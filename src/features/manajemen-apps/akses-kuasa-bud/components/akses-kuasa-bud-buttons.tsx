import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefAksesKuasaBud } from './akses-kuasa-bud-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefAksesKuasaBud()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Akses Kuasa BUD</span> <Plus size={18} />
      </Button>
    </div>
  )
}
