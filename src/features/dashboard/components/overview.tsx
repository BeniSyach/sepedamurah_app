import { useGetSp2dChart } from '@/api'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export function Overview() {
  const { data } = useGetSp2dChart({
    tahun: new Date().getFullYear().toString(),
  })

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
