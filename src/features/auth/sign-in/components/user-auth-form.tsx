import { useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { type MasterSkpd, useLogin, type User } from '@/api'
import { Loader2, LogIn } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  nip: z.string({
    error: (iss) => (iss.input === '' ? 'Masukkan NIP Anda' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Masukkan Password Anda')
    .min(6, 'Password Harus 6 digit huruf atau angka'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [openRoleDialog, setOpenRoleDialog] = useState(false)
  const [openSkpdDialog, setOpenSkpdDialog] = useState(false)
  const [selectedSkpd, setSelectedSkpd] = useState<MasterSkpd | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nip: '',
      password: '',
    },
  })

  const loginMutation = useLogin() // tidak ada argumen di sini

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    if (!captchaValue) {
      toast.error('Silakan verifikasi bahwa Anda bukan robot.')
      setIsLoading(false)
      return
    }
    const loginPromise = loginMutation.mutateAsync({
      nip: data.nip.toString(),
      password: data.password,
      captcha: captchaValue,
    })

    await toast.promise(loginPromise, {
      loading: 'Loading Masuk...',
      success: (res) => {
        setUserData(res.user)

        // Jika user punya banyak rules, tampilkan modal
        const skpdList = res.user.skpds ?? []
        const roleList = res.user.rules ?? []

        // 1️⃣ Banyak SKPD → pilih SKPD dulu
        if (skpdList.length > 1) {
          setOpenSkpdDialog(true)
        }
        // 2️⃣ Satu SKPD tapi banyak role
        else if (roleList.length > 1) {
          setSelectedSkpd(skpdList[0])
          setOpenRoleDialog(true)
        }
        // 3️⃣ Satu SKPD & satu role
        else {
          localStorage.setItem('user_skpd', JSON.stringify(skpdList[0]))
          localStorage.setItem('user_role', roleList[0].rule)
          navigate({ to: '/dashboard', replace: true })
        }

        setIsLoading(false)
        return `Selamat datang kembali, ${res.user.name}!`
      },
      error: (err) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(recaptchaRef.current as any)?.reset()
        setCaptchaValue(null)
        setIsLoading(false)
        return err.response?.data?.error || 'Terjadi kesalahan saat login.'
      },
    })
  }

  function handleSelectSkpd(skpd: MasterSkpd) {
    setSelectedSkpd(skpd)
    setOpenSkpdDialog(false)

    const roleList = userData?.rules ?? []

    // Kalau role > 1 → pilih role
    if (roleList.length > 1) {
      setOpenRoleDialog(true)
    } else {
      localStorage.setItem('user_skpd', JSON.stringify(skpd))
      localStorage.setItem('user_role', roleList[0].rule)
      navigate({ to: '/dashboard', replace: true })
    }
  }

  function handleSelectRole(role: string) {
    if (selectedSkpd) {
      localStorage.setItem('user_skpd', JSON.stringify(selectedSkpd))
      localStorage.setItem('user_role', role)

      toast.success(`Login sebagai ${role}`)
      setOpenRoleDialog(false)
      navigate({ to: '/dashboard', replace: true })
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('grid gap-3', className)}
          {...props}
        >
          <FormField
            control={form.control}
            name='nip'
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIP</FormLabel>
                <FormControl>
                  <Input placeholder='19********' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='relative'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='********' {...field} />
                </FormControl>
                <FormMessage />
                {/* <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link> */}
              </FormItem>
            )}
          />
          {/* 🧩 Google reCAPTCHA */}
          <div className='mt-2 flex justify-center'>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={
                import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'ISI_SITE_KEY_KAMU'
              }
              onChange={(value) => setCaptchaValue(value)}
              onExpired={() => setCaptchaValue(null)}
            />
          </div>

          <Button className='mt-2' disabled={isLoading}>
            {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
            Masuk
          </Button>
        </form>
      </Form>

      <Dialog open={openSkpdDialog} onOpenChange={setOpenSkpdDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Pilih SKPD</DialogTitle>
          </DialogHeader>

          <div className='space-y-3'>
            {userData?.skpds.map((s) => (
              <Button
                key={s.nm_opd}
                variant='outline'
                className='w-full justify-start'
                onClick={() => handleSelectSkpd(s)}
              >
                {s.nm_opd}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 💬 Modal Pilih Role */}
      <Dialog open={openRoleDialog} onOpenChange={setOpenRoleDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Pilih Peran Login</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            {userData?.rules.map((r) => (
              <Button
                key={r.id}
                variant='outline'
                className='w-full justify-start'
                onClick={() => handleSelectRole(r.rule)}
              >
                {r.rule}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
