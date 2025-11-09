import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Sp2dData } from './types'

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutSp2DKirim() {
  const queryClient = useQueryClient()
  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (formData: FormData) => {
      const id = formData.get('id')
      if (!id) throw new Error('ID harus ada')
      const { data } = await api.post<Sp2dData>(
        `/sp2d/sp2d-kirim/${id}`,
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
        queryKey: ['useGetSP2DKirim'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
