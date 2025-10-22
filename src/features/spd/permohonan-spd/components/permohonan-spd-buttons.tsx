import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefPermohonanSpd } from './permohonan-spd-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefPermohonanSpd()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Permohonan SPD</span> <Plus size={18} />
      </Button>
    </div>
  )
}
