import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface RupiahInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value: number | string | undefined | null
  onValueChange: (val: number) => void
}

function formatRupiahDisplay(val: number | string | undefined | null): string {
  if (val === '' || val === null || val === undefined) return ''
  const num = typeof val === 'number' ? val : Number(String(val).replace(/\D/g, '')) || 0
  return 'Rp ' + num.toLocaleString('id-ID')
}

export const RupiahInput = React.forwardRef<HTMLInputElement, RupiahInputProps>(
  (
    {
      value,
      onValueChange,
      className,
      placeholder = 'Rp 0',
      onFocus,
      onBlur,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = (forwardedRef as React.RefObject<HTMLInputElement>) || internalRef
    const [displayValue, setDisplayValue] = useState<string>(() => formatRupiahDisplay(value))
    const isEditingRef = useRef(false)

    // Sync external value changes (mis. saat edit data pertama kali terbuka atau reset)
    useEffect(() => {
      if (!isEditingRef.current) {
        setDisplayValue(formatRupiahDisplay(value))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      isEditingRef.current = true
      const input = e.target
      const currentVal = input.value
      const cursorPos = input.selectionStart ?? currentVal.length

      // Hitung jumlah digit angka sebelum kursor untuk menjaga posisi kursor yang presisi
      let digitsBeforeCursor = 0
      for (let i = 0; i < cursorPos; i++) {
        if (/\d/.test(currentVal[i])) {
          digitsBeforeCursor++
        }
      }

      const rawDigits = currentVal.replace(/\D/g, '')

      if (rawDigits === '') {
        setDisplayValue('')
        onValueChange(0)
        return
      }

      const numericVal = Number(rawDigits)
      const formatted = 'Rp ' + numericVal.toLocaleString('id-ID')

      setDisplayValue(formatted)
      onValueChange(numericVal)

      // Kembalikan posisi kursor setelah format angka baru di-render
      requestAnimationFrame(() => {
        if (!input) return
        let count = 0
        let newCursor = formatted.length

        if (digitsBeforeCursor === 0) {
          const firstDigitIndex = formatted.search(/\d/)
          newCursor = firstDigitIndex !== -1 ? firstDigitIndex : formatted.length
        } else {
          for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) {
              count++
            }
            if (count === digitsBeforeCursor) {
              newCursor = i + 1
              break
            }
          }
        }

        try {
          input.setSelectionRange(newCursor, newCursor)
        } catch {
          // ignore if not supported
        }
      })
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      isEditingRef.current = true
      // Otomatis pilih semua teks agar user bisa langsung mengetik angka baru tanpa menghapus manual
      e.target.select()
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      isEditingRef.current = false
      // Saat blur, jika input kosong normalisasi kembali ke format Rupiah standar
      setDisplayValue(formatRupiahDisplay(value))
      onBlur?.(e)
    }

    return (
      <Input
        ref={inputRef}
        type='text'
        inputMode='numeric'
        value={displayValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn('text-right font-medium', className)}
        {...props}
      />
    )
  }
)

RupiahInput.displayName = 'RupiahInput'
