import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { MasterSkpd } from './types'

interface CreateSKPDPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nm_opd: string
  status_penerimaan: string
  kode_opd?: string | null
  hidden?: number
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefSKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateSKPDPayload): Promise<MasterSkpd> => {
      const { data } = await api.post<MasterSkpd>(
        '/master-data/master-skpd',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefSKPD'] })
    },
    onError: (err) => {
      return err
    },
  })
}
