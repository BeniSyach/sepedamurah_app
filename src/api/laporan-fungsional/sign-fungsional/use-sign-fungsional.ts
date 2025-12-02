import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface CreateSp2dKirimPayload {
  id: string
  file: File
  passphrase: string
  nama_file: string
  tampilan: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function useSignFungsional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateSp2dKirimPayload) => {
      const formData = new FormData()
      formData.append('id', payload.id.toString())
      formData.append('file', payload.file)
      formData.append('nama_file', payload.nama_file)
      formData.append('passphrase', payload.passphrase)
      formData.append('tampilan', payload.tampilan)

      const { data } = await api.post('/sign-fungsional', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanFungsional'],
      })
    },

    onError: (err) => {
      return err
    },
  })
}
