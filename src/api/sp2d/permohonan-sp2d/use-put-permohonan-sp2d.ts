import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Sp2dItem } from './types'

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutPermohonanSp2d() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (formData: FormData) => {
      const id = formData.get('id')
      if (!id) throw new Error('ID harus ada')
      const { data } = await api.put<Sp2dItem>(
        `/sp2d/permohonan-sp2d/${id}`,
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
        queryKey: ['useGetPermohonanSP2D'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
