import { FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefDaftarBelanjaSKPD } from './daftar-belanja-per-skpd-provider'

export function DaftarBelanjaPerSKPDPrimaryButtons() {
  const { setOpen } = useRefDaftarBelanjaSKPD()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('export')}>
        <span>Export Excel</span> <FileSpreadsheet size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('export')}>
        <span>Export PDF</span> <FileText size={18} />
      </Button>
    </div>
  )
}
