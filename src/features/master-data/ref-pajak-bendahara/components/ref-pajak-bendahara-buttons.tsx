import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefRefPajakBendahara } from './ref-pajak-bendahara-provider'

export function RefPajakBendaharaPrimaryButtons() {
  const { setOpen } = useRefRefPajakBendahara()
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
