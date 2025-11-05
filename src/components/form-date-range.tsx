import React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRange {
  from: Date | undefined
  to?: Date | undefined
}

interface RangeDatePickerProps {
  value?: DateRange
  onChange?: (date: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const RangeDatePicker: React.FC<RangeDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pilih rentang tanggal',
  disabled = false,
  className,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>(value)
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(value)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setDate(value)
    setTempDate(value)
  }, [value])

  const handleSelect = (newDate: DateRange | undefined) => {
    setTempDate(newDate)
  }

  const handleSubmit = () => {
    setDate(tempDate)
    if (onChange) {
      onChange(tempDate)
    }
    setOpen(false)
  }

  const handleCancel = () => {
    setTempDate(date)
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setTempDate(date)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant='outline'
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd MMM yyyy')} -{' '}
                  {format(date.to, 'dd MMM yyyy')}
                </>
              ) : (
                format(date.from, 'dd MMM yyyy')
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={tempDate?.from}
            selected={tempDate}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={disabled}
          />
          <div className='flex items-center gap-2 border-t p-3'>
            <Button variant='outline' className='flex-1' onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className='flex-1'
              onClick={handleSubmit}
              disabled={!tempDate?.from}
            >
              Submit
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default RangeDatePicker
