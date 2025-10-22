import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LogTTE } from './types'

interface UpdateLogTTEPayload {
  id: string
  id_berkas: string
  kategori: string
  tte: string
  status: string
  tgl_tte: string
  keterangan: string
  message: string
  id_penandatangan: string
  nama_penandatangan: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutLogTTE() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateLogTTEPayload): Promise<LogTTE> => {
      const { data } = await api.put<LogTTE>(
        `/history/log-tte/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetLogTTE'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
