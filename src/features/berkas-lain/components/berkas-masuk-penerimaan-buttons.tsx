import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefBerkasLain } from './berkas-masuk-penerimaan-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefBerkasLain()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Upload Berkas</span> <Plus size={18} />
      </Button>
    </div>
  )
}
