import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'

export interface TerimaSkppPayload {
  id: string
  id_operator?: string
  nama_operator?: string
}

export interface TolakSkppPayload {
  id: string
  alasan_tolak: string
  id_operator?: string
  nama_operator?: string
}

export interface SignSkppPayload {
  id: string
  file?: File
  passphrase: string
  nama_file?: string
  tampilan?: string
}

/**
 * Hook untuk menerima permohonan SKPP
 */
export function useTerimaSkpp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: TerimaSkppPayload) => {
      const { data } = await api.put(`/skpp/${id}/terima`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSkpp'] })
    },
  })
}

/**
 * Hook untuk menolak permohonan SKPP
 */
export function useTolakSkpp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: TolakSkppPayload) => {
      const { data } = await api.put(`/skpp/${id}/tolak`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSkpp'] })
    },
  })
}

/**
 * Hook untuk memverifikasi berkas pemeriksaan SKPP (Valid, Perlu Diperbaiki, Tidak Valid)
 */
export interface VerifikasiSkppPayload {
  id: string
  status: 'Diterima' | 'Perlu Perbaikan' | 'Ditolak' | 'Draft'
  alasan?: string
  verifikasi_berkas?: Record<string, { status: 'valid' | 'perlu_perbaikan' | 'tidak_valid'; catatan?: string }>
  id_operator?: string
  nama_operator?: string
  tempat_penetapan?: string
  tgl_penetapan?: string
  jabatan_penandatangan?: string
  nama_penandatangan?: string
  nip_penandatangan?: string
  penandatangan_nik?: string
  penandatangan_id?: string | number
}

export function useVerifikasiSkpp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: VerifikasiSkppPayload) => {
      const { data } = await api.put(`/skpp/${id}/verifikasi`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSkpp'] })
    },
  })
}

/**
 * Hook untuk menandatangani elektronik (TTE) berkas SKPP
 */
export function useSignSkpp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SignSkppPayload) => {
      const formData = new FormData()
      formData.append('id', payload.id)
      formData.append('passphrase', payload.passphrase)
      if (payload.nama_file) formData.append('nama_file', payload.nama_file)
      if (payload.tampilan) formData.append('tampilan', payload.tampilan)
      if (payload.file) formData.append('file', payload.file)

      const { data } = await api.post('/skpp/sign', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSkpp'] })
    },
  })
}
