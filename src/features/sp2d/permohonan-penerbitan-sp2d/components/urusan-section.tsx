/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { ChevronDown, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { BidangUrusanSection } from './bidang-urusan-section'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

export function UrusanSection({ control, indexUrusan, removeUrusan }: any) {
  const [open, setOpen] = useState(true)
  const { fields, append, remove } = useFieldArray({
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
          <div className='mr-3 flex items-center justify-between'>
            <span>Urusan #{indexUrusan + 1}</span>
            <Button
              type='button'
              size='icon'
              variant='destructive'
              className='ml-3 h-5 w-5'
              onClick={removeUrusan}
            >
              <Minus className='h-4 w-4' />
            </Button>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className='mt-3 space-y-3'>
        <FormField
          control={control}
          name={`urusan.${indexUrusan}.nm_urusan`}
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
            removeBidang={() => remove(bi)}
          />
        ))}

        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() => append({ nm_bu: '', program: [] })}
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah Bidang Urusan
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}
