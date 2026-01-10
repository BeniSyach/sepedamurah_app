import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefAksesSp2bToBUDGroup } from './akses-sp2b-to-bud-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefAksesSp2bToBUDGroup()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah SPB (Surat Pengesahan Belanja)</span> <Plus size={18} />
      </Button>
    </div>
  )
}
