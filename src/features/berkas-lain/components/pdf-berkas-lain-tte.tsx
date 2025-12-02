/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState } from 'react'
import { type BerkasLain } from '@/api'
import { PDFDocument } from 'pdf-lib'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Rnd } from 'react-rnd'
import { useAuthStore } from '@/stores/auth-store'
import { createQRCodeWithLogo } from '@/lib/utils'

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

export default function PdfEditorPdfLib({
  currentRow,
  onExport,
  onSaveTrigger,
}: {
  currentRow?: BerkasLain
  onExport?: (file: File) => void
  onSaveTrigger?: (fn: () => Promise<void>) => void
}) {
  const ASSET_URL = import.meta.env.VITE_ASSET_URL
  const user = useAuthStore((s) => s.user)

  const [pdfUrl] = useState(
    `${ASSET_URL}public-file/${currentRow?.nama_file_asli}`
  )

  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [elements, setElements] = useState<ElementItem[]>([])

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // ============================
  // GET ORIGINAL PDF SIZE
  // ============================
  const handlePageLoad = (page: any) => {
    const viewport = page.getViewport({ scale: 1 })
    setCanvasSize({
      width: viewport.width,
      height: viewport.height,
    })
  }

  // ============================
  // ADD ELEMENT
  // ============================
  const addBarcode = async () => {
    const link = `${window.location.origin}/verify-tte-berkaslain/${currentRow?.id}`
    const qr = await createQRCodeWithLogo(link, '/images/logo-sepeda-murah.png')

    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'barcode',
        src: qr,
        page: pageNumber,
        x: 40,
        y: 40,
        width: 90,
        height: 90,
      },
    ])
  }

  const addVisual = () => {
    const imgUrl = `${ASSET_URL}public-file/visualisasi_tte/${user?.visualisasi_tte}`

    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'image',
        src: imgUrl,
        page: pageNumber,
        x: 40,
        y: 40,
        width: 90,
        height: 90,
      },
    ])
  }

  // ============================
  // EXPORT PDF — FIXED !!!
  // ============================
  const exportToPDF = useCallback(async () => {
    const container = document.getElementById('pdf-container')
    if (!container) return

    const rect = container.getBoundingClientRect()
    const existingPdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()

    for (const el of elements) {
      const page = pages[el.page - 1]
      const pdfWidth = page.getWidth()
      const pdfHeight = page.getHeight()

      const scaleX = pdfWidth / rect.width
      const scaleY = pdfHeight / rect.height

      // --- Load image bytes ---
      let imgBytes: Uint8Array
      if (el.src.startsWith('data:image')) {
        const base64 = el.src.split(',')[1]
        imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      } else {
        imgBytes = new Uint8Array(await (await fetch(el.src)).arrayBuffer())
      }

      // --- Try PNG first then JPG ---
      let embeddedImage
      try {
        embeddedImage = await pdfDoc.embedPng(imgBytes)
      } catch {
        embeddedImage = await pdfDoc.embedJpg(imgBytes)
      }

      // --- Translate canvas coords to PDF coords ---
      const X = el.x * scaleX
      const Y = pdfHeight - (el.y + el.height) * scaleY
      const W = el.width * scaleX
      const H = el.height * scaleY

      page.drawImage(embeddedImage, {
        x: X,
        y: Y,
        width: W,
        height: H,
      })
    }

    // --- Save PDF as Uint8Array ---
    const finalBytes = await pdfDoc.save()

    // --- FIX: Convert Uint8Array to ArrayBuffer for Blob ---
    const arrayBuffer = finalBytes.buffer.slice(
      finalBytes.byteOffset,
      finalBytes.byteOffset + finalBytes.byteLength
    )

    const file = new File(
      [arrayBuffer],
      `${currentRow?.nama_dokumen || 'edited'}.pdf`,
      { type: 'application/pdf' }
    )

    onExport?.(file)
  }, [elements, pdfUrl, currentRow])

  // Parent menerima fungsi EXPORT versi terbaru
  useEffect(() => {
    if (onSaveTrigger) onSaveTrigger(exportToPDF)
  }, [exportToPDF])

  // ============================
  // RENDER
  // ============================
  return (
    <div className='flex flex-col items-center gap-4'>
      <div
        id='pdf-container'
        style={{
          position: 'relative',
          border: '1px solid #ddd',
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page
            pageNumber={pageNumber}
            onLoadSuccess={handlePageLoad}
            className='pdf-page'
            canvasRef={(ref) => {
              if (ref) {
                ref.style.pointerEvents = 'none'
                ref.style.position = 'absolute'
                ref.style.top = '0'
                ref.style.left = '0'
              }
            }}
          />
        </Document>

        {/* Draggable Elements */}
        {elements
          .filter((el) => el.page === pageNumber)
          .map((el) => (
            <Rnd
              key={el.id}
              bounds='#pdf-container'
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
                setElements((prev) =>
                  prev.map((x) =>
                    x.id === el.id
                      ? {
                          ...x,
                          width: parseFloat(ref.style.width),
                          height: parseFloat(ref.style.height),
                          x: pos.x,
                          y: pos.y,
                        }
                      : x
                  )
                )
              }}
              style={{
                border: '1px dashed #999',
                background: 'white',
                zIndex: 50,
              }}
            >
              <img
                src={el.src}
                alt=''
                style={{
                  width: '100%',
                  height: '100%',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </Rnd>
          ))}
      </div>

      <p className='text-sm text-gray-500'>
        Halaman {pageNumber} dari {numPages}
      </p>

      <div className='mb-3 flex gap-2'>
        <button
          onClick={addBarcode}
          className='rounded bg-blue-500 px-3 py-1 text-white'
        >
          + Barcode
        </button>
        <button
          onClick={addVisual}
          className='rounded bg-green-500 px-3 py-1 text-white'
        >
          + Visual
        </button>
        <button
          onClick={() => pageNumber > 1 && setPageNumber((p) => p - 1)}
          className='rounded bg-gray-400 px-3 py-1 text-white'
        >
          ← Prev
        </button>
        <button
          onClick={() =>
            pageNumber < (numPages || 1) && setPageNumber((p) => p + 1)
          }
          className='rounded bg-gray-400 px-3 py-1 text-white'
        >
          Next →
        </button>
        <button
          onClick={exportToPDF}
          className='rounded bg-red-500 px-3 py-1 text-white'
        >
          Export PDF
        </button>
      </div>
    </div>
  )
}
