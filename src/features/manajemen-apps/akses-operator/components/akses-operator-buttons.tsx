import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefAksesOperator } from './akses-operator-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefAksesOperator()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Akses Operator</span> <Plus size={18} />
      </Button>
    </div>
  )
}
