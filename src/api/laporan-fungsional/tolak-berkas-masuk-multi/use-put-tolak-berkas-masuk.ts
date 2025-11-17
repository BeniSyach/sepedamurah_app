import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

export function usePutTolakFungsionalMulti() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/laporan/tolak-multi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanFungsional'],
      })
    },

    onError: (err) => err,
  })
}
