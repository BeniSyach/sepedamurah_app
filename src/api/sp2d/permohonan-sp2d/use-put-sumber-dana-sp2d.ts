import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import { type Sp2dItem } from './types'

/**
 * Hook untuk update sumber dana SP2D
 */
export function usePutSp2DSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const id = formData.get('id')

      if (!id) {
        throw new Error('ID SP2D harus ada')
      }

      const { data } = await api.post<Sp2dItem>(
        `/sp2d/sp2d-sumber-dana/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            _method: 'PUT',
          },
        }
      )

      return data
    },

    onSuccess: () => {
      /** 🔄 refresh data setelah update */
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSP2D'],
      })

      queryClient.invalidateQueries({
        queryKey: ['useGetSP2DKirim'],
      })

      queryClient.invalidateQueries({
        queryKey: ['useGetSP2DSumberDana'],
      })
    },

    onError: (error) => {
      return error
    },
  })
}
