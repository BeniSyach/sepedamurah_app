import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { MasterSkpd } from './types'

interface UpdateMasterSkpdPayload {
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
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefMasterSkpd() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateMasterSkpdPayload
    ): Promise<MasterSkpd> => {
      const { data } = await api.put<MasterSkpd>(
        `/master-data/master-skpd/${payload.kd_opd1}/${payload.kd_opd2}/${payload.kd_opd3}/${payload.kd_opd4}/${payload.kd_opd5}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefSKPD'] })
    },
    onError: (err) => {
      return err
    },
  })
}
