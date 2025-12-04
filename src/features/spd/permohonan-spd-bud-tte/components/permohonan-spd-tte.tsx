'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type SpdTerkirim, useSignSpdKirim } from '@/api'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'
import { pdfjs } from 'react-pdf'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogFooter,
  DialogContentLarge,
  DialogContent,
  DialogTitle,
  DialogHeader,
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
import PdfEditorPdfLib from './permohonan-spd-bud-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

type PermohonanSPDPeriksaProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: SpdTerkirim
}

const passSchema = z.object({
  passphrase: z.string().min(3, 'Passphrase wajib diisi'),
})

const formSchema = z.object({
  id: z.string().optional(),
  namafile: z.string().min(1),
  nama_file_asli: z.any(),
  nama_penerima: z.string().min(1),
  tanggal_upload: z.string().optional(),
  passphrase: z.string().optional(),
})

type PermohonanSPDForm = z.infer<typeof formSchema>

export function PermohonanSPDTerkirimTTE({
  open,
  onOpenChange,
  currentRow,
}: PermohonanSPDPeriksaProps) {
  // generatePdf selalu async
  const [generatePdf, setGeneratePdf] = useState<() => Promise<void>>(
    async () => {}
  )

  const handleSave = async () => {
    await generatePdf()
  }
  const user = useAuthStore((s) => s.user)

  const { mutateAsync: post } = useSignSpdKirim()

  const form = useForm<PermohonanSPDForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: currentRow?.id || '',
      namafile: currentRow?.namafile || '',
      nama_file_asli: currentRow?.nama_file_asli || undefined,
      nama_penerima: currentRow?.nama_penerima || user?.name,
      tanggal_upload: currentRow?.tanggal_upload || '',
    },
  })

  // === Form Passphrase ===
  const passForm = useForm({
    resolver: zodResolver(passSchema),
    defaultValues: { passphrase: '' },
  })

  // Simulasi dialog passphrase aktif via form field
  const showPassDialog = !!form.watch('passphrase')

  const onSubmit = async (data: PermohonanSPDForm) => {
    if (!data.nama_file_asli) {
      toast.error('Silakan export PDF terlebih dahulu')
      return
    }

    const payload = {
      id: data.id ?? '', // FIX → tidak pernah undefined
      nama_file: data.namafile ?? '', // FIX → tidak pernah undefined
      passphrase: data.passphrase ?? '', // FIX → tidak pernah undefined
      tampilan: 'invisible',
      file: data.nama_file_asli,
    }

    const req = post(payload)
    await toast.promise(req, {
      loading: 'Mengirim & menandatangani PDF...',
      success: () => {
        onOpenChange(false)
        return 'PDF berhasil ditandatangani!'
      },
      error: (err) => {
        return err.response.data.detail.error
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitPass = async (values: any) => {
    await handleSave() // 🚀 Generate PDF dulu

    form.setValue('passphrase', values.passphrase)
    onSubmit(form.getValues())
  }

  const fields: Array<'namafile' | 'nama_penerima' | 'tanggal_upload'> = [
    'namafile',
    'nama_penerima',
    'tanggal_upload',
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentLarge
        title='Periksa Berkas SPD'
        description='Lengkapi data di bawah ini.'
      >
        <div className='flex h-full flex-col'>
          {/* FORM + DOCUMENT */}
          <div className='flex flex-1 gap-4 overflow-hidden'>
            <div className='flex-[0.5] overflow-y-auto border-r p-3'>
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
            <div className='flex-1 overflow-auto border-l p-10'>
              <PdfEditorPdfLib
                currentRow={currentRow}
                onExport={(file) => {
                  form.setValue('nama_file_asli', file) // ← simpan ke form
                }}
                onSaveTrigger={(fn) => setGeneratePdf(() => fn)}
              />
            </div>
          </div>

          {/* Tombol Terima & Tolak di Footer */}
          <DialogFooter>
            <Button
              type='button'
              onClick={() => form.setValue('passphrase', 'open')}
            >
              Passpharase
            </Button>
          </DialogFooter>
        </div>
      </DialogContentLarge>
      {/* === DIALOG PASSPHRASE === */}
      <Dialog
        open={showPassDialog}
        onOpenChange={(v) => {
          if (!v) form.setValue('passphrase', '')
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Masukkan Passphrase</DialogTitle>
          </DialogHeader>

          <Form {...passForm}>
            <form
              onSubmit={passForm.handleSubmit(onSubmitPass)}
              className='space-y-3'
            >
              <FormField
                control={passForm.control}
                name='passphrase'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passphrase</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Ketik passphrase...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => form.setValue('passphrase', '')}
                >
                  Batal
                </Button>

                <Button type='submit'>Kirim</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
