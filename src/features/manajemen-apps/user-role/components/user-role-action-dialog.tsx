'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostUsersRole, usePutUsersRole, type UsersRole } from '@/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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

const formSchema = z.object({
  id: z.string().optional(),
  rule: z.string().min(1, 'Role Harus Ada.'),
})
type UserRoleForm = z.infer<typeof formSchema>

type UserRoleActionDialogProps = {
  currentRow?: UsersRole
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserRolesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserRoleActionDialogProps) {
  const isEdit = !!currentRow

  const { mutateAsync: postUserRoleAsync } = usePostUsersRole()
  const { mutateAsync: putUserRoleAsync } = usePutUsersRole()

  const form = useForm<UserRoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      id: '',
      rule: '',
    },
  })

  const onSubmit = async (data: UserRoleForm) => {
    const requestPromise = isEdit
      ? putUserRoleAsync(data)
      : postUserRoleAsync(data)

    await toast.promise(requestPromise, {
      loading: isEdit ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: () => {
        onOpenChange(false)
        form.reset()
        return isEdit
          ? 'Data User Role berhasil diperbarui!'
          : 'Data User Role berhasil ditambahkan!'
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
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {' '}
            {isEdit ? 'Edit User Role' : 'Tambah User Role'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui User Role disini. '
              : 'Tambah baru User Role disini. '}
            Klik simpan ketika kamu sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-role-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='rule'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nama Rule
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ketik Nama Rule'
                        className='col-span-4'
                        autoComplete='off'
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
          <Button type='submit' form='user-role-form'>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
