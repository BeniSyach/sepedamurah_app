import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { JenisSpm } from './types'

interface UpdateUrusanPayload {
  id?: string
  kategori: string
  nama_berkas: string
  status_penerimaan: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefJenisSPM() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateUrusanPayload): Promise<JenisSpm> => {
      const { data } = await api.put<JenisSpm>(
        `/master-data/jenis-spm/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefJenisSPM'] })
    },
    onError: (err) => {
      return err
    },
  })
}
