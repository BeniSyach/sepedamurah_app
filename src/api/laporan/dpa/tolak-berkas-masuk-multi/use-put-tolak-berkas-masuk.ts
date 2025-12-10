import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'

export function usePutTolakDPAMulti() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post(
        '/laporan/laporan-dpa-tolak-multi',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanDPA'],
      })
    },

    onError: (err) => err,
  })
}
