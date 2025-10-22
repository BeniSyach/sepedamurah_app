import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefUpSkpd } from './besaran-up-skpd-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefUpSkpd()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah pagu SKPD</span> <Plus size={18} />
      </Button>
    </div>
  )
}
