import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRefSp2dItem } from './permohonan-penerbitan-sp2d-provider'

interface RefRekeningPrimaryButtonsProps {
  isChecking?: boolean
}

export function RefRekeningPrimaryButtons({
  isChecking = false,
}: RefRekeningPrimaryButtonsProps) {
  const { setOpen } = useRefSp2dItem()

  // ✅ Tampilkan skeleton selama API cek masih loading
  if (isChecking) {
    return (
      <div className='flex gap-2'>
        <Skeleton className='h-9 w-52 rounded-md' />
      </div>
    )
  }

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Permohonan SP2D</span> <Plus size={18} />
      </Button>
    </div>
  )
}
