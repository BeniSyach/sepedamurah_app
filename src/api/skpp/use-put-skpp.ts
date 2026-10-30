import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { SkppData } from '@/features/skpp/types'
import type { SingleSkppResponse } from './types'

export function usePutSkpp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string | number; payload: Partial<SkppData> | FormData }) => {
      if (payload instanceof FormData) {
        const { data } = await api.post<SingleSkppResponse>(`/skpp/${id}`, payload, {
          params: { _method: 'PUT' },
        })
        return data
      }
      const { data } = await api.put<SingleSkppResponse>(`/skpp/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSkpp'] })
    },
  })
}
