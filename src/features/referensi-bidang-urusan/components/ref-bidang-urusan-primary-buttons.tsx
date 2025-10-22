import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefBidangUrusan } from './ref-bidang-urusan-provider'

export function TasksPrimaryButtons() {
  const { setOpen } = useRefBidangUrusan()
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
        <span>Tambah Bidang Urusan</span> <Plus size={18} />
      </Button>
    </div>
  )
}
