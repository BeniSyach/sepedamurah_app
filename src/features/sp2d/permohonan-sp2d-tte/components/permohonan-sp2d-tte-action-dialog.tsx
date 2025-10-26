/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Plus } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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

/* eslint-disable @typescript-eslint/no-explicit-any */

// =======================
// 🧾 SCHEMA
// =======================
const rekeningSchema = z.object({
  namaRekening: z.string().min(1, 'Nama rekening wajib diisi'),
  nilai: z.string().min(1, 'Nilai wajib diisi'),
})

const subkegiatanSchema = z.object({
  namaSubKegiatan: z.string().min(1, 'Nama Sub Kegiatan wajib diisi'),
  rekening: z.array(rekeningSchema).min(1, 'Minimal 1 rekening'),
})

const kegiatanSchema = z.object({
  namaKegiatan: z.string().min(1, 'Nama Kegiatan wajib diisi'),
  subkegiatan: z.array(subkegiatanSchema).min(1, 'Minimal 1 sub kegiatan'),
})

const programSchema = z.object({
  namaProgram: z.string().min(1, 'Nama Program wajib diisi'),
  kegiatan: z.array(kegiatanSchema).min(1, 'Minimal 1 kegiatan'),
})

const bidangUrusanSchema = z.object({
  namaBidangUrusan: z.string().min(1, 'Nama Bidang Urusan wajib diisi'),
  program: z.array(programSchema).min(1, 'Minimal 1 program'),
})

const urusanSchema = z.object({
  namaUrusan: z.string().min(1, 'Nama Urusan wajib diisi'),
  bidangUrusan: z.array(bidangUrusanSchema).min(1, 'Minimal 1 bidang urusan'),
})

const formSchema = z.object({
  urusan: z.array(urusanSchema).min(1, 'Minimal 1 urusan'),
})

type Sp2dNestedForm = z.infer<typeof formSchema>

