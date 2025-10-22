import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefPaguBelanja } from './ref-pagu-belanja-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefPaguBelanja()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add User</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
