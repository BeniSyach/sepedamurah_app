import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefRefAssetBendahara } from './ref-asset-bendahara-provider'

export function RefAssetBendaharaPrimaryButtons() {
  const { setOpen } = useRefRefAssetBendahara()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        {' '}
        <span>Import</span> <Download size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Asset Bendahara</span> <Plus size={18} />
      </Button>
    </div>
  )
}