// =======================
// 🧭 MAIN DIALOG
// =======================
export function UsersActionDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (state: boolean) => void
}) {
  const form = useForm<Sp2dNestedForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urusan: [],
    },
  })

  const { control, handleSubmit } = form
  const { fields: urusanFields, append: addUrusan } = useFieldArray({
    control,
    name: 'urusan',
  })

  const onSubmit = (data: Sp2dNestedForm) => {
    showSubmittedData(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-5xl'>
        <DialogHeader>
          <DialogTitle>Form SP2D (Nested)</DialogTitle>
          <DialogDescription>
            Tambahkan urusan, bidang urusan, program, kegiatan, sub kegiatan,
            dan rekening.
          </DialogDescription>
        </DialogHeader>

        <div className='h-[75vh] overflow-y-auto px-2'>
          <Form {...form}>
            <form
              id='sp2d-form'
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-5'
            >
              {/* URUSAN */}
              {urusanFields.map((urusan, ui) => (
                <UrusanSection
                  key={urusan.id}
                  control={control}
                  indexUrusan={ui}
                />
              ))}

              <div className='pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full border-dashed'
                  onClick={() =>
                    addUrusan({
                      namaUrusan: '',
                      bidangUrusan: [],
                    })
                  }
                >
                  <Plus className='mr-2 h-4 w-4' /> Tambah Urusan
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='sp2d-form'>
            Simpan Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// =======================
// 🔽 URUSAN SECTION
// =======================
function UrusanSection({ control, indexUrusan }: any) {
  const [open, setOpen] = useState(true)
  const { fields, append } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan`,
  })

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className='bg-muted/30 rounded-xl border p-4'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='flex w-full items-center justify-between'
        >
          <span>Urusan #{indexUrusan + 1}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className='mt-3 space-y-3'>
        <FormField
          control={control}
          name={`urusan.${indexUrusan}.namaUrusan`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Urusan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Contoh: Urusan Pemerintahan Umum'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((bu, bi) => (
          <BidangUrusanSection
            key={bu.id}
            control={control}
            indexUrusan={indexUrusan}
            indexBidang={bi}
          />
        ))}

        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() =>
            append({
              namaBidangUrusan: '',
              program: [],
            })
          }
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah Bidang Urusan
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}

// =======================
// 🔽 BIDANG URUSAN SECTION
// =======================
function BidangUrusanSection({ control, indexUrusan, indexBidang }: any) {
  const [open, setOpen] = useState(false)
  const { fields, append } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program`,
  })

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className='bg-background/60 ml-4 rounded-lg border p-3'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='flex w-full items-center justify-between text-sm font-medium'
        >
          <span>Bidang Urusan #{indexBidang + 1}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className='mt-3 space-y-3'>
        <FormField
          control={control}
          name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.namaBidangUrusan`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Bidang Urusan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Contoh: Bidang Ketentraman & Ketertiban Umum'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((prog, pi) => (
          <ProgramSection
            key={prog.id}
            control={control}
            indexUrusan={indexUrusan}
            indexBidang={indexBidang}
            indexProgram={pi}
          />
        ))}

        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() =>
            append({
              namaProgram: '',
              kegiatan: [],
            })
          }
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah Program
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}

// =======================
// 🔽 PROGRAM SECTION
// =======================
function ProgramSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
}: any) {
  const [open, setOpen] = useState(false)
  const { fields, append } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan`,
  })

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className='bg-muted/20 ml-8 rounded-lg border p-3'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='flex w-full items-center justify-between text-sm'
        >
          <span>Program #{indexProgram + 1}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className='mt-3 space-y-3'>
        <FormField
          control={control}
          name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.namaProgram`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Program</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Contoh: Program Peningkatan Pelayanan Publik'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((keg, ki) => (
          <KegiatanSection
            key={keg.id}
            control={control}
            indexUrusan={indexUrusan}
            indexBidang={indexBidang}
            indexProgram={indexProgram}
            indexKegiatan={ki}
          />
        ))}

        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() =>
            append({
              namaKegiatan: '',
              subkegiatan: [],
            })
          }
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah Kegiatan
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}

// =======================
// 🔽 KEGIATAN SECTION
// =======================
function KegiatanSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  indexKegiatan,
}: any) {
  const [open, setOpen] = useState(false)
  const { fields, append } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subkegiatan`,
  })

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className='bg-background/50 ml-12 rounded-lg border p-3'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='flex w-full items-center justify-between text-sm'
        >
          <span>Kegiatan #{indexKegiatan + 1}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className='mt-3 space-y-3'>
        <FormField
          control={control}
          name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.namaKegiatan`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kegiatan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Contoh: Kegiatan Pemeliharaan Sarana Umum'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((sub, si) => (
          <SubKegiatanSection
            key={sub.id}
            control={control}
            indexUrusan={indexUrusan}
            indexBidang={indexBidang}
            indexProgram={indexProgram}
            indexKegiatan={indexKegiatan}
            indexSubKegiatan={si}
          />
        ))}

        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() =>
            append({
              namaSubKegiatan: '',
              rekening: [],
            })
          }
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah Sub Kegiatan
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}

// =======================
// 🔽 SUB KEGIATAN SECTION
// =======================
function SubKegiatanSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  indexKegiatan,
  indexSubKegiatan,
}: any) {
  const [open, setOpen] = useState(false)
  const { fields, append } = useFieldArray({
    control,
    name: `urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subkegiatan.${indexSubKegiatan}.rekening`,
  })

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className='bg-muted/10 ml-16 rounded-lg border p-3'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='flex w-full items-center justify-between text-sm'
        >
          <span>Sub Kegiatan #{indexSubKegiatan + 1}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className='mt-3 space-y-3'>
        <FormField
          control={control}
          name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subkegiatan.${indexSubKegiatan}.namaSubKegiatan`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sub Kegiatan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Contoh: Sub Kegiatan Pengawasan Fasilitas Publik'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((rek, ri) => (
          <RekeningSection
            key={rek.id}
            control={control}
            indexUrusan={indexUrusan}
            indexBidang={indexBidang}
            indexProgram={indexProgram}
            indexKegiatan={indexKegiatan}
            indexSubKegiatan={indexSubKegiatan}
            indexRekening={ri}
          />
        ))}

        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() => append({ namaRekening: '', nilai: '' })}
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah Rekening
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}

// =======================
// 🔽 REKENING SECTION
// =======================
function RekeningSection({
  control,
  indexUrusan,
  indexBidang,
  indexProgram,
  indexKegiatan,
  indexSubKegiatan,
  indexRekening,
}: any) {
  return (
    <div className='bg-background/80 ml-20 grid grid-cols-2 gap-3 rounded-md border p-3'>
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subkegiatan.${indexSubKegiatan}.rekening.${indexRekening}.namaRekening`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Rekening</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Contoh: Belanja Barang' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`urusan.${indexUrusan}.bidangUrusan.${indexBidang}.program.${indexProgram}.kegiatan.${indexKegiatan}.subkegiatan.${indexSubKegiatan}.rekening.${indexRekening}.nilai`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nilai (Rp)</FormLabel>
            <FormControl>
              <Input type='number' {...field} placeholder='0' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
