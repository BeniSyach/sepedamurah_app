import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonPermohonanSP2D() {
  return (
    <div className='space-y-6'>
      {/* Header Title */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-64' />
          <Skeleton className='h-4 w-80' />
        </div>

        {/* Right buttons skeleton */}
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-32' />
        </div>
      </div>

      {/* Date range filter skeleton */}
      <div className='flex space-x-4'>
        <Skeleton className='h-10 w-40' />
        <Skeleton className='h-10 w-40' />
      </div>

      {/* Table Skeleton */}
      <div className='rounded-md border'>
        {/* Table Header */}
        <div className='grid grid-cols-6 gap-4 border-b p-4'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-16' />
        </div>

        {/* Table Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='grid grid-cols-6 gap-4 border-b p-4 last:border-0'
          >
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-12' />
          </div>
        ))}
      </div>
    </div>
  )
}
