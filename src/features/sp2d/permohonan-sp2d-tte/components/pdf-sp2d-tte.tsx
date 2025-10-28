import { useState, createRef } from 'react'
import { PDFDocument } from 'pdf-lib'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'
import Draggable, { type DraggableData } from 'react-draggable'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
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
  nodeRef?: React.RefObject<HTMLDivElement | null>
}

export default function PdfEditorPdfLib() {
  const [pdfUrl] = useState('http://localhost:5173/pdf/contoh.pdf')
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [elements, setElements] = useState<ElementItem[]>([])

  // Tambah QR/barcode
  const addBarcode = async () => {
    const qr = await createQRCodeWithLogo(
      `SP2D-TTE-${Date.now()}`,
      'http://localhost:5173/images/logo-sepeda-murah.png'
    )
    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'barcode',
        src: qr,
        page: pageNumber,
        x: 50,
        y: 50,
        width: 90,
        height: 90,
        nodeRef: createRef<HTMLDivElement>(),
      },
    ])
  }

  // Tambah logo/image
  const addVisual = () => {
    const imgUrl = 'http://localhost:5173/images/logo-sepeda-murah.png'
    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'image',
        src: imgUrl,
        page: pageNumber,
        x: 50,
        y: 50,
        width: 90,
        height: 90,
        nodeRef: createRef<HTMLDivElement>(),
      },
    ])
  }

  // Update posisi setelah drag
  const handleDragStop = (id: number, data: DraggableData) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x: data.x, y: data.y } : el))
    )
  }

  // Export PDF
  const exportToPDF = async () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#pdf-container')
    if (!canvas) return
    const canvasRect = canvas.getBoundingClientRect()

    const existingPdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()

    for (const el of elements) {
      const page = pages[el.page - 1]
      const pdfWidth = page.getWidth()
      const pdfHeight = page.getHeight()

      const scaleX = pdfWidth / canvasRect.width
      const scaleY = pdfHeight / canvasRect.height

      // ambil image bytes
      let imgBytes: Uint8Array
      if (el.src.startsWith('data:image')) {
        const base64 = el.src.split(',')[1]
        imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      } else {
        imgBytes = new Uint8Array(await (await fetch(el.src)).arrayBuffer())
      }

      let embedded
      try {
        embedded = await pdfDoc.embedPng(imgBytes)
      } catch {
        embedded = await pdfDoc.embedJpg(imgBytes)
      }

      const drawX = el.x * scaleX
      const drawY = scaleY - (el.y + el.height) * scaleY
      const drawWidth = el.width * scaleX
      const drawHeight = el.height * scaleY

      page.drawImage(embedded, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight,
      })
    }

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([Uint8Array.from(pdfBytes)], {
      type: 'application/pdf',
    })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='mb-3 flex gap-2'>
        <a
          onClick={addBarcode}
          className='cursor-pointer rounded bg-blue-500 px-3 py-1 text-white'
        >
          + Barcode
        </a>
        <a
          onClick={addVisual}
          className='cursor-pointer rounded bg-green-500 px-3 py-1 text-white'
        >
          + Visual
        </a>
        <a
          onClick={() => pageNumber > 1 && setPageNumber((p) => p - 1)}
          className={`rounded px-3 py-1 text-white ${
            pageNumber <= 1
              ? 'cursor-not-allowed bg-gray-300'
              : 'cursor-pointer bg-gray-400'
          }`}
        >
          ← Prev
        </a>
        <a
          onClick={() =>
            pageNumber < (numPages || 1) && setPageNumber((p) => p + 1)
          }
          className={`rounded px-3 py-1 text-white ${
            pageNumber >= (numPages || 1)
              ? 'cursor-not-allowed bg-gray-300'
              : 'cursor-pointer bg-gray-400'
          }`}
        >
          Next →
        </a>
        <a
          onClick={exportToPDF}
          className='cursor-pointer rounded bg-red-500 px-3 py-1 text-white'
        >
          💾 Export PDF
        </a>
      </div>

      {/* PDF Viewer */}
      <div
        id='pdf-container'
        style={{ position: 'relative', border: '1px solid #ddd' }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={pageNumber} />
        </Document>

        {/* Draggable overlay */}
        {elements
          .filter((el) => el.page === pageNumber)
          .map((el) => {
            return (
              <Draggable
                key={el.id}
                nodeRef={el.nodeRef}
                bounds='parent'
                defaultPosition={{ x: el.x, y: el.y }}
                onStop={(_e, data) => handleDragStop(el.id, data)}
              >
                <div
                  ref={el.nodeRef}
                  style={{ position: 'absolute', cursor: 'grab' }}
                >
                  <img
                    src={el.src}
                    alt={el.type}
                    style={{
                      width: el.width,
                      height: el.height,
                      userSelect: 'none',
                    }}
                    draggable={false}
                  />
                </div>
              </Draggable>
            )
          })}
      </div>

      <p className='text-sm text-gray-500'>
        Halaman {pageNumber} dari {numPages || '-'}
      </p>
    </div>
  )
}
