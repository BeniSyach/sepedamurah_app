import { Plus, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefBatasWaktu } from './batas-waktu-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefBatasWaktu()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Batas Waktu</span> <Plus size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('reset')}>
        <span>Reset Batas Waktu</span> <RefreshCcw size={18} />
      </Button>
    </div>
  )
}
