// src/components/stat-card.tsx
import { motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: string
  subtitle?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  hover: { scale: 1.03 },
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'text-blue-600',
  subtitle,
}: StatCardProps) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? false : 'hidden'}
      animate='enter'
      whileHover={shouldReduceMotion ? undefined : 'hover'}
      variants={cardVariants}
    >
      <Card className='border border-slate-200 bg-white shadow-sm dark:bg-slate-800'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-slate-800 dark:text-slate-100'>
            {title}
          </CardTitle>
          <Icon className={`h-5 w-5 ${color}`} />
        </CardHeader>

        <CardContent>
          <div className='text-3xl font-bold text-slate-900 dark:text-slate-50'>
            {value}
          </div>
          {subtitle && (
            <p className='mt-1 text-xs text-slate-500 dark:text-slate-300'>
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
