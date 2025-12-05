/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState } from 'react'
import { type BerkasLain } from '@/api'
import { PDFDocument, rgb, degrees } from 'pdf-lib'
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

type PageDimensions = {
  width: number
  height: number
  isLandscape: boolean
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
  const [pageDimensions, setPageDimensions] = useState<
    Record<number, PageDimensions>
  >({})

  const PDF_SCALE = 1
  const currentPageDim = pageDimensions[pageNumber] || {
    width: 0,
    height: 0,
    isLandscape: false,
  }

  const handlePageLoad = (page: any) => {
    const viewport = page.getViewport({ scale: PDF_SCALE })
    const width = viewport.width
    const height = viewport.height
    const isLandscape = width > height

    // console.log(`📄 Page ${pageNumber} loaded:`, { width, height, isLandscape })

    setPageDimensions((prev) => ({
      ...prev,
      [pageNumber]: { width, height, isLandscape },
    }))
  }

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
        x: 40,
        y: currentPageDim.height - (defaultHeight + 20),
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
        x: 140,
        y: currentPageDim.height - (defaultHeight + 20),
        width: defaultWidth,
        height: defaultHeight,
      },
    ])
  }

  const exportToPDF = useCallback(async () => {
    const existingPdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()

    const footerText1 = '- UU ITE No 11 Tahun 2008 Pasal 5 ayat 1'
    const footerText2 =
      '"Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetaknya merupakan alat bukti sah."'
    const footerText3 =
      '- Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan BsrE.'

    const font = await pdfDoc.embedFont('Helvetica')

    pages.forEach((page) => {
      const pageWidth = page.getWidth()
      const pageHeight = page.getHeight()
      const rotation = page.getRotation().angle
      const margin = 40
      const fontSize = 9

      // console.log(
      //   `Page ${index + 1}: ${pageWidth}x${pageHeight}, rotation: ${rotation}°`
      // )

      if (rotation === 90 || rotation === 270) {
        if (rotation === 90) {
          page.drawText(footerText1, {
            x: pageWidth - 40,
            y: margin,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            rotate: degrees(90),
          })
          page.drawText(footerText2, {
            x: pageWidth - 27,
            y: margin,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            rotate: degrees(90),
          })
          page.drawText(footerText3, {
            x: pageWidth - 14,
            y: margin,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            rotate: degrees(90),
          })
        } else {
          page.drawText(footerText1, {
            x: 40,
            y: pageHeight - margin,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            rotate: degrees(270),
          })
          page.drawText(footerText2, {
            x: 27,
            y: pageHeight - margin,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            rotate: degrees(270),
          })
          page.drawText(footerText3, {
            x: 14,
            y: pageHeight - margin,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            rotate: degrees(270),
          })
        }
      } else {
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
      }
    })
    let barcodeIndex = 0
    for (const el of elements) {
      const page = pages[el.page - 1]
      const pdfWidth = page.getWidth()
      const pdfHeight = page.getHeight()
      const rotation = page.getRotation().angle

      const canvasDim = pageDimensions[el.page]
      if (!canvasDim) {
        // console.warn(`Dimensi halaman ${el.page} tidak ditemukan`)
        continue
      }

      const scaleX = pdfWidth / canvasDim.width
      const scaleY = pdfHeight / canvasDim.height

      let correction = 0
      let correctionX = 0

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
        try {
          embeddedImage = await pdfDoc.embedJpg(imgBytes)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // console.error('Failed to embed image:', error)
          continue
        }
      }

      if (rotation === 90 && el.type === 'barcode') {
        barcodeIndex++

        // Barcode ke-1
        if (barcodeIndex === 1) {
          correction = 0
          correctionX = 10
        }
        // Barcode ke-2
        else if (barcodeIndex === 2) {
          correction = 160
          correctionX = 25
        }
        // Barcode 3+ (fallback)
        else {
          correction = 40
          correctionX = 10
        }
      }

      // =======================================================
      // Correction untuk IMAGE (seperti kode kamu sebelumnya)
      // =======================================================
      if (rotation === 90 && el.type === 'image') {
        correction = 160
        correctionX = 25
      }

      // =======================================================
      // ROTATION 90° MODE
      // =======================================================
      if (rotation === 90) {
        const pdfX =
          (canvasDim.height - el.y - el.height) * scaleY + 100 - correctionX

        const pdfY = el.x * scaleX + correction

        const W = el.height * scaleY
        const H = el.width * scaleX

        page.drawImage(embeddedImage, {
          x: pdfX,
          y: pdfY,
          width: W,
          height: H,
          rotate: degrees(90),
        })

        continue
      } else if (rotation === 270) {
        const pdfX = el.y * scaleY
        const pdfY = (canvasDim.width - el.x - el.width) * scaleX
        const W = el.height * scaleY
        const H = el.width * scaleX

        // console.log(
        //   `🔄 270° ${el.type}: canvas(${el.x},${el.y}) -> pdf(${pdfX.toFixed(1)},${pdfY.toFixed(1)})`
        // )

        page.drawImage(embeddedImage, {
          x: pdfX,
          y: pdfY,
          width: W,
          height: H,
          rotate: degrees(270),
        })
      } else if (rotation === 180) {
        const pdfX = (canvasDim.width - el.x - el.width) * scaleX
        const pdfY = el.y * scaleY
        const W = el.width * scaleX
        const H = el.height * scaleY

        // console.log(
        //   `🔄 180° ${el.type}: canvas(${el.x},${el.y}) -> pdf(${pdfX.toFixed(1)},${pdfY.toFixed(1)})`
        // )

        page.drawImage(embeddedImage, {
          x: pdfX,
          y: pdfY,
          width: W,
          height: H,
          rotate: degrees(180),
        })
      } else {
        // No rotation
        const pdfX = el.x * scaleX
        const pdfY = pdfHeight - (el.y + el.height) * scaleY
        const W = el.width * scaleX
        const H = el.height * scaleY

        // console.log(
        //   `📄 0° ${el.type}: canvas(${el.x},${el.y}) -> pdf(${pdfX.toFixed(1)},${pdfY.toFixed(1)})`
        // )

        page.drawImage(embeddedImage, {
          x: pdfX,
          y: pdfY,
          width: W,
          height: H,
        })
      }
    }

    // const finalBytes = await pdfDoc.save()
    // const arrayBuffer = new Uint8Array(finalBytes).buffer

    // const file = new File([arrayBuffer], `${currentRow?.nama_dokumen}.pdf`, {
    //   type: 'application/pdf',
    // })

    // onExport?.(file)

    const finalBytes = await pdfDoc.save()
    const blob = new Blob([finalBytes], { type: 'application/pdf' })

    window.open(URL.createObjectURL(blob), '_blank')

    const file = new File(
      [blob],
      `${currentRow?.nama_dokumen ?? 'export'}.pdf`,
      {
        type: 'application/pdf',
      }
    )
    onExport?.(file)
  }, [elements, pdfUrl, currentRow, pageDimensions])

  useEffect(() => {
    if (onSaveTrigger) onSaveTrigger(exportToPDF)
  }, [exportToPDF, onSaveTrigger])

  return (
    <div className='flex flex-col items-center gap-4'>
      <div
        id='pdf-container'
        style={{
          position: 'relative',
          border: '1px solid #ddd',
          width: currentPageDim.width || 'auto',
          height: currentPageDim.height || 'auto',
          backgroundColor: '#f5f5f5',
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
                border: '2px dashed #4CAF50',
                background: 'rgba(255, 255, 255, 0.9)',
                zIndex: 50,
                cursor: 'move',
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
                  objectFit: 'contain',
                }}
              />
            </Rnd>
          ))}
      </div>

      <p className='text-sm text-gray-500'>
        Halaman {pageNumber} dari {numPages}
        {currentPageDim.isLandscape ? ' 🔄 Landscape' : ' 📄 Portrait'}
        {currentPageDim.width > 0 &&
          ` - ${Math.round(currentPageDim.width)}x${Math.round(currentPageDim.height)}px`}
      </p>

      <div className='mb-3 flex flex-wrap gap-2'>
        <button
          onClick={addBarcode}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300'
          disabled={currentPageDim.width === 0}
        >
          + Barcode QR
        </button>
        <button
          onClick={addVisual}
          className='rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-300'
          disabled={currentPageDim.width === 0}
        >
          + Visualisasi TTE
        </button>
        <button
          onClick={() => pageNumber > 1 && setPageNumber((p) => p - 1)}
          className='rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500'
          disabled={pageNumber <= 1}
        >
          ← Prev
        </button>
        <button
          onClick={() =>
            pageNumber < (numPages || 1) && setPageNumber((p) => p + 1)
          }
          className='rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500'
          disabled={pageNumber >= (numPages || 1)}
        >
          Next →
        </button>
        <button
          onClick={exportToPDF}
          className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'
        >
          💾 Export PDF
        </button>
      </div>
    </div>
  )
}
