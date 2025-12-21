import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefRefSp2dbToBUD } from './ref-sp2b-to-bud-provider'

export function Sp2dbToBUDPrimaryButtons() {
  const { setOpen } = useRefRefSp2dbToBUD()
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
        <span>Tambah Pajak Bendahara</span> <Plus size={18} />
      </Button>
    </div>
  )
}
