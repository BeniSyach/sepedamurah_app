import { format, isValid, parse, parseISO } from 'date-fns'
import { type ClassValue, clsx } from 'clsx'
import { id } from 'date-fns/locale'
import QRCode from 'qrcode'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5 // Maximum number of page buttons to show
  const rangeWithDots = []

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i)
    }
  } else {
    // Always show first page
    rangeWithDots.push(1)

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    }
  }

  return rangeWithDots
}

/**
 * Format angka ke format Rupiah (Rp 1.000,00)
 * @param value Nilai angka yang akan diformat
 * @param withPrefix Tambahkan "Rp" di depan (default: true)
 * @returns string, contoh: "Rp 10.000,00"
 */
export function formatRupiah(value: unknown, withPrefix = true): string {
  // Konversi ke number, fallback ke 0
  const number = Number(value) || 0

  // Format dengan 2 digit desimal
  const formatted = number.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return withPrefix ? `Rp ${formatted}` : formatted
}

export function formatRupiahControlled(value: string | number): string {
  const number = Number(String(value).replace(/\D/g, '')) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}

/**
 * Format tanggal ISO (ex: "2025-01-02T00:00:00.000000Z")
 * menjadi format "dd-MM-yyyy" (ex: "02-01-2025")
 */
export function formatTanggal(dateString?: string | null): string {
  if (!dateString) return '-'

  try {
    const date = parseISO(dateString)
    return format(date, 'dd-MM-yyyy', { locale: id })
  } catch {
    return '-'
  }
}

/**
 * Format tanggal dengan nama bulan (contoh: "26 September 2025")
 */
export function formatTanggalLengkap(dateString?: string | null): string {
  if (!dateString) return '-'

  try {
    const date = parseISO(dateString)
    return format(date, 'dd MMMM yyyy', { locale: id })
  } catch {
    return '-'
  }
}

/**
 * Format tanggal "YYYY-MM-DD HH:mm:ss" menjadi "dd-MM-yyyy" atau "dd-MM-yyyy HH:mm:ss" jika ada jam
 */
export function formatTanggaldanJam(dateString?: string | null): string {
  if (!dateString) return '-'

  try {
    const date = parse(dateString, 'yyyy-MM-dd HH:mm:ss', new Date())
    if (!isValid(date)) return '-'

    const hasTime =
      date.getHours() !== 0 ||
      date.getMinutes() !== 0 ||
      date.getSeconds() !== 0
    return hasTime
      ? format(date, 'dd-MM-yyyy HH:mm:ss', { locale: id })
      : format(date, 'dd-MM-yyyy', { locale: id })
  } catch {
    return '-'
  }
}

export function getNamaBulan(dateString?: string | null): string {
  if (!dateString) return '-'
  try {
    const date = parseISO(dateString)
    return format(date, 'MMMM', { locale: id })
  } catch {
    return '-'
  }
}

/**
 * Ambil jam dari tanggal/waktu (contoh: "2025-07-14 01:11:31" → "01:11:31")
 */
export function getJam(dateString?: string | null): string {
  if (!dateString) return '-'
  try {
    const date = parseISO(dateString)
    return format(date, 'HH:mm:ss')
  } catch {
    return '-'
  }
}

/**
 * Generate QR Code dengan logo di tengah
 * @param text Teks yang ingin di-encode
 * @param logoUrl URL logo (bisa dari aset backend)
 * @param size Ukuran QR Code (default: 200)
 * @returns dataURL base64 PNG
 */
export async function createQRCodeWithLogo(
  text: string,
  logoUrl: string,
  size = 200
): Promise<string> {
  // Buat canvas
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context gagal dibuat')

  // Generate QR code di canvas
  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  })

  // Load logo
  const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // penting untuk hindari CORS error
    img.src = logoUrl
    img.onload = () => resolve(img)
    img.onerror = reject
  })

  // Hitung posisi tengah
  const logoSize = size * 0.25 // 25% dari ukuran QR
  const x = (size - logoSize) / 2
  const y = (size - logoSize) / 2

  // Gambar background putih untuk logo agar QR tetap bisa discan
  ctx.fillStyle = 'white'
  ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)

  // Gambar logo di tengah
  ctx.drawImage(logo, x, y, logoSize, logoSize)

  return canvas.toDataURL('image/png')
}
