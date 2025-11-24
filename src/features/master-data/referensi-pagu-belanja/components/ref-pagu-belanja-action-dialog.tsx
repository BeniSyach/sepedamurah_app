'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useGetRefUrusan,
  useGetRefBidangUrusan,
  useGetRefProgram,
  useGetRefKegiatan,
  useGetRefSubKegiatan,
  useGetRefRekening,
  useGetRefSKPD,
  type BidangUrusan,
  type Program,
  type PaguBelanja,
  type Kegiatan,
  type SubKegiatan,
  type Rekening,
  type MasterSkpd,
  type Urusan,
} from '@/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  tahun_rek: z.string().min(1, 'Tahun Rekening is required.'),
  kd_urusan: z.string().min(1, 'Urusan is required.'),
  kd_bu1: z.string().min(1, 'Bidang Urusan is required.'),
  kd_bu2: z.string().min(1, 'Bidang Urusan is required.'),
  kd_prog1: z.string().min(1, 'Program is required.'),
  kd_prog2: z.string().min(1, 'Program is required.'),
  kd_prog3: z.string().min(1, 'Program is required.'),
  kd_keg1: z.string().min(1, 'Kegiatan is required.'),
  kd_keg2: z.string().min(1, 'Kegiatan is required.'),
  kd_keg3: z.string().min(1, 'Kegiatan is required.'),
  kd_keg4: z.string().min(1, 'Kegiatan is required.'),
  kd_keg5: z.string().min(1, 'Kegiatan is required.'),
  kd_subkeg1: z.string().min(1, 'Sub Kegiatan is required.'),
  kd_subkeg2: z.string().min(1, 'Sub Kegiatan is required.'),
  kd_subkeg3: z.string().min(1, 'Sub Kegiatan is required.'),
  kd_subkeg4: z.string().min(1, 'Sub Kegiatan is required.'),
  kd_subkeg5: z.string().min(1, 'Sub Kegiatan is required.'),
  kd_subkeg6: z.string().min(1, 'Sub Kegiatan is required.'),
  kd_rekening1: z.string().min(1, 'Rekening is required.'),
  kd_rekening2: z.string().min(1, 'Rekening is required.'),
  kd_rekening3: z.string().min(1, 'Rekening is required.'),
  kd_rekening4: z.string().min(1, 'Rekening is required.'),
  kd_rekening5: z.string().min(1, 'Rekening is required.'),
  kd_rekening6: z.string().min(1, 'Rekening is required.'),
  kd_opd1: z.string().min(1, 'SKPD is required.'),
  kd_opd2: z.string().min(1, 'SKPD is required.'),
  kd_opd3: z.string().min(1, 'SKPD is required.'),
  kd_opd4: z.string().min(1, 'SKPD is required.'),
  kd_opd5: z.string().min(1, 'SKPD is required.'),
  kd_opd6: z.string().min(1, 'SKPD is required.'),
  kd_opd7: z.string().min(1, 'SKPD is required.'),
  kd_opd8: z.string().min(1, 'SKPD is required.'),
  jumlah_pagu: z.string().min(1, 'Jumlah Pagu is required.'),
  kd_relasi: z.string().optional(),
  kd_berapax: z.string().optional(),
})

type PaguBelanjaForm = z.infer<typeof formSchema>

