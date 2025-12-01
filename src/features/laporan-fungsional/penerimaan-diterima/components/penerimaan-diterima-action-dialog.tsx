'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePutLaporanFungsional, type LaporanFungsional } from '@/api'
import { Check, X } from 'lucide-react'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'
import { Document, Page, pdfjs } from 'react-pdf'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

type LaporanFungsionalPeriksaProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: LaporanFungsional
  onAction?: (action: 'terima' | 'tolak', id: string) => void
}

const formSchema = z.object({
  id: z.string().optional(),
  nama_file: z.string().min(1),
  nama_file_asli: z.any(),
  nama_pengirim: z.string().min(1),
  tanggal_upload: z.string().optional(),
})

type LaporanFungsionalForm = z.infer<typeof formSchema>

export function PenerimaanPeriksa({
  open,
  onOpenChange,
  currentRow,
  onAction,
}: LaporanFungsionalPeriksaProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const user = useAuthStore((s) => s.user)

  const { mutateAsync: putLaporanFungsionalAsync } = usePutLaporanFungsional()

  const form = useForm<LaporanFungsionalForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: currentRow?.id || '',
      nama_file: currentRow?.nama_file || '',
      nama_file_asli: currentRow?.nama_file_asli || undefined,
      nama_pengirim: currentRow?.nama_pengirim || user?.name,
      tanggal_upload: currentRow?.tanggal_upload || '',
    },
  })

  useEffect(() => {
    if (!currentRow?.id || !open) return
    let isMounted = true
    const fetchPdf = async () => {
      try {
        const response = await api.get<Blob>(
          `/laporan/fungsional/download/${currentRow.id}`,
          {
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            params: {
              t: Date.now(), // tambahkan query timestamp supaya cache benar-benar dilewati
            },
          }
        )

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        if (isMounted) setFileUrl(url)
        toast.success('File berhasil diambil!')
      } catch (err: unknown) {
        const error = err as AxiosError
        toast.error(
          `Gagal mengambil file: ${error.response?.data || error.message || 'Unknown error'}`
        )
      }
    }

    fetchPdf()

    // Cleanup: revoke URL saat modal ditutup
    return () => {
      isMounted = false
      if (fileUrl) URL.revokeObjectURL(fileUrl)
      setFileUrl(null)
      setNumPages(0)
    }
  }, [currentRow?.id, open])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const handleAction = async (action: 'terima' | 'tolak') => {
    if (!currentRow?.id) return
    const now = new Date()
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const user = useAuthStore.getState().user
    if (!user) {
      toast.error('User belum login.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('id', currentRow.id)
      formData.append('id_operator', user.id.toString())
      formData.append('nama_operator', user.name)

      if (action === 'terima') {
        formData.append('proses', '2')
        formData.append('diterima', formatted)
        formData.append('alasan_tolak', '')
        formData.append('ditolak', '')
      } else {
        const alasan = prompt('Masukkan alasan penolakan:')
        if (!alasan) return toast.error('Alasan wajib diisi.')
        formData.append('proses', '0')
        formData.append('alasan_tolak', alasan)
        formData.append('ditolak', formatted)
        formData.append('diterima', '')
      }

      // Kirim ke backend
      await toast.promise(putLaporanFungsionalAsync(formData), {
        loading: action === 'terima' ? 'Menerima...' : 'Menolak...',
        success: () => {
          onOpenChange(false) // tutup modal
          onAction?.(action, currentRow.id) // callback ke parent
          return `Berhasil ${action === 'terima' ? 'Diterima' : 'Ditolak'}!`
        },
        error: 'Gagal melakukan aksi.',
      })

      onAction?.(action, currentRow.id) // callback ke parent
    } catch (err: unknown) {
      const error = err as AxiosError
      toast.error(
        `Gagal mengambil file: ${error.response?.data || error.message || 'Unknown error'}`
      )
    }
  }

  const fields: Array<'nama_file' | 'nama_pengirim' | 'tanggal_upload'> = [
    'nama_file',
    'nama_pengirim',
    'tanggal_upload',
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex w-full flex-col gap-4 sm:max-w-5xl'>
        <div className='flex gap-4'>
          {/* Form Detail */}
          <div className='w-1/2 overflow-auto'>
            <DialogHeader>
              <DialogTitle>Preview Laporan Fungsional Penerimaan</DialogTitle>
              <DialogDescription>
                Melihat detail dan file PDF Laporan Fungsional Penerimaan.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <div className='space-y-4'>
                {fields.map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          {field === 'tanggal_upload'
                            ? 'Tanggal Upload'
                            : field
                                .replace('_', ' ')
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={
                              field === 'tanggal_upload'
                                ? new Date(
                                    currentRow[field] || ''
                                  ).toLocaleDateString()
                                : currentRow[field] || ''
                            }
                            readOnly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </Form>
          </div>

          {/* PDF Preview */}
          <div className='h-[500px] w-1/2 overflow-auto rounded border'>
            {fileUrl ? (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(err) =>
                  toast.error(`Gagal memuat PDF: ${err.message}`)
                }
                loading={<p className='mt-10 text-center'>Loading PDF...</p>}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <Page
                    key={`page_${i + 1}`}
                    pageNumber={i + 1}
                    width={600}
                    renderAnnotationLayer={false} // optional, bisa lebih ringan
                    renderTextLayer={false} // optional
                  />
                ))}
              </Document>
            ) : (
              <p className='mt-10 text-center'>Loading PDF...</p>
            )}
          </div>
        </div>

        {/* Tombol Terima & Tolak di Footer */}
        <DialogFooter className='flex justify-end gap-2'>
          <Button
            variant='outline'
            className='flex items-center gap-2'
            onClick={() => handleAction('terima')}
          >
            <Check size={16} /> Terima
          </Button>
          <Button
            variant='destructive'
            className='flex items-center gap-2'
            onClick={() => handleAction('tolak')}
          >
            <X size={16} /> Tolak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
