import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePutUsers } from '@/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Schema validasi
const accountFormSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().email('Masukkan email yang valid.'),
    no_hp: z.string().min(8, 'No HP minimal 8 digit.'),
    foto: z
      .instanceof(File) // kalau ingin pastikan tipe File
      .optional(),
    visual_tte: z
      .instanceof(File) // kalau ingin pastikan tipe File
      .optional(),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: 'Password minimal 6 karakter.',
      }),
    confirm_password: z.string().optional(),
  })
  .refine(
    (data) => {
      // Cek password dan konfirmasi hanya jika salah satu diisi
      if (data.password || data.confirm_password) {
        return data.password === data.confirm_password
      }
      return true
    },
    {
      message: 'Password dan konfirmasi harus sama',
      path: ['confirm_password'],
    }
  )

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const user = useAuthStore((s) => s.user)
  const { mutateAsync: putUsersAsync } = usePutUsers()
  const [fotoPreview, setFotoPreview] = useState<string>(
    user?.image
      ? `${import.meta.env.VITE_ASSET_URL}${user.image}`
      : 'https://placehold.co/80x80'
  )
  const [ttePreview, setTtePreview] = useState<string>(
    user?.visualisasi_tte
      ? `${import.meta.env.VITE_ASSET_URL}${user.visualisasi_tte}`
      : 'https://placehold.co/80x80'
  )

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      id: user?.id.toString(),
      email: user?.email || '',
      no_hp: user?.no_hp || '',
      foto: undefined,
      visual_tte: undefined,
      password: '',
      confirm_password: '',
    },
  })

  const onSubmit = async (data: AccountFormValues) => {
    const formData = new FormData()
    formData.append('id', data.id || '')
    formData.append('email', data.email)
    formData.append('no_hp', data.no_hp)

    // Cek langsung apakah ada File
    if (data.foto instanceof File) {
      formData.append('image', data.foto)
    }

    if (data.visual_tte instanceof File) {
      formData.append('visualisasi_tte', data.visual_tte)
    }

    const requestPromise = putUsersAsync(formData)

    await toast.promise(requestPromise, {
      loading: 'Menyimpan perubahan...',
      success: () => {
        form.reset()
        return 'Data berhasil diperbarui!'
      },
      error: (err) => {
        const message =
          err?.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan data.'
        return message
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Masukkan email' {...field} />
              </FormControl>
              <FormDescription>
                Email ini akan digunakan untuk login dan notifikasi.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='no_hp'
          render={({ field }) => (
            <FormItem>
              <FormLabel>No HP</FormLabel>
              <FormControl>
                <Input placeholder='Masukkan nomor HP' {...field} />
              </FormControl>
              <FormDescription>
                Nomor HP digunakan untuk verifikasi dan notifikasi.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='foto'
          render={() => (
            <FormItem>
              <FormLabel>Foto Profil</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      form.setValue('foto', file)
                      setFotoPreview(URL.createObjectURL(file))
                    }
                  }}
                  className='h-8 py-0'
                />
              </FormControl>
              {fotoPreview && (
                <img
                  src={fotoPreview}
                  alt='Preview Foto'
                  className='mt-2 h-32 w-32 rounded object-cover'
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/80x80'
                  }}
                />
              )}
              <FormDescription>
                Unggah foto profil Anda. Bisa dilihat preview sebelum disimpan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='visual_tte'
          render={() => (
            <FormItem>
              <FormLabel>Visual TTE</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      form.setValue('visual_tte', file)
                      setTtePreview(URL.createObjectURL(file))
                    }
                  }}
                  className='h-8 py-0'
                />
              </FormControl>
              {ttePreview && (
                <img
                  src={ttePreview}
                  alt='Preview Visual TTE'
                  className='mt-2 h-32 w-32 rounded object-cover'
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/80x80'
                  }}
                />
              )}
              <FormDescription>
                Unggah visual TTE Anda. Bisa dilihat preview sebelum disimpan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Masukkan password baru'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Isi jika ingin mengganti password. Kosongkan jika tidak ingin
                mengganti.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirm_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Konfirmasi password baru'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Masukkan ulang password baru untuk konfirmasi.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Perbarui Profil</Button>
      </form>
    </Form>
  )
}
