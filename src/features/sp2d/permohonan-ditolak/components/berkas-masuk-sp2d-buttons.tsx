import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefSp2dItem } from './berkas-masuk-sp2d-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefSp2dItem()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Upload Berkas</span> <Plus size={18} />
      </Button>
    </div>
  )
}
