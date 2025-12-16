import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface ImportPaguBelanjaPayload {
  file: File
}

/**
 * Hook untuk import Excel Pagu Belanja
 */
export function useImportPaguBelanjaExcel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file }: ImportPaguBelanjaPayload) => {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await api.post(
        '/master-data/pagu-belanja/import-excel',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      return data
    },

    onSuccess: () => {
      // 🔄 refresh data pagu belanja
      queryClient.invalidateQueries({
        queryKey: ['useGetRefPaguBelanja'],
      })
    },

    onError: (error) => {
      return error
    },
  })
}
