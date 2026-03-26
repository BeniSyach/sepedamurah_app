/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  FileCheck2,
  Folder,
  RotateCcw,
  X,
  Send,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { ThemeSwitch } from '@/components/theme-switch'

export function CompanyProfile() {
  const [botOpen, setBotOpen] = useState(false)

  const modules = [
    {
      title: 'Modul SPD',
      subtitle: 'Pendistribusian SPD',
      icon: FileText,
      href: '/sign-in',
      color: 'from-sky-300/40 to-blue-500/60',
      iconColor: 'text-sky-600 dark:text-sky-300',
    },
    {
      title: 'Penerbitan SP2D',
      subtitle: 'Permohonan penerbitan SP2D',
      icon: FileCheck2,
      href: '/sign-in',
      color: 'from-purple-300/40 to-indigo-500/60',
      iconColor: 'text-indigo-600 dark:text-indigo-300',
    },
    {
      title: 'E-Dokumen',
      subtitle: 'Aplikasi e-dokumen Sergai',
      icon: Folder,
      href: 'https://edokumen.serdangbedagaikab.go.id',
      badge: { text: 'Old', variant: 'destructive' },
      color: 'from-amber-300/40 to-orange-500/60',
      iconColor: 'text-amber-600 dark:text-amber-300',
    },
    {
      title: 'Pengembalian Dana',
      subtitle: 'Modul Pengembalian Dana',
      icon: RotateCcw,
      href: '/pengembalian_dana',
      badge: { text: 'New', variant: 'success' },
      color: 'from-emerald-300/40 to-green-500/60',
      iconColor: 'text-emerald-600 dark:text-emerald-300',
    },
  ]

  const steps = [
    { num: '1', text: 'Klik tombol', bold: '"Buka Bot"', sub: 'di bawah' },
    { num: '2', text: 'Tekan', bold: 'Start', sub: 'di Telegram' },
    { num: '3', text: 'Kirim nomor HP format', bold: '628xxxxxxxxxx', sub: '' },
  ]

  const features = [
    { emoji: '🔔', label: 'Notifikasi SP2D' },
    { emoji: '📄', label: 'Status Berkas' },
    { emoji: '💬', label: 'Info Terkini' },
  ]

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-slate-100 to-slate-200 text-gray-900 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-white'>
      {/* Dark mode toggle */}
      <div className='absolute top-5 right-5 z-20'>
        <ThemeSwitch />
      </div>

      {/* Background radial glow */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]' />

      {/* Animated blobs */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute top-10 left-[20%] h-72 w-72 animate-pulse rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10' />
        <div className='absolute right-[25%] bottom-10 h-96 w-96 animate-pulse rounded-full bg-blue-400/25 blur-3xl delay-700 dark:bg-indigo-500/10' />
        <div className='absolute top-[40%] right-[10%] h-64 w-64 animate-pulse rounded-full bg-emerald-300/20 blur-2xl delay-300 dark:bg-emerald-400/10' />
      </div>

      {/* Header Image */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className='relative z-10 mb-10 flex w-full max-w-5xl justify-center px-4'
      >
        <motion.img
          src='/images/sepeda-murah.png'
          alt='SEPEDAMURAH'
          className='w-full max-w-4xl rounded-2xl'
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </motion.div>

      {/* Main Content */}
      <div className='relative z-10 flex flex-col items-center px-6 text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='mb-3 bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl'
        >
          Portal Aplikasi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='mb-10 text-slate-600 dark:text-slate-300'
        >
          Pilih modul yang ingin Anda akses
        </motion.p>

        <TooltipProvider>
          <div className='grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {modules.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.4, duration: 0.5 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={mod.href}
                      target={
                        mod.href.startsWith('http') ? '_blank' : undefined
                      }
                    >
                      <Card
                        className={`relative bg-gradient-to-br ${mod.color} cursor-pointer border border-white/30 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-white/10`}
                      >
                        <CardContent className='flex flex-col items-center py-8'>
                          <div
                            className={`mb-1 rounded-2xl bg-white/40 p-3 dark:bg-white/10 ${mod.iconColor}`}
                          >
                            <mod.icon size={32} />
                          </div>
                          <h3 className='mt-3 text-base font-bold'>
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

                          <p className='mt-1 text-center text-xs leading-snug opacity-70'>
                            {mod.subtitle}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{mod.subtitle}</TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </TooltipProvider>
      </div>

      {/* ── FLOATING TELEGRAM BOT WIDGET ── */}
      <div className='fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3'>
        {/* Pop-up Card */}
        <AnimatePresence>
          {botOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className='w-80 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800'
              style={{ transformOrigin: 'bottom right' }}
            >
              {/* Card Header */}
              <div className='relative bg-gradient-to-r from-blue-500 to-sky-400 p-4'>
                <button
                  onClick={() => setBotOpen(false)}
                  className='absolute top-3 right-3 text-white/70 transition hover:text-white'
                >
                  <X size={18} />
                </button>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-inner'>
                    🤖
                  </div>
                  <div>
                    <p className='text-sm font-bold text-white'>
                      Bot Sepedamurah
                    </p>
                    <div className='mt-0.5 flex items-center gap-1'>
                      <span className='h-2 w-2 animate-pulse rounded-full bg-emerald-300' />
                      <span className='text-xs text-white/80'>
                        Online sekarang
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fake chat bubble */}
                <div className='mt-4 rounded-2xl rounded-tl-sm bg-white/20 px-4 py-2.5 text-xs leading-relaxed text-white'>
                  👋 Halo! Hubungkan akun kamu ke bot Telegram dan dapatkan
                  notifikasi real-time!
                </div>
              </div>

              {/* Steps */}
              <div className='space-y-3 p-4'>
                <p className='text-xs font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500'>
                  Cara Pakai
                </p>
                {steps.map((step, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'>
                      {step.num}
                    </span>
                    <p className='text-sm text-slate-600 dark:text-slate-300'>
                      {step.text}{' '}
                      <span className='font-semibold text-slate-800 dark:text-slate-100'>
                        {step.bold}
                      </span>{' '}
                      {step.sub}
                    </p>
                  </div>
                ))}

                {/* Features */}
                <div className='border-t border-slate-100 pt-2 dark:border-slate-700'>
                  <p className='mb-2 text-xs font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500'>
                    Fitur Notifikasi
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {features.map((f, i) => (
                      <span
                        key={i}
                        className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                      >
                        {f.emoji} {f.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href='https://t.me/sepedamurah_bot'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-400 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 active:scale-95'
                >
                  <Send size={15} />
                  Buka Bot Telegram
                  <ChevronRight size={15} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          onClick={() => setBotOpen((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 text-2xl text-white shadow-xl'
          title='Bot Telegram'
        >
          {/* Ping ring */}
          {!botOpen && (
            <span className='absolute inset-0 animate-ping rounded-2xl bg-blue-400 opacity-60' />
          )}
          <span className='relative z-10'>
            {botOpen ? <X size={24} /> : '🤖'}
          </span>

          {/* Notification dot */}
          {!botOpen && (
            <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-400 text-[9px] font-bold text-white dark:border-slate-800'>
              1
            </span>
          )}
        </motion.button>
      </div>
    </div>
  )
}
