'use client'

import { useState } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useSkpp } from './skpp-provider'

interface SkppTolakDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SkppTolakDialog({
  open,
  onOpenChange,
}: SkppTolakDialogProps) {
  const { currentRow, tolakSkpp } = useSkpp()
  const [alasan, setAlasan] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!currentRow) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!alasan.trim()) {
      toast.error('Alasan penolakan wajib diisi!')
      return
    }

    try {
      setIsSubmitting(true)
      await tolakSkpp(currentRow.id, alasan.trim())
      setAlasan('')
      onOpenChange(false)
    } catch (err) {
      // error handled in provider
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className='text-destructive flex items-center gap-2'>
              <AlertCircle className='w-5 h-5' /> Tolak Permohonan SKPP
            </DialogTitle>
            <DialogDescription>
              Berikan alasan yang jelas mengapa permohonan SKPP atas nama{' '}
              <span className='font-semibold text-foreground'>{currentRow.nama}</span> ({currentRow.nip}) ini ditolak.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4 space-y-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='alasan_tolak' className='text-sm font-medium'>
                Alasan Penolakan <span className='text-destructive'>*</span>
              </Label>
              <Textarea
                id='alasan_tolak'
                placeholder='Contoh: Lampiran SK mutasi belum dilegalisir, mohon perbaiki tanggal berlakunya SK.'
                rows={4}
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                required
                className='resize-none'
              />
            </div>
            <p className='text-xs text-muted-foreground'>
              Alasan ini akan tercatat dalam sistem dan dapat dilihat pada menu daftar SKPP Ditolak.
            </p>
          </div>

          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type='submit'
              variant='destructive'
              disabled={isSubmitting || !alasan.trim()}
              className='flex items-center gap-1.5'
            >
              <X className='w-4 h-4' /> {isSubmitting ? 'Memproses...' : 'Tolak Permohonan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
