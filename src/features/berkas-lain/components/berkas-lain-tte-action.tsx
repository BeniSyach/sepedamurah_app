'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignBerkasLain, type BerkasLain } from '@/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogContentLarge,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/date-picker'
import PdfEditorPdfLib from './pdf-berkas-lain-tte'

const passSchema = z.object({
  passphrase: z.string().min(3, 'Passphrase wajib diisi'),
})

const formSchema = z.object({
  id: z.string().optional(),
  tgl_surat: z.date('tanggal Surat Harus Ada.'),
  nama_file_asli: z
    .any()
    .refine(
      (val) =>
        (val instanceof FileList &&
          val.length > 0 &&
          val[0].type === 'application/pdf') ||
        (typeof val === 'string' && val.trim() !== ''),
      'File harus PDF atau sudah ada file sebelumnya.'
    ),
  nama_dokumen: z.string().min(1, 'nama dokumen Harus Ada.'),
  users_id: z.string().min(1, 'User Harus Ada.'),
  passphrase: z.string().optional(),
})
type BerkasLainForm = z.infer<typeof formSchema>

type BerkasLainActionDialogProps = {
  currentRow?: BerkasLain
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BerkasLainTTE({
  currentRow,
  open,
  onOpenChange,
}: BerkasLainActionDialogProps) {
  const isEdit = !!currentRow
  const user = useAuthStore((s) => s.user)
  const { mutateAsync: postBerkasLainAsync } = useSignBerkasLain()
  // generatePdf selalu async
  const [generatePdf, setGeneratePdf] = useState<() => Promise<void>>(
    async () => {}
  )

  const handleSave = async () => {
    await generatePdf()
  }

  const form = useForm<BerkasLainForm>({
    resolver: zodResolver(formSchema),
    defaultValues:
      isEdit && currentRow
        ? {
            id: currentRow.id ?? '',
            nama_dokumen: currentRow.nama_dokumen ?? '',
            nama_file_asli: currentRow.nama_file_asli,
            users_id: currentRow.users_id?.toString() ?? '',
            tgl_surat: currentRow.tgl_surat
              ? new Date(currentRow.tgl_surat)
              : new Date(),
          }
        : {
            id: '',
            nama_dokumen: '',
            nama_file_asli: undefined,
            users_id: user?.id.toString(),
            tgl_surat: new Date(),
          },
  })

  // === Form Passphrase ===
  const passForm = useForm({
    resolver: zodResolver(passSchema),
    defaultValues: { passphrase: '' },
  })

  // Simulasi dialog passphrase aktif via form field
  const showPassDialog = !!form.watch('passphrase')

  const onSubmit = async (data: BerkasLainForm) => {
    if (!data.nama_file_asli) {
      toast.error('Silakan export PDF terlebih dahulu')
      return
    }

    const payload = {
      id: data.id ?? '', // FIX → tidak pernah undefined
      passphrase: data.passphrase ?? '', // FIX → tidak pernah undefined
      tampilan: 'invisible',
      nama_file: currentRow?.nama_dokumen ?? '',
      file: data.nama_file_asli,
    }

    const requestPromise = postBerkasLainAsync(payload)

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

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContentLarge
        title='Form TTE Berkas Lain'
        description='Lengkapi data di bawah ini.'
      >
        <div className='flex h-full flex-col'>
          {/* FORM + DOCUMENT */}
          <div className='flex flex-1 gap-4 overflow-hidden'>
            <div className='flex-1 overflow-y-auto border-r p-3'>
              <Form {...form}>
                <form
                  id='berkas-masuk-form'
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4 px-0.5'
                >
                  <FormField
                    control={form.control}
                    name='tgl_surat'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Tanggal Surat
                        </FormLabel>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='nama_dokumen'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Nama Berkas
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Nama Berkas'
                            className='col-span-4'
                            autoComplete='off'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
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
