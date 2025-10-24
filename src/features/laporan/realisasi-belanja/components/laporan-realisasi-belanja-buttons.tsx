import { FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefPengembalian } from './laporan-realisasi-belanja-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefPengembalian()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Export Excel</span> <FileSpreadsheet size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Export PDF</span> <FileText size={18} />
      </Button>
    </div>
  )
}
