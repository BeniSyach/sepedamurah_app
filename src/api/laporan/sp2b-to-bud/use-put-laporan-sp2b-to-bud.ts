import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'
import { type LaporanSp2bToBUD } from './types'

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutLaporanSp2bToBUD() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (formData: FormData) => {
      const id = formData.get('id')
      if (!id) throw new Error('ID harus ada')
      const { data } = await api.post<LaporanSp2bToBUD>(
        `/laporan/laporan-sp2b-to-bud/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { _method: 'PUT' },
        }
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanSp2bToBUD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
