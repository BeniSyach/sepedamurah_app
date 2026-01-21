'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type MasterSkpd,
  useGetRefSKPD,
  useGetUserRole,
  usePostUsers,
  usePutUsers,
  type Users,
  type UsersRole,
} from '@/api'
import { CheckIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { SelectDropdown } from '@/components/select-dropdown'

const status = [
  {
    value: '1',
    label: 'Aktif',
  },
  {
    value: '0',
    label: 'Tidak Aktif',
  },
]

const formSchema = z
  .object({
    id: z.string().optional(),
    nik: z.string().min(1, 'NIK Tidak Boleh Kosong.'),
    nip: z.string().min(1, 'NIP Tidak Boleh Kosong.'),
    name: z.string().min(1, 'Nama Tidak Boleh Kosong.'),
    no_hp: z.string().min(1, 'Nomor Hp Tidak Boleh Kosong.'),
    kd_opd1: z.string().min(1, 'Kode SKPD Harus Ada.'),
    kd_opd2: z.string().min(1, 'Kode SKPD Harus Ada.'),
    kd_opd3: z.string().min(1, 'Kode SKPD Harus Ada.'),
    kd_opd4: z.string().min(1, 'Kode SKPD Harus Ada.'),
    kd_opd5: z.string().min(1, 'Kode SKPD Harus Ada.'),
    is_active: z.string().min(1, 'Status Users Harus Ada.'),
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Email Tidak Boleh Kosong.' : undefined,
    }),
    isEdit: z.boolean(),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z
      .array(z.string().min(1, 'Role Harus Diisi.'))
      .min(1, 'Pilih minimal 1 role'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Pasword Tidak Boleh Kosong.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: 'Password harus Panjang Karakter Minimum 8 Digit.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: 'Password Tidak Cocok.',
      path: ['confirmPassword'],
    }
  )
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: Users
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow

  // ✅ Hook React Query
  const { mutateAsync: postUsersAsync } = usePostUsers()
  const { mutateAsync: putUsersAsync } = usePutUsers()

  const { data: dataUserRole, isError: isErrorUserRole } = useGetUserRole({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // Ambil data dari response
  const itemsUserRole =
    dataUserRole?.data?.map((item: UsersRole) => ({
      value: item.id?.toString() ?? '',
      label: item.rule ?? '',
    })) ?? []

  // Kalau error, bisa fallback ke array kosong
  const roles = isErrorUserRole ? [] : itemsUserRole

  const {
    data: dataSKPD,
    isLoading: isLoadingSKPD,
    isError: isErrorSKPD,
  } = useGetRefSKPD({
    page: 1,
    perPage: 100, // ambil banyak biar bisa isi select
  })

  // Ambil data dari response
  const itemsSKPD =
    dataSKPD?.data?.map((item: MasterSkpd) => ({
      // Gabungkan kd_opd1...5 menjadi satu string
      value: [
        item.kd_opd1,
        item.kd_opd2,
        item.kd_opd3,
        item.kd_opd4,
        item.kd_opd5,
      ]
        .filter(Boolean) // hilangkan undefined/null jika ada
        .join('-'), // hasil: "00-01-01-02-03"

      label: item.nm_opd ?? '',
    })) ?? []

  // Kalau error, bisa fallback ke array kosong
  const safeItemsSKPD = isErrorSKPD ? [] : itemsSKPD

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: currentRow?.id.toString() ?? '',
      nik: currentRow?.nik ?? '',
      nip: currentRow?.nip ?? '',
      name: currentRow?.name ?? '',
      email: currentRow?.email ?? '',
      no_hp: currentRow?.no_hp ?? '',
      kd_opd1: currentRow?.kd_opd1 ?? '',
      kd_opd2: currentRow?.kd_opd2 ?? '',
      kd_opd3: currentRow?.kd_opd3 ?? '',
      kd_opd4: currentRow?.kd_opd4 ?? '',
      kd_opd5: currentRow?.kd_opd5 ?? '',
      password: '',
      confirmPassword: '',
      role: currentRow?.rules?.map((r) => r.id.toString()) ?? [],
      is_active: currentRow?.is_active,
      isEdit: isEdit ?? false,
    },
  })

  const onSubmit = async (data: UserForm) => {
    const requestPromise = isEdit ? putUsersAsync(data) : postUsersAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data User berhasil diperbarui!'
          : 'Data User berhasil ditambahkan!'
      },
      error: (err) => {
        const message =
          err?.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan data.'
        return message
      },
    })
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Perbarui User disini. ' : 'Tambah baru User disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='kd_opd1'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Pilih SKPD
                    </FormLabel>

                    <SelectDropdown
                      // 💡 Gunakan gabungan kode SKPD sebagai default value
                      defaultValue={
                        [
                          form.getValues('kd_opd1'),
                          form.getValues('kd_opd2'),
                          form.getValues('kd_opd3'),
                          form.getValues('kd_opd4'),
                          form.getValues('kd_opd5'),
                        ]
                          .filter(Boolean)
                          .join('-') || undefined
                      }
                      onValueChange={(value) => {
                        const parts = value.split('-')
                        form.setValue('kd_opd1', parts[0] ?? '')
                        form.setValue('kd_opd2', parts[1] ?? '')
                        form.setValue('kd_opd3', parts[2] ?? '')
                        form.setValue('kd_opd4', parts[3] ?? '')
                        form.setValue('kd_opd5', parts[4] ?? '')
                        field.onChange(parts[0])
                      }}
                      placeholder='Pilih SKPD'
                      className='col-span-4 w-full'
                      isPending={isLoadingSKPD}
                      items={safeItemsSKPD}
                      disabled={isErrorSKPD}
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nik'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>NIK</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik NIK Anda'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nip'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>NIP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik NIP Anda'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Lengkap
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Nama Lengkap Anda'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='no_hp'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nomor Handphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='628....'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Role</FormLabel>
                    <FormControl className='col-span-4'>
                      <Command className='bg-popover text-popover-foreground w-full rounded-md border'>
                        <CommandInput placeholder='Pilih Role...' />
                        <CommandList>
                          {roles.length === 0 && (
                            <CommandEmpty>Tidak ada role</CommandEmpty>
                          )}
                          <CommandGroup>
                            {roles.map((r) => (
                              <CommandItem
                                key={r.value}
                                onSelect={() => {
                                  if (!field.value.includes(r.value)) {
                                    field.onChange([...field.value, r.value])
                                  } else {
                                    field.onChange(
                                      field.value.filter((v) => v !== r.value)
                                    )
                                  }
                                }}
                              >
                                <span>{r.label}</span>
                                {field.value.includes(r.value) && (
                                  <CheckIcon className='ms-auto h-4 w-4' />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='is_active'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Status Penerimaan
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value ?? '')}
                      onValueChange={(val) => field.onChange(val)}
                      placeholder='Pilih Status Penerimaan SKPD'
                      className='col-span-4'
                      items={status.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
