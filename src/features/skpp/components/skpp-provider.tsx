import React, { createContext, useContext, useState, useMemo } from 'react'
import { type SkppData } from '../types'
import {
  useGetSkpp,
  usePostSkpp,
  usePutSkpp,
  useDeleteSkpp,
  useTerimaSkpp,
  useTolakSkpp,
  useVerifikasiSkpp,
  useSignSkpp,
  type MasterSkpd,
} from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

import { format } from 'date-fns'

export type SkppDialogType =
  | 'create'
  | 'edit'
  | 'delete'
  | 'preview'
  | 'periksa'
  | 'tolak'
  | 'tte'
  | 'downloadTte'
  | null

export interface SkppMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from?: number | null
  to?: number | null
}

interface SkppContextType {
  data: SkppData[]
  meta?: SkppMeta
  currentRow: SkppData | null
  open: SkppDialogType
  isLoading: boolean
  userRole: string | null
  isBendahara: boolean

  // Search & Filter state
  search: string
  setSearch: (s: string) => void
  nomor: string
  setNomor: (n: string) => void
  jenisSkpp: string
  setJenisSkpp: (j: string) => void
  dateRange: { from: Date | undefined; to?: Date | undefined }
  setDateRange: (r: { from: Date | undefined; to?: Date | undefined }) => void
  page: number
  setPage: (p: number) => void
  perPage: number
  setPerPage: (p: number) => void
  sortBy: string
  setSortBy: (s: string) => void
  sortDir: 'asc' | 'desc'
  setSortDir: (d: 'asc' | 'desc') => void

  setOpen: (open: SkppDialogType) => void
  setCurrentRow: (row: SkppData | null) => void
  addSkpp: (newItem: Omit<SkppData, 'id' | 'created_at'> | FormData) => Promise<void>
  updateSkpp: (id: string | number, updatedItem: Partial<SkppData> | FormData) => Promise<void>
  deleteSkpp: (id: string | number) => Promise<void>
  terimaSkpp: (id: string | number) => Promise<void>
  tolakSkpp: (id: string | number, alasan: string) => Promise<void>
  verifikasiSkpp: (
    id: string | number,
    statusOrPayload: 'Diterima' | 'Perlu Perbaikan' | 'Ditolak' | 'Draft' | (Record<string, any> & { status: any; catatan_perbaikan?: string; verifikasi_berkas?: any }),
    alasan?: string,
    verifikasi_berkas?: any
  ) => Promise<void>
  signSkpp: (payload: { id: string; file?: File; passphrase: string; nama_file?: string }) => Promise<void>
}

export const SkppContext = createContext<SkppContextType | undefined>(undefined)

interface SkppProviderProps {
  children: React.ReactNode
  menu?: string
}

