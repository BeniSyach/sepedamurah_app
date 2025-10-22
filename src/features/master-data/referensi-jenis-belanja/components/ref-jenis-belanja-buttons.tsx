import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefJenisBelanja } from './ref-jenis-belanja-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefJenisBelanja()
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
        <span>Tambah Jenis Belanja</span> <Plus size={18} />
      </Button>
    </div>
  )
}
