import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefLaporanSp2bToBUD } from './laporan-pajak-bendahara-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefLaporanSp2bToBUD()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Upload Berkas</span> <Plus size={18} />
      </Button>
    </div>
  )
}
