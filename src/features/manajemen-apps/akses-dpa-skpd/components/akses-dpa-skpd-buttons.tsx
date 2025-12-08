import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefAksesDPAGroup } from './akses-dpa-skpd-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefAksesDPAGroup()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah DPA SKPD</span> <Plus size={18} />
      </Button>
    </div>
  )
}
