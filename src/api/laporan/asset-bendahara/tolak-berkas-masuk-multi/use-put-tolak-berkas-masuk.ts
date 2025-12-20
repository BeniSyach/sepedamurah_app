import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'

export function usePutTolakAssetBendaharaMulti() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post(
        '/laporan/laporan-asset-bendahara-tolak-multi',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanAssetBendahara'],
      })
    },

    onError: (err) => err,
  })
}
