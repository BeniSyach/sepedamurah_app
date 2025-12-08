'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignFungsional, type LaporanFungsional } from '@/api'
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
import PdfEditorPdfLib from './penerimaan-tte'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

type LaporanFungsionalPeriksaProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: LaporanFungsional
}

const passSchema = z.object({
  passphrase: z.string().min(3, 'Passphrase wajib diisi'),
})

const formSchema = z.object({
  id: z.string().optional(),
  nama_file: z.string().min(1),
  nama_file_asli: z.any(),
  nama_pengirim: z.string().min(1),
  tanggal_upload: z.string().optional(),
  passphrase: z.string().optional(),
})

type LaporanFungsionalForm = z.infer<typeof formSchema>

export function PenerimaanTTEBerkas({
  open,
  onOpenChange,
  currentRow,
}: LaporanFungsionalPeriksaProps) {
  const user = useAuthStore((s) => s.user)
  // generatePdf selalu async
  const [generatePdf, setGeneratePdf] = useState<() => Promise<void>>(
    async () => {}
  )

  const handleSave = async () => {
    await generatePdf()
  }
  const { mutateAsync: post } = useSignFungsional()

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

  // === Form Passphrase ===
  const passForm = useForm({
    resolver: zodResolver(passSchema),
    defaultValues: { passphrase: '' },
  })

  // Simulasi dialog passphrase aktif via form field
  const showPassDialog = !!form.watch('passphrase')

  const onSubmit = async (data: LaporanFungsionalForm) => {
    if (!data.nama_file_asli) {
      toast.error('Silakan export PDF terlebih dahulu')
      return
    }

    const payload = {
      id: data.id ?? '', // FIX → tidak pernah undefined
      passphrase: data.passphrase ?? '', // FIX → tidak pernah undefined
      tampilan: 'invisible',
      nama_file: currentRow?.nama_file ?? '',
      file: data.nama_file_asli,
    }

    const requestPromise = post(payload)

    await toast.promise(requestPromise, {
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

  const fields: Array<'nama_file' | 'nama_pengirim' | 'tanggal_upload'> = [
    'nama_file',
    'nama_pengirim',
    'tanggal_upload',
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentLarge
        title='Periksa Berkas Fungsional'
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
            <div className='flex-1 overflow-auto border-l'>
              <PdfEditorPdfLib
                currentRow={currentRow}
                onExport={(file) => {
                  form.setValue('nama_file_asli', file) // ← simpan ke form
                }}
                onSaveTrigger={(fn) => setGeneratePdf(() => fn)}
              />
            </div>
          </div>

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
