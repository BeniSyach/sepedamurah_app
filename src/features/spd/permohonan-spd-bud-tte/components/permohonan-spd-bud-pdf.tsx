/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState } from 'react'
import { type SpdTerkirim } from '@/api'
import { PDFDocument, rgb } from 'pdf-lib'
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
  currentRow?: SpdTerkirim
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
  const PDF_SCALE = 1.35
  // ============================
  // GET ORIGINAL PDF SIZE
  // ============================
  const handlePageLoad = (page: any) => {
    const viewport = page.getViewport({ scale: PDF_SCALE })
    setCanvasSize({
      width: viewport.width,
      height: viewport.height,
    })
  }

  // ============================
  // ADD ELEMENT
  // ============================
  const addBarcode = async () => {
    const link = `${window.location.origin}/verify-tte/berkaslain/${currentRow?.id}`
    const qr = await createQRCodeWithLogo(link, '/images/logo-sepeda-murah.png')

    const defaultWidth = 90
    const defaultHeight = 90

    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'barcode',
        src: qr,
        page: pageNumber,

        // ⬇⬇ MUNCUL di FOOTER
        x: 40,
        y: canvasSize.height - (defaultHeight + 20),

        width: defaultWidth,
        height: defaultHeight,
      },
    ])
  }

  const addVisual = () => {
    const imgUrl = `${ASSET_URL}public-file/visualisasi_tte/${user?.visualisasi_tte}`

    const defaultWidth = 90
    const defaultHeight = 90

    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'image',
        src: imgUrl,
        page: pageNumber,

        // ⬇⬇ MUNCUL di FOOTER
        x: 140,
        y: canvasSize.height - (defaultHeight + 20),

        width: defaultWidth,
        height: defaultHeight,
      },
    ])
  }

  // ============================
  // EXPORT PDF — FIXED !!!
  // ============================
  const exportToPDF = useCallback(async () => {
    const existingPdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()

    // ===============================
    // FOOTER TEXT (3 baris)
    // ===============================
    const footerText1 = '- UU ITE No 11 Tahun 2008 Pasal 5 ayat 1'
    const footerText2 =
      '"Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetaknya merupakan alat bukti sah."'
    const footerText3 =
      '- Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan BsrE.'

    // Font PDF
    const font = await pdfDoc.embedFont('Helvetica')

    // Loop halaman PDF
    pages.forEach((page) => {
      const margin = 40
      const fontSize = 9

      page.drawText(footerText1, {
        x: margin,
        y: 40,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })

      page.drawText(footerText2, {
        x: margin,
        y: 27,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })

      page.drawText(footerText3, {
        x: margin,
        y: 14,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })
    })

    // ===============================
    // RENDER ELEMENT (barcode + image)
    // ===============================
    for (const el of elements) {
      const page = pages[el.page - 1]
      const pdfWidth = page.getWidth()
      const pdfHeight = page.getHeight()

      const scaleX = pdfWidth / canvasSize.width
      const scaleY = pdfHeight / canvasSize.height

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
      const W = el.width * scaleX
      const H = el.height * scaleY

      page.drawImage(embeddedImage, {
        x: X,
        y: Y,
        width: W,
        height: H,
      })
    }

    const finalBytes = await pdfDoc.save()
    const arrayBuffer = new Uint8Array(finalBytes).buffer

    const file = new File([arrayBuffer], `${currentRow?.namafile}.pdf`, {
      type: 'application/pdf',
    })

    onExport?.(file)
  }, [elements, pdfUrl, currentRow, canvasSize])

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
            scale={PDF_SCALE}
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
