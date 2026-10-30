import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Printer, Download, ExternalLink, FileText, Loader2 } from 'lucide-react'
import { useSkpp } from './skpp-provider'
import { api } from '@/api/common/client'
import { toast } from 'sonner'

export function SkppPreviewDialog() {
  const { open, setOpen, currentRow } = useSkpp()
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isLoadingPdf, setIsLoadingPdf] = useState(false)

  const isOpen = open === 'preview'
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const backendPdfUrl = currentRow?.id ? `${API_URL}/skpp/${currentRow.id}/pdf` : ''

  useEffect(() => {
    if (!currentRow?.id || !isOpen) {
      setFileUrl(null)
      return
    }

    let isMounted = true
    setIsLoadingPdf(true)

    const fetchPdf = async () => {
      try {
        const response = await api.get<Blob>(`/skpp/${currentRow.id}/pdf`, {
          responseType: 'blob',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
          params: {
            t: Date.now(),
          },
        })

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        if (isMounted) {
          setFileUrl(url)
          setIsLoadingPdf(false)
        }
      } catch (err: any) {
        if (isMounted) {
          setIsLoadingPdf(false)
          toast.error(`Gagal memuat PDF SKPP dari server: ${err?.message || 'Error'}`)
        }
      }
    }

    fetchPdf()

    return () => {
      isMounted = false
      if (fileUrl) URL.revokeObjectURL(fileUrl)
    }
  }, [currentRow?.id, isOpen])

  if (!currentRow) return null

  const handleOpenExternal = () => {
    if (backendPdfUrl) {
      window.open(backendPdfUrl, '_blank')
    }
  }

  const handleDownload = () => {
    if (!fileUrl && !backendPdfUrl) return
    const link = document.createElement('a')
    link.href = fileUrl || backendPdfUrl
    const cleanNomor = currentRow.nomor_surat ? currentRow.nomor_surat.replace(/[\/\s]/g, '_') : 'dokumen'
    link.download = `SKPP_${cleanNomor}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && setOpen(null)}>
      <DialogContent className='w-[96vw] max-w-5xl h-[92vh] flex flex-col p-4 sm:p-6'>
        <DialogHeader className='flex flex-row items-center justify-between pb-3 border-b'>
          <div>
            <DialogTitle className='text-base sm:text-lg font-bold text-primary flex items-center gap-2'>
              <FileText className='h-5 w-5 text-primary' />
              Dokumen Asli SKPP (Backend)
            </DialogTitle>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Nomor: {currentRow.nomor_surat} &bull; Pegawai: {currentRow.nama} ({currentRow.nip})
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={handleDownload}
              className='flex items-center gap-1.5 text-xs'
            >
              <Download className='h-3.5 w-3.5' />
              <span>Unduh PDF</span>
            </Button>
            <Button
              size='sm'
              onClick={handleOpenExternal}
              className='bg-primary text-primary-foreground flex items-center gap-1.5 text-xs'
              title='Buka PDF di tab baru untuk cetak via browser PDF viewer'
            >
              <Printer className='h-3.5 w-3.5' />
              <span>Cetak / Buka Asli</span>
            </Button>
          </div>
        </DialogHeader>

        {/* CONTAINER PDF DARI BACKEND */}
        <div className='flex-1 w-full bg-slate-900/5 rounded-md relative flex flex-col justify-center items-center overflow-hidden border'>
          {isLoadingPdf ? (
            <div className='flex flex-col items-center gap-3 p-6'>
              <Loader2 className='w-8 h-8 text-primary animate-spin' />
              <p className='text-sm text-muted-foreground'>Menghasilkan & memuat PDF dari server backend...</p>
            </div>
          ) : fileUrl ? (
            <iframe
              src={fileUrl}
              title={`Dokumen Asli SKPP ${currentRow.nomor_surat}`}
              className='h-full w-full border-0 rounded-md'
            />
          ) : (
            <div className='text-center p-6 space-y-3'>
              <FileText className='w-12 h-12 text-muted-foreground mx-auto opacity-50' />
              <p className='text-sm text-muted-foreground'>Dokumen PDF belum dapat dimuat dari backend.</p>
              <Button
                variant='outline'
                size='sm'
                onClick={handleOpenExternal}
                className='flex items-center gap-1.5 mx-auto'
              >
                <ExternalLink className='h-3.5 w-3.5' />
                <span>Coba Buka Langsung URL Backend</span>
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className='pt-2 border-t flex items-center justify-between'>
          <span className='text-xs text-muted-foreground hidden sm:inline'>
            Dokumen resmi dihasilkan langsung oleh sistem backend (DomPDF).
          </span>
          <Button variant='outline' size='sm' onClick={() => setOpen(null)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
