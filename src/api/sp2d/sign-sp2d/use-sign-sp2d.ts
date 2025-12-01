import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface CreateSp2dKirimPayload {
  id_sp2d: string
  nama_file: string
  file: File
  passphrase: string
  tampilan: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function useSignSp2dKirim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateSp2dKirimPayload) => {
      const formData = new FormData()
      formData.append('id_sp2d', payload.id_sp2d.toString())
      formData.append('nama_file', payload.nama_file)
      formData.append('file', payload.file)
      formData.append('passphrase', payload.passphrase)
      formData.append('tampilan', payload.tampilan)

      const { data } = await api.post('/sp2d/sign', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetSP2DKirim'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSP2D'],
      })
    },

    onError: (err) => {
      return err
    },
  })
}
