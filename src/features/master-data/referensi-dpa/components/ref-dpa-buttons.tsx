import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefRefDpa } from './ref-dpa-provider'

export function RefDPAPrimaryButtons() {
  const { setOpen } = useRefRefDpa()
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
        <span>Tambah DPA</span> <Plus size={18} />
      </Button>
    </div>
  )
}
