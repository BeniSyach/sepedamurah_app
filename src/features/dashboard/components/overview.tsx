import { type MasterSkpd, useGetSp2dChart } from '@/api'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface Props {
  tahun: string
}

export function Overview({ tahun }: Props) {
  const skpd = JSON.parse(
    localStorage.getItem('user_skpd') || '{}'
  ) as MasterSkpd
  const userRole = localStorage.getItem('user_role') ?? ''

  const params = {
    tahun: Number(tahun),

    ...(userRole === 'Bendahara' && {
      kd_opd1: skpd?.kd_opd1,
      kd_opd2: skpd?.kd_opd2,
      kd_opd3: skpd?.kd_opd3,
      kd_opd4: skpd?.kd_opd4,
      kd_opd5: skpd?.kd_opd5,
    }),
  }
  const { data } = useGetSp2dChart(params)

  // Convert response: Sp2dChartResponse → Recharts format
  const chartData =
    data?.chart.labels.map((label, index) => ({
      name: label, // "Jan", "Feb", ...
      total: data.chart.values[index], // number
    })) ?? []

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey='total' radius={[4, 4, 0, 0]} className='fill-primary' />
      </BarChart>
    </ResponsiveContainer>
  )
}
