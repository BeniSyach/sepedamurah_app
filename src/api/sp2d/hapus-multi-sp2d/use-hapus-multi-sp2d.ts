import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

export function useHapusSp2dMulti() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/sp2d/hapus-multi-sp2d', formData, {
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
