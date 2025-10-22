import {
  LayoutDashboard,
  UserCog,
  UserX,
  Users,
  Command,
  UserCircle,
  Database,
  ListChecks,
  List,
  ClipboardList,
  ActivitySquare,
  ListTree,
  Banknote,
  Wallet,
  FileSpreadsheet,
  ClipboardCheck,
  CheckCircle,
  CreditCard,
  Coins,
  Building2,
  Scale,
  ArrowRightLeft,
  Shield,
  KeyRound,
  LockKeyhole,
  AlarmClock,
  History,
  FileText,
  FileSignature,
  PenLine,
  FileCheck2,
  Inbox,
  FilePlus2,
  CheckCircle2,
  XCircle,
  Stamp,
  Send,
  FileClock,
  ArrowUpCircle,
  ArrowDownCircle,
  FolderOpen,
  RotateCcw,
  BarChart3,
  FileBarChart,
  PieChart,
  BookOpen,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'beni syach',
    email: 'benisyach32@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'sepeda murah',
      logo: Command,
      plan: 'Sistem Elektronik Perbendaharaan Digital Mudah Ramah dan Humanis',
    },
  ],
  navGroups: [
    {
      title: 'Umum',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Profil',
          url: '/profile',
          icon: UserCircle,
        },
      ],
    },
    {
      title: 'Data Utama',
      items: [
        {
          title: 'Master Data',
          icon: Database,
          items: [
            {
              title: 'Referensi Urusan',
              url: '/master-data/referensi-urusan',
              icon: ListChecks,
            },
            {
              title: 'Referensi Bidang Urusan',
              url: '/master-data/referensi-bidang-urusan',
              icon: List,
            },
            {
              title: 'Referensi Program',
              url: '/master-data/referensi-program',
              icon: ClipboardList,
            },
            {
              title: 'Referensi Kegiatan',
              url: '/master-data/referensi-kegiatan',
              icon: ActivitySquare,
            },
            {
              title: 'Referensi Sub Kegiatan',
              url: '/master-data/referensi-subkegiatan',
              icon: ListTree,
            },
            {
              title: 'Referensi Rekening',
              url: '/master-data/referensi-rekening',
              icon: Banknote,
            },
            {
              title: 'Referensi Pagu Belanja',
              url: '/master-data/referensi-pagu-belanja',
              icon: Wallet,
            },
            {
              title: 'Referensi Jenis SPM',
              url: '/master-data/referensi-jenis-spm',
              icon: FileSpreadsheet,
            },
            {
              title: 'Referensi Ceklis Kelengkapan Dokumen PPK-SKPD',
              url: '/master-data/referensi-ceklis-kelengkapan-dokumen-ppk-SKPD',
              icon: ClipboardCheck,
            },
            {
              title: 'Referensi Persetujuan',
              url: '/master-data/referensi-persetujuan',
              icon: CheckCircle,
            },
            {
              title: 'Referensi Jenis Belanja',
              url: '/master-data/referensi-jenis-belanja',
              icon: CreditCard,
            },
            {
              title: 'Referensi Sumber Dana',
              url: '/master-data/referensi-sumber-dana',
              icon: Coins,
            },
            {
              title: 'Referensi SKPD',
              url: '/master-data/referensi-SKPD',
              icon: Building2,
            },
          ],
        },
        {
          title: 'Alokasi Dana',
          icon: Banknote,
          items: [
            {
              title: 'Pagu Sumber Dana',
              url: '/alokasi-dana/pagu-sumber-dana',
              icon: Wallet,
            },
            {
              title: 'Besaran UP SKPD',
              url: '/alokasi-dana/besaran-up-skpd',
              icon: Scale,
            },
            {
              title: 'Realisasi Transfer Sumber Dana',
              url: '/alokasi-dana/realisasi-transfer-sumber-dana',
              icon: ArrowRightLeft,
            },
          ],
        },
      ],
    },
    {
      title: 'Manajemen Aplikasi',
      items: [
        {
          title: 'User Role',
          url: '/manajemen-apps/user-role',
          icon: Shield,
        },
        {
          title: 'Akses Operator',
          url: '/manajemen-apps/akses-operator',
          icon: KeyRound,
        },
        {
          title: 'Akses Kuasa BUD',
          url: '/manajemen-apps/akses-kuasa-bud',
          icon: LockKeyhole,
        },
        {
          title: 'Batas Waktu',
          url: '/manajemen-apps/batas-waktu',
          icon: AlarmClock,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'History',
      items: [
        {
          title: 'Log TTE',
          url: '/history/log-tte',
          icon: History,
        },
        {
          title: 'Log Hapus Users',
          url: '/history/log-hapus-users',
          icon: UserX,
        },
      ],
    },
    {
      title: 'Dokumen',
      items: [
        {
          title: 'SPD',
          icon: FileText,
          items: [
            {
              title: 'Berkas Masuk',
              url: '/dokumen/spd/berkas-masuk',
              icon: Inbox,
            },
            {
              title: 'Permohonan SPD',
              url: '/dokumen/spd/permohonan-spd',
              icon: FilePlus2,
            },
            {
              title: 'Permohonan Diterima',
              url: '/dokumen/spd/permohonan-diterima',
              icon: CheckCircle2,
            },
            {
              title: 'Permohonan Ditolak',
              url: '/dokumen/spd/permohonan-ditolak',
              icon: XCircle,
            },
            {
              title: 'SPD Ditandatangani BUD',
              url: '/dokumen/spd/spd-ditandatangani-bud',
              icon: Stamp,
            },
          ],
        },
        {
          title: 'SPD BUD TTE',
          icon: FileSignature,
          items: [
            {
              title: 'Permohonan SPD BUD TTE',
              url: '/dokumen/spd/permohonan-spd-bud-tte',
              icon: FileSignature,
            },
            {
              title: 'Permohonan Diterima',
              url: '/dokumen/spd/permohonan-diterima',
              icon: CheckCircle2,
            },
          ],
        },
        {
          title: 'Paraf SPD',
          icon: PenLine,
          items: [
            {
              title: 'SPD Belum Paraf',
              url: '/dokumen/spd/belum-paraf',
              icon: FileClock,
            },
            {
              title: 'SPD Sudah paraf',
              url: '/dokumen/spd/sudah-paraf',
              icon: FileCheck2,
            },
          ],
        },
        {
          title: 'SP2D',
          icon: FileCheck2,
          items: [
            {
              title: 'Berkas masuk',
              url: '/dokumen/sp2d/berkas-masuk',
              icon: Inbox,
            },
            {
              title: 'Permohonan Penerbitan SP2D',
              url: '/dokumen/sp2d/permohonan-penerbitan-sp2d',
              icon: FilePlus2,
            },
            {
              title: 'Permohonan Diterima',
              url: '/dokumen/sp2d/permohonan-diterima',
              icon: CheckCircle2,
            },
            {
              title: 'Permohonan Ditolak',
              url: '/dokumen/sp2d/permohonan-ditolak',
              icon: XCircle,
            },
            {
              title: 'SP2D Di Publish Kuasa BUD',
              url: '/dokumen/sp2d/sp2d-di-publish-kuasa-bud',
              icon: Stamp,
            },
            {
              title: 'SP2D Kirim Ke Bank',
              url: '/dokumen/sp2d/sp2d-kirim-ke-bank',
              icon: Send,
            },
          ],
        },
        {
          title: 'SP2D TTE',
          icon: FileSignature,
          items: [
            {
              title: 'Permohonan SP2D TTE',
              url: '/dokumen/sp2d/permohonan-sp2d-tte',
              icon: FileSignature,
            },
            {
              title: 'Permohonan Diterima',
              url: '/dokumen/sp2d/permohonan-diterima',
              icon: CheckCircle2,
            },
          ],
        },
      ],
    },
    {
      title: 'Laporan Fungsional',
      items: [
        {
          title: 'Pengeluaran',
          icon: ArrowUpCircle,
          items: [
            {
              title: 'Berkas Masuk Pengeluaran',
              url: '/dokumen/laporan-fungsional/berkas-masuk-pengeluaran',
              icon: UserCog,
            },
            {
              title: 'Pengeluaran',
              url: '/dokumen/laporan-fungsional/pengeluaran',
              icon: ArrowUpCircle,
            },
            {
              title: 'Pengeluaran - Diterima',
              url: '/dokumen/laporan-fungsional/pengeluaran-diterima',
              icon: CheckCircle2,
            },
            {
              title: 'Pengeluaran - Ditolak',
              url: '/dokumen/laporan-fungsional/pengeluaran-ditolak',
              icon: XCircle,
            },
          ],
        },
        {
          title: 'Penerimaan',
          icon: ArrowDownCircle,
          items: [
            {
              title: 'Berkas Masuk Penerimaan',
              url: '/dokumen/laporan-fungsional/berkas-masuk-penerimaan',
              icon: UserCog,
            },
            {
              title: 'Penerimaan',
              url: '/dokumen/laporan-fungsional/penerimaan',
              icon: ArrowDownCircle,
            },
            {
              title: 'Penerimaan - Diterima',
              url: '/dokumen/laporan-fungsional/penerimaan-diterima',
              icon: CheckCircle2,
            },
            {
              title: 'Penerimaan - Ditolak',
              url: '/dokumen/laporan-fungsional/penerimaan-ditolak',
              icon: XCircle,
            },
          ],
        },
      ],
    },
    {
      title: 'Berkas TTE Lain-lain',
      items: [
        {
          title: 'Berkas Lain',
          url: '/dokumen/berkas-lain',
          icon: FolderOpen,
        },
      ],
    },
    {
      title: 'Pengembalian',
      items: [
        {
          title: 'Pengembalian',
          url: '/pengembalian',
          icon: RotateCcw,
        },
      ],
    },
    {
      title: 'Laporan',
      items: [
        {
          title: 'Buku Laporan',
          url: '/laporan/buku-laporan',
          icon: BookOpen,
        },
        {
          title: 'Laporan Realisasi Sumber Dana',
          url: '/laporan/realisasi-sumber-dana',
          icon: BarChart3,
        },
        {
          title: 'Laporan Daftar Belanja per SKPD',
          url: '/laporan/daftar-belanja-per-skpd',
          icon: FileBarChart,
        },
        {
          title: 'Laporan Realisasi Belanja',
          url: '/laporan/realisasi-belanja',
          icon: PieChart,
        },
      ],
    },
    // default
    // {
    //   title: 'General',
    //   items: [
    //     {
    //       title: 'Dashboard',
    //       url: '/dashboard',
    //       icon: LayoutDashboard,
    //     },
    //     {
    //       title: 'Tasks',
    //       url: '/tasks',
    //       icon: ListTodo,
    //     },
    //     {
    //       title: 'Apps',
    //       url: '/apps',
    //       icon: Package,
    //     },
    //     {
    //       title: 'Chats',
    //       url: '/chats',
    //       badge: '3',
    //       icon: MessagesSquare,
    //     },
    //     {
    //       title: 'Users',
    //       url: '/users',
    //       icon: Users,
    //     },
    //     {
    //       title: 'Secured by Clerk',
    //       icon: ClerkLogo,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/clerk/sign-in',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/clerk/sign-up',
    //         },
    //         {
    //           title: 'User Management',
    //           url: '/clerk/user-management',
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: 'Pages',
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: ShieldCheck,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/sign-in',
    //         },
    //         {
    //           title: 'Sign In (2 Col)',
    //           url: '/sign-in-2',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/sign-up',
    //         },
    //         {
    //           title: 'Forgot Password',
    //           url: '/forgot-password',
    //         },
    //         {
    //           title: 'OTP',
    //           url: '/otp',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Errors',
    //       icon: Bug,
    //       items: [
    //         {
    //           title: 'Unauthorized',
    //           url: '/errors/unauthorized',
    //           icon: Lock,
    //         },
    //         {
    //           title: 'Forbidden',
    //           url: '/errors/forbidden',
    //           icon: UserX,
    //         },
    //         {
    //           title: 'Not Found',
    //           url: '/errors/not-found',
    //           icon: FileX,
    //         },
    //         {
    //           title: 'Internal Server Error',
    //           url: '/errors/internal-server-error',
    //           icon: ServerOff,
    //         },
    //         {
    //           title: 'Maintenance Error',
    //           url: '/errors/maintenance-error',
    //           icon: Construction,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: 'Other',
    //   items: [
    //     {
    //       title: 'Settings',
    //       icon: Settings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: UserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: Wrench,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: Palette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: Bell,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: Monitor,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '/help-center',
    //       icon: HelpCircle,
    //     },
    //   ],
    // },
  ],
}