export function SkppProvider({ children, menu }: SkppProviderProps) {
  const user = useAuthStore((s) => s.user)
  const userRole = localStorage.getItem('user_role')
  const isBendahara = Boolean(userRole?.toLowerCase().includes('bendahara'))

  // Filter and pagination state
  const [search, setSearch] = useState('')
  const [nomor, setNomor] = useState('')
  const [jenisSkpp, setJenisSkpp] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const skpd = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user_skpd') || '{}') as MasterSkpd
    } catch {
      return {} as MasterSkpd
    }
  }, [])

  const opdFilter = useMemo(() => {
    if (isBendahara) {
      if (skpd?.kd_opd1) {
        return {
          kd_opd1: skpd.kd_opd1,
          kd_opd2: skpd.kd_opd2,
          kd_opd3: skpd.kd_opd3,
          kd_opd4: skpd.kd_opd4,
          kd_opd5: skpd.kd_opd5,
          user_id: user?.id,
        }
      }
      return { user_id: user?.id }
    }
    // Untuk Operator dan role lainnya, selalu kirim user_id agar backend dapat menerapkan Akses Operator
    return {
      user_id: user?.id,
    }
  }, [isBendahara, skpd, user?.id])

  const { data: serverResponse, isLoading } = useGetSkpp({
    menu,
    page,
    perPage,
    search: search.trim() || undefined,
    nomor: nomor.trim() || undefined,
    jenis_skpp: jenisSkpp !== 'all' ? jenisSkpp : undefined,
    date_from: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    date_to: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    sort_by: sortBy,
    sort_dir: sortDir,
    ...opdFilter,
  })
  const { mutateAsync: postSkppAsync } = usePostSkpp()
  const { mutateAsync: putSkppAsync } = usePutSkpp()
  const { mutateAsync: deleteSkppAsync } = useDeleteSkpp()
  const { mutateAsync: terimaSkppAsync } = useTerimaSkpp()
  const { mutateAsync: tolakSkppAsync } = useTolakSkpp()
  const { mutateAsync: verifikasiSkppAsync } = useVerifikasiSkpp()
  const { mutateAsync: signSkppAsync } = useSignSkpp()

  const [currentRow, setCurrentRow] = useState<SkppData | null>(null)
  const [open, setOpen] = useState<SkppDialogType>(null)

  // Use server data if available; fallback to INITIAL_SKPP_DATA
  const data = useMemo<SkppData[]>(() => {
    if (serverResponse?.data && serverResponse.data.length > 0) {
      return serverResponse.data
    }

    return []
  }, [serverResponse, menu])

  const addSkpp = async (newItem: Omit<SkppData, 'id' | 'created_at'> | FormData) => {
    try {
      await postSkppAsync(newItem as any)
      toast.success('Data SKPP berhasil disimpan ke database!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan data ke database.')
      throw err
    }
  }

  const updateSkpp = async (id: string | number, updatedItem: Partial<SkppData> | FormData) => {
    try {
      await putSkppAsync({ id, payload: updatedItem as any })
      toast.success('Data SKPP berhasil diperbarui di database!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal memperbarui data di database.')
      throw err
    }
  }

  const deleteSkpp = async (id: string | number) => {
    try {
      await deleteSkppAsync(id)
      toast.success('Data SKPP berhasil dihapus dari database.')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menghapus data dari database.')
      throw err
    }
  }

  const terimaSkpp = async (id: string | number) => {
    try {
      await terimaSkppAsync({ id: id.toString() })
      toast.success('Permohonan SKPP berhasil DITERIMA!')
      setOpen(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menerima permohonan SKPP.')
      throw err
    }
  }

  const tolakSkpp = async (id: string | number, alasan: string) => {
    try {
      await tolakSkppAsync({ id: id.toString(), alasan_tolak: alasan })
      toast.success('Permohonan SKPP berhasil DITOLAK!')
      setOpen(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menolak permohonan SKPP.')
      throw err
    }
  }

  const verifikasiSkpp = async (
    id: string | number,
    statusOrPayload: 'Diterima' | 'Perlu Perbaikan' | 'Ditolak' | 'Draft' | (Record<string, any> & { status: any; catatan_perbaikan?: string; verifikasi_berkas?: any }),
    alasan?: string,
    verifikasi_berkas?: any
  ) => {
    try {
      let payloadObj: Record<string, any> = {}

      if (typeof statusOrPayload === 'object' && statusOrPayload !== null) {
        payloadObj = {
          ...statusOrPayload,
          status: statusOrPayload.status,
          alasan: statusOrPayload.catatan_perbaikan || statusOrPayload.alasan,
          verifikasi_berkas: statusOrPayload.verifikasi_berkas,
        }
      } else {
        payloadObj = {
          status: statusOrPayload,
          alasan,
          verifikasi_berkas,
        }
      }

      await verifikasiSkppAsync({
        id: id.toString(),
        ...payloadObj,
      } as any)
      toast.success(`Hasil pemeriksaan berhasil disimpan: ${payloadObj.status}!`)
      setOpen(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan hasil pemeriksaan SKPP.')
      throw err
    }
  }

  const signSkpp = async (payload: { id: string; file?: File; passphrase: string; nama_file?: string }) => {
    try {
      await signSkppAsync(payload)
      toast.success('Dokumen SKPP berhasil ditandatangani secara elektronik (TTE)!')
      setOpen(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal melakukan tanda tangan elektronik.')
      throw err
    }
  }

  return (
    <SkppContext.Provider
      value={{
        data,
        meta: serverResponse?.meta,
        currentRow,
        open,
        isLoading,
        userRole,
        isBendahara,
        search,
        setSearch,
        nomor,
        setNomor,
        jenisSkpp,
        setJenisSkpp,
        dateRange,
        setDateRange,
        page,
        setPage,
        perPage,
        setPerPage,
        sortBy,
        setSortBy,
        sortDir,
        setSortDir,
        setOpen,
        setCurrentRow,
        addSkpp,
        updateSkpp,
        deleteSkpp,
        terimaSkpp,
        tolakSkpp,
        verifikasiSkpp,
        signSkpp,
      }}
    >
      {children}
    </SkppContext.Provider>
  )
}

const defaultSkppContext: SkppContextType = {
  data: [],
  meta: undefined,
  currentRow: null,
  open: null,
  isLoading: false,
  userRole: null,
  isBendahara: false,
  search: '',
  setSearch: () => {},
  nomor: '',
  setNomor: () => {},
  jenisSkpp: 'all',
  setJenisSkpp: () => {},
  dateRange: { from: undefined, to: undefined },
  setDateRange: () => {},
  page: 1,
  setPage: () => {},
  perPage: 10,
  setPerPage: () => {},
  sortBy: 'created_at',
  setSortBy: () => {},
  sortDir: 'desc',
  setSortDir: () => {},
  setOpen: () => {},
  setCurrentRow: () => {},
  addSkpp: async () => {},
  updateSkpp: async () => {},
  deleteSkpp: async () => {},
  terimaSkpp: async () => {},
  tolakSkpp: async () => {},
  verifikasiSkpp: async () => {},
  signSkpp: async () => {},
}

export function useSkpp() {
  const context = useContext(SkppContext)
  if (!context) {
    console.warn('useSkpp was called outside of a SkppProvider. Falling back to default context.')
    return defaultSkppContext
  }
  return context
}
