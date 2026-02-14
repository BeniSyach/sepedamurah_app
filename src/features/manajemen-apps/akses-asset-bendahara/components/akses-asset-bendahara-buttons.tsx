import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefAksesAssetBendaharaGroup } from './akses-asset-bendahara-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefAksesAssetBendaharaGroup()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah BMD (Barang Milik Daerah)</span> <Plus size={18} />
      </Button>
    </div>
  )
}
