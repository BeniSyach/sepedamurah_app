/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react'
import type { SkppData } from '../types'
import { PDFDocument, rgb } from 'pdf-lib'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Rnd } from 'react-rnd'
import { createQRCodeWithLogo } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { QrCode, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/api/common/client'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

type ElementItem = {
  id: number
  type: 'barcode' | 'image'
  src: string
  page: number
  x: number
  y: number
  width: number
  height: number
}

export interface SkppTteEditorHandle {
  exportToPDF: () => Promise<File | null>
}

interface SkppTteEditorProps {
  currentRow: SkppData
}

export const SkppTteEditor = forwardRef<SkppTteEditorHandle, SkppTteEditorProps>(
  function SkppTteEditor({ currentRow }, ref) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [elements, setElements] = useState<ElementItem[]>([])
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
    const PDF_SCALE = 1

    // Load PDF Blob
    useEffect(() => {
      let isMounted = true
      const loadPdfBlob = async () => {
        try {
          const response = await api.get<Blob>(`/skpp/${currentRow.id}/pdf`, {
            responseType: 'blob',
            params: { t: Date.now() },
          })
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          if (isMounted) setPdfUrl(url)
        } catch (err) {
          console.error('Failed to load PDF for TTE:', err)
        }
      }
      loadPdfBlob()

      return () => {
        isMounted = false
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      }
    }, [currentRow.id])

    const handlePageLoad = (page: any) => {
      const viewport = page.getViewport({ scale: PDF_SCALE })
      setCanvasSize({
        width: viewport.width,
        height: viewport.height,
      })
    }

    // Tambah Barcode / QR
    const addBarcode = async () => {
      const link = `${window.location.origin}/verify-tte/skpp/${currentRow.id}`
      const qr = await createQRCodeWithLogo(
        link,
        '/images/logo-sepeda-murah.png',
        800
      )

      const defaultWidth = 85
      const defaultHeight = 85

      setElements((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'barcode',
          src: qr,
          page: pageNumber,
          x: canvasSize.width ? canvasSize.width * 0.63 : 380,
          y: canvasSize.height ? canvasSize.height * 0.6 : 530,
          width: defaultWidth,
          height: defaultHeight,
        },
      ])
    }

    // EXPORT KE PDF LENGKAP DENGAN STAMP & FOOTER RESMI
    const exportToPDF = useCallback(async (): Promise<File | null> => {
      if (!pdfUrl) return null

      const existingPdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer())
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const pages = pdfDoc.getPages()

      // Catatan Footer Resmi UU ITE & BSrE
      const footerText1 = '- UU ITE No 11 Tahun 2008 Pasal 5 ayat 1'
      const footerText2 =
        '"Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetaknya merupakan alat bukti sah."'
      const footerText3 =
        '- Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan BSrE.'

      const font = await pdfDoc.embedFont('Helvetica')

      pages.forEach((page) => {
        const margin = 28
        const fontSize = 7.5

        page.drawText(footerText1, {
          x: margin,
          y: 33,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        })

        page.drawText(footerText2, {
          x: margin,
          y: 22,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        })

        page.drawText(footerText3, {
          x: margin,
          y: 11,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        })
      })

      // Render Barcode / Visual TTE pada koordinat yang diatur user
      for (const el of elements) {
        const page = pages[el.page - 1]
        if (!page) continue

        const pdfWidth = page.getWidth()
        const pdfHeight = page.getHeight()

        const scaleX = canvasSize.width ? pdfWidth / canvasSize.width : 1
        const scaleY = canvasSize.height ? pdfHeight / canvasSize.height : 1

        let imgBytes: Uint8Array
        if (el.src.startsWith('data:image')) {
          const base64 = el.src.split(',')[1]
          imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
        } else {
          imgBytes = new Uint8Array(await (await fetch(el.src)).arrayBuffer())
        }

        let embeddedImage
        try {
          embeddedImage = await pdfDoc.embedPng(imgBytes)
        } catch {
          embeddedImage = await pdfDoc.embedJpg(imgBytes)
        }

        const X = el.x * scaleX
        const Y = pdfHeight - (el.y + el.height) * scaleY
        const scale = Math.min(scaleX, scaleY)
        const W = el.width * scale
        const H = el.height * scale

        // Tutup tanda placeholder '#' dengan rectangle putih bersih sebelum menimpa barcode
        page.drawRectangle({
          x: X,
          y: Y,
          width: W,
          height: H,
          color: rgb(1, 1, 1),
        })

        page.drawImage(embeddedImage, {
          x: X,
          y: Y,
          width: W,
          height: H,
        })
      }

      const finalBytes = await pdfDoc.save()
      const arrayBuffer = new Uint8Array(finalBytes).buffer

      const cleanNomor = strReplaceSafe(currentRow.nomor_surat)
      return new File([arrayBuffer], `SKPP_TTE_${cleanNomor}.pdf`, {
        type: 'application/pdf',
      })
    }, [elements, pdfUrl, currentRow.nomor_surat, canvasSize])

    useImperativeHandle(ref, () => ({
      exportToPDF,
    }))

    return (
      <div className='flex flex-col items-center gap-3 w-full'>
        {/* TOOLBAR EDITOR */}
        <div className='flex items-center justify-between w-full bg-muted/60 p-2 rounded-lg border text-sm'>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={addBarcode}
              className='flex items-center gap-1.5'
            >
              <QrCode className='w-4 h-4 text-primary' /> Tambah QR Code TTE
            </Button>
          </div>

          {/* PAGINATION PREVIEW */}
          {numPages && numPages > 1 && (
            <div className='flex items-center gap-1.5'>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className='w-4 h-4' />
              </Button>
              <span className='text-xs'>
                Halaman {pageNumber} dari {numPages}
              </span>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          )}
        </div>

        {/* CANVAS PDF DENGAN DRAGGABLE RND */}
        <div className='overflow-auto max-h-[65vh] border rounded-lg p-2 bg-slate-100 dark:bg-slate-950 flex justify-center w-full'>
          {pdfUrl ? (
            <div
              id='skpp-pdf-container'
              style={{
                position: 'relative',
                width: canvasSize.width || 'auto',
                height: canvasSize.height || 'auto',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={PDF_SCALE}
                  onLoadSuccess={handlePageLoad}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>

              {/* Elemen Draggable */}
              {elements
                .filter((el) => el.page === pageNumber)
                .map((el) => (
                  <Rnd
                    key={el.id}
                    bounds='#skpp-pdf-container'
                    lockAspectRatio={el.type === 'barcode'}
                    size={{ width: el.width, height: el.height }}
                    position={{ x: el.x, y: el.y }}
                    onDragStop={(_e, data) => {
                      setElements((prev) =>
                        prev.map((x) =>
                          x.id === el.id ? { ...x, x: data.x, y: data.y } : x
                        )
                      )
                    }}
                    onResizeStop={(_e, _d, ref, _delta, pos) => {
                      const width = parseFloat(ref.style.width)
                      const height = parseFloat(ref.style.height)

                      setElements((prev) =>
                        prev.map((x) => {
                          if (x.id !== el.id) return x
                          return {
                            ...x,
                            width,
                            height: x.type === 'barcode' ? width : height,
                            x: pos.x,
                            y: pos.y,
                          }
                        })
                      )
                    }}
                    style={{
                      border: '2px dashed #0284c7',
                      background: 'rgba(255, 255, 255, 0.85)',
                      cursor: 'move',
                      zIndex: 10,
                    }}
                  >
                    <img
                      src={el.src}
                      alt={el.type}
                      className='w-full h-full object-contain pointer-events-none'
                    />
                  </Rnd>
                ))}
            </div>
          ) : (
            <div className='py-16 text-center text-muted-foreground text-sm'>
              Sedang memuat dokumen PDF...
            </div>
          )}
        </div>
      </div>
    )
  }
)

function strReplaceSafe(str?: string) {
  if (!str) return 'SKPP'
  return str.replace(/[\/\s]/g, '_')
}
