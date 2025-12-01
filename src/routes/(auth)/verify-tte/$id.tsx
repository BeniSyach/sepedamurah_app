/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, User, FileText, ShieldCheck } from 'lucide-react'
import { api } from '@/api/common/client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/(auth)/verify-tte/$id')({
  component: VerifyPage,
})

function VerifyPage() {
  const { id } = Route.useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['verify-tte', id],
    queryFn: async () => {
      const res = await api.get(`/verify-tte/${id}`)
      return res.data
    },
  })

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorMessage />

  const sp2d = data?.data

  return (
    <div className='flex min-h-screen w-full justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-10'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-4xl'
      >
        <Card className='w-full rounded-3xl border border-gray-200 bg-white/80 shadow-2xl backdrop-blur'>
          <CardHeader className='border-b py-10 text-center'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className='flex flex-col items-center'
            >
              <ShieldCheck className='mb-4 h-14 w-14 text-blue-700' />
              <CardTitle className='text-4xl font-extrabold tracking-tight text-gray-800'>
                Verifikasi TTE SP2D
              </CardTitle>
              <p className='mt-2 text-lg text-gray-600'>
                Pemeriksaan keaslian Tanda Tangan Elektronik Dokumen SP2D
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className='px-10 py-10'>
            {/* STATUS */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='mb-10 flex justify-center'
            >
              {sp2d?.status == 1 ? (
                <Badge className='flex items-center gap-3 rounded-full bg-green-600 px-6 py-3 text-lg text-white shadow-lg'>
                  <CheckCircle className='h-6 w-6' /> TTE Valid
                </Badge>
              ) : (
                <Badge className='flex items-center gap-3 rounded-full bg-red-600 px-6 py-3 text-lg text-white shadow-lg'>
                  <XCircle className='h-6 w-6' /> Belum Ditandatangani
                </Badge>
              )}
            </motion.div>

            {/* INFO BOX */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className='grid grid-cols-1 gap-6 md:grid-cols-2'
            >
              <InfoItem
                icon={<FileText className='h-7 w-7 text-blue-700' />}
                label='Nomor SP2D'
                value={sp2d?.no_sp2d || '-'}
              />

              <InfoItem
                icon={<User className='h-7 w-7 text-indigo-700' />}
                label='Nama Penandatangan'
                value={sp2d?.nama_penandatangan || '-'}
              />

              <InfoItem
                icon={<CheckCircle className='h-7 w-7 text-green-700' />}
                label='Tanggal TTE'
                value={sp2d?.tgl_tte || '-'}
              />

              <InfoItem
                icon={<ShieldCheck className='h-7 w-7 text-gray-700' />}
                label='Status'
                value={
                  sp2d?.status == 1 ? 'Dokumen Asli & Valid' : 'Tidak Valid'
                }
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Info Item
function InfoItem({ icon, label, value }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className='flex items-center gap-4 rounded-2xl border bg-gray-50 p-6 shadow-inner'
    >
      {icon}
      <div>
        <p className='text-lg text-gray-600'>{label}</p>
        <p className='text-xl font-semibold text-gray-800'>{value}</p>
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-10'>
      <Card className='w-full max-w-4xl space-y-6 rounded-3xl p-10 shadow-xl'>
        <Skeleton className='mx-auto h-10 w-60' />
        <Skeleton className='mx-auto h-6 w-96' />
        <div className='mt-10 grid grid-cols-2 gap-6'>
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
        </div>
      </Card>
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-red-50 p-10'>
      <Card className='w-full max-w-xl rounded-2xl border border-red-300 p-8 shadow-xl'>
        <p className='text-center text-xl font-semibold text-red-700'>
          Tidak dapat memverifikasi dokumen.
        </p>
      </Card>
    </div>
  )
}
