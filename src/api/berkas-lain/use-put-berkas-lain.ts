import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { BerkasLain } from './types'

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutBerkasLain() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (formData: FormData) => {
      const id = formData.get('id')
      if (!id) throw new Error('ID harus ada')
      const { data } = await api.post<BerkasLain>(
        `/laporan/fungsional/${id}`,
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
        queryKey: ['useGetBerkasLain'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
