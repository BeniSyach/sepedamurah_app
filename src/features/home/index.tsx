/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FileText, FileCheck2, Folder, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { ThemeSwitch } from '@/components/theme-switch'

// ✅ gunakan komponenmu sendiri

export function CompanyProfile() {
  const modules = [
    {
      title: 'Modul SPD',
      subtitle: 'Pendistribusian SPD',
      icon: FileText,
      href: '/sign-in',
      color: 'from-sky-300/40 to-blue-500/60',
    },
    {
      title: 'Penerbitan SP2D',
      subtitle: 'Permohonan penerbitan SP2D',
      icon: FileCheck2,
      href: '/sign-in',
      color: 'from-purple-300/40 to-indigo-500/60',
    },
    {
      title: 'E-Dokumen',
      subtitle: 'Aplikasi e-dokumen Sergai',
      icon: Folder,
      href: 'https://edokumen.serdangbedagaikab.go.id',
      badge: { text: 'Old', variant: 'destructive' },
      color: 'from-amber-300/40 to-orange-500/60',
    },
    {
      title: 'Pengembalian Dana',
      subtitle: 'Modul Pengembalian Dana',
      icon: RotateCcw,
      href: '/pengembalian_dana',
      badge: { text: 'New', variant: 'success' },
      color: 'from-emerald-300/40 to-green-500/60',
    },
  ]

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-slate-100 to-slate-200 text-gray-900 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-white'>
      {/* === Tombol Dark Mode === */}
      <div className='absolute top-5 right-5 z-20'>
        <ThemeSwitch />
      </div>

      {/* === Efek latar belakang === */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]'></div>

      {/* === Partikel lembut === */}
      <div className='absolute top-0 left-0 h-full w-full overflow-hidden'>
        <div className='absolute top-10 left-[20%] h-72 w-72 animate-pulse rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10' />
        <div className='absolute right-[25%] bottom-10 h-96 w-96 animate-pulse rounded-full bg-blue-400/25 blur-3xl delay-700 dark:bg-indigo-500/10' />
        <div className='absolute top-[40%] right-[10%] h-64 w-64 animate-pulse rounded-full bg-emerald-300/20 blur-2xl delay-300 dark:bg-emerald-400/10' />
      </div>

      {/* === Gambar Header === */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className='relative z-10 mb-10 flex w-full max-w-5xl justify-center'
      >
        <div className='relative w-full max-w-4xl'>
          {/* Overlay untuk kontras teks dalam gambar */}
          {/* <div className='absolute inset-0 rounded-2xl bg-white/30 backdrop-blur-[2px] dark:bg-black/40'></div> */}
          <motion.img
            src='/images/sepeda-murah.png'
            alt='Sepeda Murah'
            className='w-full rounded-2xl brightness-105 contrast-110'
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* === Teks & Modul === */}
      <div className='relative z-10 flex flex-col items-center px-6 text-center'>
        <motion.h1
          className='mb-3 bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-[0_0_12px_rgba(0,0,0,0.15)] sm:text-5xl dark:from-cyan-300 dark:via-blue-300 dark:to-emerald-300'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Portal Aplikasi
        </motion.h1>

        <motion.p
          className='mb-12 text-lg tracking-wide text-slate-600 dark:text-slate-300'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Pilih modul yang ingin Anda akses
        </motion.p>

        <TooltipProvider>
          <motion.div
            className='grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {modules.map((mod, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Link
                    to={mod.href}
                    target={mod.href.startsWith('http') ? '_blank' : undefined}
                    className='group'
                  >
                    <Card
                      className={`relative bg-gradient-to-br ${mod.color} border border-white/40 shadow-lg backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:border-white/10`}
                    >
                      <CardContent className='flex flex-col items-center justify-center py-8 text-center'>
                        <div className='mb-4 rounded-2xl bg-white/60 p-3 backdrop-blur-sm transition-transform duration-300 group-hover:rotate-[8deg] dark:bg-white/10'>
                          <mod.icon
                            size={40}
                            className='text-gray-800 dark:text-white'
                          />
                        </div>
                        <h3 className='text-lg font-semibold tracking-wide text-gray-800 dark:text-white'>
                          {mod.title}
                        </h3>
                        {mod.badge && (
                          <Badge
                            variant={mod.badge.variant as any}
                            className='absolute top-3 right-3 text-xs'
                          >
                            {mod.badge.text}
                          </Badge>
                        )}
                        <p className='mt-1 text-sm text-gray-700 opacity-90 dark:text-slate-300'>
                          {mod.subtitle}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{mod.subtitle}</TooltipContent>
              </Tooltip>
            ))}
          </motion.div>
        </TooltipProvider>

        {/* === Helpdesk === */}
        <motion.div
          className='mt-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <p className='inline-block rounded-lg bg-white/60 px-4 py-2 text-sm font-medium text-gray-800 shadow-md backdrop-blur-md dark:bg-white/10 dark:text-white'>
            💬 Help Desk:{' '}
            <span className='font-semibold text-sky-700 dark:text-sky-300'>
              0813-7577-4567
            </span>{' '}
            (Arfan Saragih)
          </p>
        </motion.div>
      </div>
    </div>
  )
}