type PaguBelanjaActionDialogProps = {
  currentRow?: PaguBelanja
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaguBelanjaActionDialog({
  currentRow,
  open,
  onOpenChange,
}: PaguBelanjaActionDialogProps) {
  const isEdit = !!currentRow

  const { data: urusanData, isLoading: urusanLoading } = useGetRefUrusan({
    page: 1,
    perPage: 1000,
  })
  const { data: buData, isLoading: buLoading } = useGetRefBidangUrusan({
    page: 1,
    perPage: 1000,
  })
  const { data: programData, isLoading: programLoading } = useGetRefProgram({
    page: 1,
    perPage: 1000,
  })
  const { data: kegiatanData, isLoading: kegiatanLoading } = useGetRefKegiatan({
    page: 1,
    perPage: 1000,
  })
  const { data: subKegiatanData, isLoading: subKegiatanLoading } =
    useGetRefSubKegiatan({
      page: 1,
      perPage: 1000,
    })
  const { data: rekeningData, isLoading: rekeningLoading } = useGetRefRekening({
    page: 1,
    perPage: 1000,
  })
  const { data: skpdData, isLoading: skpdLoading } = useGetRefSKPD({
    page: 1,
    perPage: 1000,
  })

  const [selectedBU, setSelectedBU] = useState<string>('')
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [selectedKegiatan, setSelectedKegiatan] = useState<string>('')
  const [selectedSubKegiatan, setSelectedSubKegiatan] = useState<string>('')
  const [selectedRekening, setSelectedRekening] = useState<string>('')
  const [selectedSKPD, setSelectedSKPD] = useState<string>('')

  const form = useForm<PaguBelanjaForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
        }
      : {
          tahun_rek: new Date().getFullYear().toString(),
          kd_urusan: '',
          kd_bu1: '',
          kd_bu2: '',
          kd_prog1: '',
          kd_prog2: '',
          kd_prog3: '',
          kd_keg1: '',
          kd_keg2: '',
          kd_keg3: '',
          kd_keg4: '',
          kd_keg5: '',
          kd_subkeg1: '',
          kd_subkeg2: '',
          kd_subkeg3: '',
          kd_subkeg4: '',
          kd_subkeg5: '',
          kd_subkeg6: '',
          kd_rekening1: '',
          kd_rekening2: '',
          kd_rekening3: '',
          kd_rekening4: '',
          kd_rekening5: '',
          kd_rekening6: '',
          kd_opd1: '',
          kd_opd2: '',
          kd_opd3: '',
          kd_opd4: '',
          kd_opd5: '',
          kd_opd6: '',
          kd_opd7: '',
          kd_opd8: '',
          jumlah_pagu: '',
          kd_relasi: '',
          kd_berapax: '',
        },
  })

  const onSubmit = (values: PaguBelanjaForm) => {
    // eslint-disable-next-line no-console
    console.log('Submitted values:', values)
    form.reset()
    onOpenChange(false)
  }

  const handleBUChange = (value: string) => {
    setSelectedBU(value)
    const bu = buData?.data.find(
      (item: BidangUrusan) => `${item.kd_bu1}.${item.kd_bu2}` === value
    )
    if (bu) {
      form.setValue('kd_bu1', bu.kd_bu1)
      form.setValue('kd_bu2', bu.kd_bu2)
    }
  }

  const handleProgramChange = (value: string) => {
    setSelectedProgram(value)
    const prog = programData?.data.find(
      (item: Program) =>
        `${item.kd_prog1}.${item.kd_prog2}.${item.kd_prog3}` === value
    )
    if (prog) {
      form.setValue('kd_prog1', prog.kd_prog1)
      form.setValue('kd_prog2', prog.kd_prog2)
      form.setValue('kd_prog3', prog.kd_prog3)
    }
  }

  const handleKegiatanChange = (value: string) => {
    setSelectedKegiatan(value)
    const keg = kegiatanData?.data.find(
      (item: Kegiatan) =>
        `${item.kd_keg1}.${item.kd_keg2}.${item.kd_keg3}.${item.kd_keg4}.${item.kd_keg5}` ===
        value
    )
    if (keg) {
      form.setValue('kd_keg1', keg.kd_keg1)
      form.setValue('kd_keg2', keg.kd_keg2)
      form.setValue('kd_keg3', keg.kd_keg3)
      form.setValue('kd_keg4', keg.kd_keg4)
      form.setValue('kd_keg5', keg.kd_keg5)
    }
  }

  const handleSubKegiatanChange = (value: string) => {
    setSelectedSubKegiatan(value)
    const subkeg = subKegiatanData?.data.find(
      (item: SubKegiatan) =>
        `${item.kd_subkeg1}.${item.kd_subkeg2}.${item.kd_subkeg3}.${item.kd_subkeg4}.${item.kd_subkeg5}.${item.kd_subkeg6}` ===
        value
    )
    if (subkeg) {
      form.setValue('kd_subkeg1', subkeg.kd_subkeg1)
      form.setValue('kd_subkeg2', subkeg.kd_subkeg2)
      form.setValue('kd_subkeg3', subkeg.kd_subkeg3)
      form.setValue('kd_subkeg4', subkeg.kd_subkeg4)
      form.setValue('kd_subkeg5', subkeg.kd_subkeg5)
      form.setValue('kd_subkeg6', subkeg.kd_subkeg6)
    }
  }

  const handleRekeningChange = (value: string) => {
    setSelectedRekening(value)
    const rek = rekeningData?.data.find(
      (item: Rekening) =>
        `${item.kd_rekening1}.${item.kd_rekening2}.${item.kd_rekening3}.${item.kd_rekening4}.${item.kd_rekening5}.${item.kd_rekening6}` ===
        value
    )
    if (rek) {
      form.setValue('kd_rekening1', rek.kd_rekening1)
      form.setValue('kd_rekening2', rek.kd_rekening2)
      form.setValue('kd_rekening3', rek.kd_rekening3)
      form.setValue('kd_rekening4', rek.kd_rekening4)
      form.setValue('kd_rekening5', rek.kd_rekening5)
      form.setValue('kd_rekening6', rek.kd_rekening6)
    }
  }

  const handleSKPDChange = (value: string) => {
    setSelectedSKPD(value)
    const skpd = skpdData?.data.find(
      (item: MasterSkpd) => item.kode_opd === value
    )
    if (skpd) {
      const kodeParts = skpd.kode_opd.split('.')
      form.setValue('kd_opd1', kodeParts[0] || '')
      form.setValue('kd_opd2', kodeParts[1] || '')
      form.setValue('kd_opd3', kodeParts[2] || '')
      form.setValue('kd_opd4', kodeParts[3] || '')
      form.setValue('kd_opd5', kodeParts[4] || '')
      form.setValue('kd_opd6', kodeParts[5] || '')
      form.setValue('kd_opd7', kodeParts[6] || '')
      form.setValue('kd_opd8', kodeParts[7] || '')
    }
  }

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Pagu Belanja' : 'Tambah Pagu Belanja'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update data pagu belanja. '
              : 'Buat data pagu belanja baru. '}
            Klik simpan ketika selesai.
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-[32rem] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <div className='space-y-4 px-0.5'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='tahun_rek'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun Rekening</FormLabel>
                      <FormControl>
                        <Input placeholder='2024' type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='kd_urusan'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urusan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={urusanLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Pilih Urusan' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {urusanData?.data.map((item: Urusan) => (
                            <SelectItem
                              key={item.kd_urusan}
                              value={item.kd_urusan}
                            >
                              {item.kd_urusan} - {item.nm_urusan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormItem>
                <FormLabel>Bidang Urusan</FormLabel>
                <Select
                  onValueChange={handleBUChange}
                  value={selectedBU}
                  disabled={buLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Bidang Urusan' />
                  </SelectTrigger>
                  <SelectContent>
                    {buData?.data.map((item: BidangUrusan) => (
                      <SelectItem
                        key={`${item.kd_bu1}.${item.kd_bu2}`}
                        value={`${item.kd_bu1}.${item.kd_bu2}`}
                      >
                        {item.kd_bu1}.{item.kd_bu2} - {item.nm_bu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(form.formState.errors.kd_bu1 ||
                  form.formState.errors.kd_bu2) && (
                  <p className='text-destructive text-sm font-medium'>
                    {form.formState.errors.kd_bu1?.message ||
                      form.formState.errors.kd_bu2?.message}
                  </p>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Program</FormLabel>
                <Select
                  onValueChange={handleProgramChange}
                  value={selectedProgram}
                  disabled={programLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Program' />
                  </SelectTrigger>
                  <SelectContent>
                    {programData?.data.map((item: Program) => (
                      <SelectItem
                        key={`${item.kd_prog1}.${item.kd_prog2}.${item.kd_prog3}`}
                        value={`${item.kd_prog1}.${item.kd_prog2}.${item.kd_prog3}`}
                      >
                        {item.kd_prog1}.{item.kd_prog2}.{item.kd_prog3} -{' '}
                        {item.nm_program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(form.formState.errors.kd_prog1 ||
                  form.formState.errors.kd_prog2 ||
                  form.formState.errors.kd_prog3) && (
                  <p className='text-destructive text-sm font-medium'>
                    {form.formState.errors.kd_prog1?.message ||
                      form.formState.errors.kd_prog2?.message ||
                      form.formState.errors.kd_prog3?.message}
                  </p>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Kegiatan</FormLabel>
                <Select
                  onValueChange={handleKegiatanChange}
                  value={selectedKegiatan}
                  disabled={kegiatanLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Kegiatan' />
                  </SelectTrigger>
                  <SelectContent>
                    {kegiatanData?.data.map((item: Kegiatan) => (
                      <SelectItem
                        key={`${item.kd_keg1}.${item.kd_keg2}.${item.kd_keg3}.${item.kd_keg4}.${item.kd_keg5}`}
                        value={`${item.kd_keg1}.${item.kd_keg2}.${item.kd_keg3}.${item.kd_keg4}.${item.kd_keg5}`}
                      >
                        {item.kd_keg1}.{item.kd_keg2}.{item.kd_keg3}.
                        {item.kd_keg4}.{item.kd_keg5} - {item.nm_kegiatan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.kd_keg1 && (
                  <p className='text-destructive text-sm font-medium'>
                    {form.formState.errors.kd_keg1.message}
                  </p>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Sub Kegiatan</FormLabel>
                <Select
                  onValueChange={handleSubKegiatanChange}
                  value={selectedSubKegiatan}
                  disabled={subKegiatanLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Sub Kegiatan' />
                  </SelectTrigger>
                  <SelectContent>
                    {subKegiatanData?.data.map((item: SubKegiatan) => (
                      <SelectItem
                        key={`${item.kd_subkeg1}.${item.kd_subkeg2}.${item.kd_subkeg3}.${item.kd_subkeg4}.${item.kd_subkeg5}.${item.kd_subkeg6}`}
                        value={`${item.kd_subkeg1}.${item.kd_subkeg2}.${item.kd_subkeg3}.${item.kd_subkeg4}.${item.kd_subkeg5}.${item.kd_subkeg6}`}
                      >
                        {item.kd_subkeg1}.{item.kd_subkeg2}.{item.kd_subkeg3}.
                        {item.kd_subkeg4}.{item.kd_subkeg5}.{item.kd_subkeg6} -{' '}
                        {item.nm_subkegiatan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.kd_subkeg1 && (
                  <p className='text-destructive text-sm font-medium'>
                    {form.formState.errors.kd_subkeg1.message}
                  </p>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Rekening</FormLabel>
                <Select
                  onValueChange={handleRekeningChange}
                  value={selectedRekening}
                  disabled={rekeningLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Rekening' />
                  </SelectTrigger>
                  <SelectContent>
                    {rekeningData?.data.map((item: Rekening) => (
                      <SelectItem
                        key={`${item.kd_rekening1}.${item.kd_rekening2}.${item.kd_rekening3}.${item.kd_rekening4}.${item.kd_rekening5}.${item.kd_rekening6}`}
                        value={`${item.kd_rekening1}.${item.kd_rekening2}.${item.kd_rekening3}.${item.kd_rekening4}.${item.kd_rekening5}.${item.kd_rekening6}`}
                      >
                        {item.kd_rekening1}.{item.kd_rekening2}.
                        {item.kd_rekening3}.{item.kd_rekening4}.
                        {item.kd_rekening5}.{item.kd_rekening6} -{' '}
                        {item.nm_rekening}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.kd_rekening1 && (
                  <p className='text-destructive text-sm font-medium'>
                    {form.formState.errors.kd_rekening1.message}
                  </p>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>SKPD/OPD</FormLabel>
                <Select
                  onValueChange={handleSKPDChange}
                  value={selectedSKPD}
                  disabled={skpdLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih SKPD' />
                  </SelectTrigger>
                  <SelectContent>
                    {skpdData?.data.map((item: MasterSkpd) => (
                      <SelectItem key={item.kode_opd} value={item.kode_opd}>
                        {item.kode_opd} - {item.nm_opd}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.kd_opd1 && (
                  <p className='text-destructive text-sm font-medium'>
                    {form.formState.errors.kd_opd1.message}
                  </p>
                )}
              </FormItem>

              <FormField
                control={form.control}
                name='jumlah_pagu'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Pagu</FormLabel>
                    <FormControl>
                      <Input placeholder='1000000' type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='kd_relasi'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Relasi (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder='Kode Relasi' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='kd_berapax'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Berapa X (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder='Kode Berapa X' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
