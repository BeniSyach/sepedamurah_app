import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefAksesPajakBendaharaGroup } from './akses-pajak-bendahara-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefAksesPajakBendaharaGroup()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Pajak Bendahara</span> <Plus size={18} />
      </Button>
    </div>
  )
}
