import { type Sp2dItem, useGetBerkasMasuk } from '@/api'
import { formatTanggaldanJam } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RecentSales() {
  const { data } = useGetBerkasMasuk()
  const items: Sp2dItem[] = data?.data ?? []

  return (
    <div className='space-y-8'>
      {items.map((item) => (
        <div key={item.id_sp2d} className='flex items-center gap-4'>
          {/* Avatar */}
          <Avatar className='h-9 w-9'>
            <AvatarImage src={`/avatars/${item.id_user}.png`} />
            <AvatarFallback>
              {item.nama_user
                ?.split(' ')
                .map((x) => x[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {item.nama_user}
              </p>
              <p className='text-muted-foreground text-sm'>{item.no_spm}</p>
            </div>

            <div className='text-sm font-medium'>
              {item.tanggal_upload
                ? formatTanggaldanJam(item.tanggal_upload)
                : '-'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
