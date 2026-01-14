import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefAksesRefRekonsiliasiGajiSkpdGroup } from './akses-sp2b-to-bud-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefAksesRefRekonsiliasiGajiSkpdGroup()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Rekonsiliasi Gaji SKPD</span> <Plus size={18} />
      </Button>
    </div>
  )
}
