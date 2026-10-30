import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSkpp } from './skpp-provider'

export function SkppDeleteDialog() {
  const { open, setOpen, currentRow, deleteSkpp } = useSkpp()
  const isOpen = open === 'delete'

  if (!currentRow) return null

  const handleDelete = async () => {
    try {
      await deleteSkpp(currentRow.id)
      setOpen(null)
    } catch {
      // error handled in provider
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(val) => !val && setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Dokumen SKPP?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data SKPP dengan nomor surat{' '}
            <span className='font-semibold text-foreground'>
              {currentRow.nomor_surat}
            </span>{' '}
            atas nama pegawai{' '}
            <span className='font-semibold text-foreground'>{currentRow.nama}</span>
            ? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(null)}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
