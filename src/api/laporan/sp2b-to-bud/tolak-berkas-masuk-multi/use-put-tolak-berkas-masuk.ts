import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'

export function usePutTolakSp2bToBUDMulti() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post(
        '/laporan/laporan-sp2b-to-bud-tolak-multi',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanSp2bToBUD'],
      })
    },

    onError: (err) => err,
  })
}
