import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefSubKegiatan } from './ref-subkegiatan-provider'

export function TasksPrimaryButtons() {
  const { setOpen } = useRefSubKegiatan()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <Download size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Tambah Sub Kegiatan</span> <Plus size={18} />
      </Button>
    </div>
  )
}
