import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PermohonanSpdResponse } from './types'

interface UsePermohonanSPD {
  page?: number
  perPage?: number
  search?: string
  user_id?: string | number
  menu?: string
}

export function useGetPermohonanSPD(params: UsePermohonanSPD) {
  return useQuery({
    queryKey: ['useGetPermohonanSPD', params],
    queryFn: async () => {
      const { data } = await api.get<PermohonanSpdResponse>(
        '/spd/permohonan-spd',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            user_id: params.user_id,
            menu: params.menu,
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
