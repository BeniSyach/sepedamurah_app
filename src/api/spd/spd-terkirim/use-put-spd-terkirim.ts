import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutSpdTerkirim() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (formData: FormData) => {
      const id = formData.get('id')
      if (!id) throw new Error('ID harus ada')
      const { data } = await api.post(`/spd/spd-terkirim/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { _method: 'PUT' },
      })
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetSPDTerkirim'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
