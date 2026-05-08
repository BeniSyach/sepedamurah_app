import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type {
  AvailableYearsResponse,
  DPAStatisticsResponse,
  DPATypesResponse,
  MonitoringResponse,
} from './types'

interface payloadMonitoringDPA {
  tahun?: string
  dpa_id?: string
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
}

export function useGetMonitoringDPA(params: payloadMonitoringDPA) {
  return useQuery({
    queryKey: ['useGetMonitoringDPA', params],
    queryFn: async () => {
      const { data } = await api.get<MonitoringResponse>(
        '/dashboard/monitoring-dpa',
        {
          params: {
            tahun: params.tahun ?? '',
            dpa_id: params.dpa_id ?? '',
            kd_opd1: params.kd_opd1 ?? '',
            kd_opd2: params.kd_opd2 ?? '',
            kd_opd3: params.kd_opd3 ?? '',
            kd_opd4: params.kd_opd4 ?? '',
            kd_opd5: params.kd_opd5 ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useGetMonitoringDPAYears() {
  return useQuery({
    queryKey: ['useGetMonitoringDPAYears'],
    queryFn: async () => {
      const { data } = await api.get<AvailableYearsResponse>(
        '/dashboard/monitoring-dpa/years'
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useGetMonitoringDPATypes() {
  return useQuery({
    queryKey: ['useGetMonitoringDPATypes'],
    queryFn: async () => {
      const { data } = await api.get<DPATypesResponse>(
        '/dashboard/monitoring-dpa/dpa-types'
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useGetMonitoringDPAStatistics() {
  return useQuery({
    queryKey: ['useGetMonitoringDPAStatistics'],
    queryFn: async () => {
      const { data } = await api.get<DPAStatisticsResponse>(
        '/dashboard/monitoring-dpa/statistics'
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
