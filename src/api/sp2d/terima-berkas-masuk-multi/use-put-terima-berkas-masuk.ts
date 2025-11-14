import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

export function usePutTerimaSp2dMulti() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/sp2d/terima-multi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSP2D'],
      })
    },

    onError: (err) => err,
  })
}
