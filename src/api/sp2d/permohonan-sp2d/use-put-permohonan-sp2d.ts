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
      const id_sp2d = formData.get('id_sp2d')
      if (!id_sp2d) throw new Error('ID harus ada')
      const { data } = await api.put<Sp2dItem>(
        `/sp2d/permohonan-sp2d/${id_sp2d}`,
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
