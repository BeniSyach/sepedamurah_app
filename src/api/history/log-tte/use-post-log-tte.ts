import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LogTTE } from './types'

interface CreateLogTTEPayload {
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
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostLogTTE() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateLogTTEPayload): Promise<LogTTE> => {
      const { data } = await api.post<LogTTE>('/history/log-tte', payload)
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetLogTTE'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
