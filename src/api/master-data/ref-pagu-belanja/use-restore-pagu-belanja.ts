import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

/**
 * Hook untuk restore versi pagu belanja sebelumnya
 */
export function useRestorePaguBelanja() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/master-data/pagu-belanja/restore')
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetRefPaguBelanja'],
      })
    },

    onError: (error) => {
      return error
    },
  })
}
