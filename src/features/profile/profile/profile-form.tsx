import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/auth-store'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Schema validasi
const profileFormSchema = z.object({
  nama: z
    .string()
    .min(2, 'Nama harus minimal 2 karakter.')
    .max(50, 'Nama tidak boleh lebih dari 50 karakter.'),
  nik: z.string().length(16, 'NIK harus 16 karakter.'),
  nip: z
    .string()
    .min(8, 'NIP minimal 8 karakter.')
    .max(20, 'NIP maksimal 20 karakter.'),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const user = useAuthStore((s) => s.user)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nama: user?.name || '',
      nik: user?.nik || '',
      nip: user?.nip || '',
    },
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-6'
      >
        <FormField
          control={form.control}
          name='nama'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder='Masukkan nama lengkap' {...field} />
              </FormControl>
              <FormDescription>
                Ini adalah nama tampilan publik Anda. Nama ini bisa menggunakan
                nama asli.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nik'
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK</FormLabel>
              <FormControl>
                <Input placeholder='Masukkan NIK' {...field} />
              </FormControl>
              <FormDescription>
                Nomor Induk Kependudukan (NIK) harus 16 digit sesuai KTP.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nip'
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIP</FormLabel>
              <FormControl>
                <Input placeholder='Masukkan NIP' {...field} />
              </FormControl>
              <FormDescription>
                Nomor Induk Pegawai (NIP) digunakan untuk identifikasi pegawai.
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
