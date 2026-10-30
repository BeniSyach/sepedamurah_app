'use client'

import { useState, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogFooter,
  DialogContentLarge,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useSkpp } from './skpp-provider'
import { SkppTteEditor, type SkppTteEditorHandle } from './skpp-tte'

interface SkppTteActionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const passSchema = z.object({
  passphrase: z.string().min(3, 'Passphrase wajib diisi minimal 3 karakter'),
})

type PassForm = z.infer<typeof passSchema>

export function SkppTteAction({ open, onOpenChange }: SkppTteActionProps) {
  const { currentRow, signSkpp } = useSkpp()
  const [exportedPdfFile, setExportedPdfFile] = useState<File | null>(null)
  const [showPassDialog, setShowPassDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const editorRef = useRef<SkppTteEditorHandle>(null)

  const passForm = useForm<PassForm>({
    resolver: zodResolver(passSchema),
    defaultValues: { passphrase: '' },
  })

  if (!currentRow) return null

  // Langkah 1: Klik "Lanjutkan ke Penandatanganan"
  const handleOpenPassphrase = async () => {
    if (editorRef.current) {
      const file = await editorRef.current.exportToPDF()
      setExportedPdfFile(file)
    }
    setShowPassDialog(true)
  }

  // Langkah 2: Submit Passphrase
  const onSubmitPass = async (values: PassForm) => {
    try {
      setIsProcessing(true)

      await signSkpp({
        id: currentRow.id.toString(),
        file: exportedPdfFile || undefined,
        passphrase: values.passphrase,
        nama_file: `SKPP_${currentRow.nomor_surat.replace(/[\/\s]/g, '_')}`,
      })

      setShowPassDialog(false)
      onOpenChange(false)
    } catch (err: any) {
      // toast error handled in provider
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* DIALOG UTAMA: EDITOR TATA LETAK QR & TTD VISUAL */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContentLarge
          title={`Tanda Tangan Elektronik (TTE) — SKPP ${currentRow.nama}`}
          description='Atur posisi stempel QR Code Verifikasi TTE pada dokumen di bawah ini, lalu klik Lanjutkan ke Penandatanganan.'
        >
          <div className='flex h-full flex-col justify-between'>
            <div className='flex-1 overflow-y-auto px-1 py-2'>
              <SkppTteEditor
                ref={editorRef}
                currentRow={currentRow}
              />
            </div>

            {/* FOOTER AKSI */}
            <DialogFooter className='mt-3 flex items-center justify-between border-t pt-3'>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <ShieldCheck className='w-4 h-4 text-emerald-600' />
                Dokumen akan diproses dengan Sertifikat Elektronik Resmi Pemkab Serdang Bedagai.
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                >
                  Batal
                </Button>
                <Button
                  type='button'
                  className='flex items-center gap-1.5 bg-primary'
                  onClick={handleOpenPassphrase}
                >
                  <KeyRound className='w-4 h-4' /> Lanjutkan ke Penandatanganan
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContentLarge>
      </Dialog>

      {/* DIALOG KEDUA: INPUT PASSPHRASE */}
      <Dialog open={showPassDialog} onOpenChange={setShowPassDialog}>
        <DialogContent className='max-w-md'>
          <Form {...passForm}>
            <form onSubmit={passForm.handleSubmit(onSubmitPass)}>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2 text-primary'>
                  <KeyRound className='w-5 h-5' /> Masukkan Passphrase TTE
                </DialogTitle>
                <DialogDescription>
                  Masukkan kata sandi / passphrase sertifikat elektronik Anda untuk menandatangani dokumen SKPP atas nama{' '}
                  <span className='font-semibold text-foreground'>{currentRow.nama}</span>.
                </DialogDescription>
              </DialogHeader>

              <div className='py-4 space-y-3'>
                <FormField
                  control={passForm.control}
                  name='passphrase'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passphrase Penandatangan</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Masukkan passphrase sertifikat...'
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className='text-xs text-muted-foreground'>
                  Pastikan passphrase sesuai dengan data sertifikat e-Sign BSrE Anda.
                </p>
              </div>

              <DialogFooter className='gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  disabled={isProcessing}
                  onClick={() => setShowPassDialog(false)}
                >
                  Kembali
                </Button>
                <Button
                  type='submit'
                  disabled={isProcessing}
                  className='flex items-center gap-1.5'
                >
                  <CheckCircle2 className='w-4 h-4' />{' '}
                  {isProcessing ? 'Memproses TTE...' : 'Tandatangani Dokumen'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
