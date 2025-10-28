import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefPaguBelanja } from './ref-pagu-belanja-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefPaguBelanja()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <Download size={18} />
      </Button>
      {/* <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Pagu Belanja</span> <UserPlus size={18} />
      </Button> */}
    </div>
  )
}
