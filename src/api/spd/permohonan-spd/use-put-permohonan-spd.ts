import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutPermohonanSpd() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (formData: FormData) => {
      const id = formData.get('id')
      if (!id) throw new Error('ID harus ada')
      const { data } = await api.post(`/spd/permohonan-spd/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { _method: 'PUT' },
      })
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSPD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
