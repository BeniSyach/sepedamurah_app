import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefUsersRole } from './user-role-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefUsersRole()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah User Role</span> <Plus size={18} />
      </Button>
    </div>
  )
}
