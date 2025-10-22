import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRefJenisSpm } from './ref-jenis-spm-provider'

export function RefRekeningPrimaryButtons() {
  const { setOpen } = useRefJenisSpm()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        {' '}
        <span>Import</span> <Download size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Tambah Ceklis Kelengkapan Dokumen</span> <Plus size={18} />
      </Button>
    </div>
  )
}
