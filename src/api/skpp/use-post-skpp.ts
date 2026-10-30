import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { SkppData } from '@/features/skpp/types'
import type { SingleSkppResponse } from './types'

export function usePostSkpp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Partial<SkppData> | FormData) => {
      const { data } = await api.post<SingleSkppResponse>('/skpp', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSkpp'] })
    },
  })
}
