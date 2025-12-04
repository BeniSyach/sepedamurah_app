import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface SignSpdKirimPayload {
  id: string
  nama_file: string
  file: File
  passphrase: string
  tampilan: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function useSignSpdKirim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SignSpdKirimPayload) => {
      const formData = new FormData()
      formData.append('id', payload.id.toString())
      formData.append('nama_file', payload.nama_file)
      formData.append('file', payload.file)
      formData.append('passphrase', payload.passphrase)
      formData.append('tampilan', payload.tampilan)

      const { data } = await api.post('/spd/sign', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetSPDTerkirim'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSPD'],
      })
    },

    onError: (err) => {
      return err
    },
  })
}
