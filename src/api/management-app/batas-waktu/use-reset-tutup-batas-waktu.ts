import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

type ResetResponse = {
  status: boolean
  message: string
}

export function useResetTutupBatasWaktu() {
  const queryClient = useQueryClient()

  return useMutation<ResetResponse, unknown>({
    mutationFn: async (): Promise<ResetResponse> => {
      const { data } = await api.post<ResetResponse>(
        '/hak-akses/batas-waktu/reset-all-tutup'
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetBatasWaktu'] })
    },
    onError: (err) => {
      return err
    },
  })
}
