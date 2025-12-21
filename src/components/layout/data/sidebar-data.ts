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
  LockKeyholeOpenIcon,
  FileSearch,
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
      name: 'SEPEDAMURAH',
      logo: Command,
      plan: 'Sistem Elektronik Perbendaharaan Digital Mudah Ramah dan Humanis',
    },
  ],
  navGroups: [
    {
      id: 'umum',
      title: 'Umum',
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'profile',
          title: 'Profil',
          url: '/profile',
          icon: UserCircle,
        },
      ],
    },
    {
      id: 'data-utama',
      title: 'Data Utama',
      items: [
        {
          id: 'master-data',
          title: 'Master Data',
          icon: Database,
          items: [
            {
              id: 'referensi-urusan',
              title: 'Referensi Urusan',
              url: '/master-data/referensi-urusan',
              icon: ListChecks,
            },
            {
              id: 'referensi-bidang-urusan',
              title: 'Referensi Bidang Urusan',
              url: '/master-data/referensi-bidang-urusan',
              icon: List,
            },
            {
              id: 'referensi-program',
              title: 'Referensi Program',
              url: '/master-data/referensi-program',
              icon: ClipboardList,
            },
            {
              id: 'referensi-kegiatan',
              title: 'Referensi Kegiatan',
              url: '/master-data/referensi-kegiatan',
              icon: ActivitySquare,
            },
            {
              id: 'referensi-subkegiatan',
              title: 'Referensi Sub Kegiatan',
              url: '/master-data/referensi-subkegiatan',
              icon: ListTree,
            },
            {
              id: 'referensi-rekening',
              title: 'Referensi Rekening',
              url: '/master-data/referensi-rekening',
              icon: Banknote,
            },
            {
              id: 'referensi-pagu-belanja',
              title: 'Referensi Pagu Belanja',
              url: '/master-data/referensi-pagu-belanja',
              icon: Wallet,
            },
            {
              id: 'referensi-jenis-spm',
              title: 'Referensi Jenis SPM',
              url: '/master-data/referensi-jenis-spm',
              icon: FileSpreadsheet,
            },
            {
              id: 'referensi-ceklis',
              title: 'Referensi Ceklis Kelengkapan Dokumen PPK-SKPD',
              url: '/master-data/referensi-ceklis-kelengkapan-dokumen-ppk-SKPD',
              icon: ClipboardCheck,
            },
            {
              id: 'referensi-persetujuan',
              title: 'Referensi Persetujuan',
              url: '/master-data/referensi-persetujuan',
              icon: CheckCircle,
            },
            {
              id: 'referensi-jenis-belanja',
              title: 'Referensi Jenis Belanja',
              url: '/master-data/referensi-jenis-belanja',
              icon: CreditCard,
            },
            {
              id: 'referensi-sumber-dana',
              title: 'Referensi Sumber Dana',
              url: '/master-data/referensi-sumber-dana',
              icon: Coins,
            },
            {
              id: 'referensi-skpd',
              title: 'Referensi SKPD',
              url: '/master-data/referensi-SKPD',
              icon: Building2,
            },
            {
              id: 'referensi-dpa',
              title: 'Referensi DPA',
              url: '/master-data/referensi-dpa',
              icon: FileText,
            },
            {
              id: 'referensi-pajak-bendahara',
              title: 'Referensi Pajak Bendahara',
              url: '/master-data/referensi-pajak-bendahara',
              icon: FileText,
            },
            {
              id: 'referensi-asset-bendahara',
              title: 'Referensi Asset Bendahara',
              url: '/master-data/referensi-asset-bendahara',
              icon: FileText,
            },
            {
              id: 'referensi-sp2b-to-bud',
              title: 'Referensi SP2B Ke BUD',
              url: '/master-data/referensi-sp2b-to-bud',
              icon: FileText,
            },
          ],
        },
        {
          id: 'alokasi-dana',
          title: 'Alokasi Dana',
          icon: Banknote,
          items: [
            {
              id: 'pagu-sumber-dana',
              title: 'Pagu Sumber Dana',
              url: '/alokasi-dana/pagu-sumber-dana',
              icon: Wallet,
            },
            {
              id: 'besaran-up-skpd',
              title: 'Besaran UP SKPD',
              url: '/alokasi-dana/besaran-up-skpd',
              icon: Scale,
            },
            {
              id: 'realisasi-tf-sumber-dana',
              title: 'Realisasi Transfer Sumber Dana',
              url: '/alokasi-dana/realisasi-transfer-sumber-dana',
              icon: ArrowRightLeft,
            },
          ],
        },
      ],
    },
    {
      id: 'manajemen-aplikasi',
      title: 'Manajemen Aplikasi',
      items: [
        {
          id: 'user-role',
          title: 'User Role',
          url: '/manajemen-apps/user-role',
          icon: Shield,
        },
        {
          id: 'akses-operator',
          title: 'Akses Operator',
          url: '/manajemen-apps/akses-operator',
          icon: KeyRound,
        },
        {
          id: 'akses-kuasa-bud',
          title: 'Akses Kuasa BUD',
          url: '/manajemen-apps/akses-kuasa-bud',
          icon: LockKeyhole,
        },
        {
          id: 'akses-dpa-skpd',
          title: 'Akses DPA SKPD',
          url: '/manajemen-apps/akses-dpa-skpd',
          icon: LockKeyholeOpenIcon,
        },
        {
          id: 'akses-pajak-bendahara',
          title: 'Akses Pajak Bendahara',
          url: '/manajemen-apps/akses-pajak-bendahara',
          icon: LockKeyholeOpenIcon,
        },
        {
          id: 'akses-asset-bendahara',
          title: 'Akses Asset Bendahara',
          url: '/manajemen-apps/akses-asset-bendahara',
          icon: LockKeyholeOpenIcon,
        },
        {
          id: 'akses-sp2b-ke-bud',
          title: 'Akses SP2B Ke BUD',
          url: '/manajemen-apps/akses-sp2b-ke-bud',
          icon: LockKeyholeOpenIcon,
        },
        {
          id: 'batas-waktu',
          title: 'Batas Waktu',
          url: '/manajemen-apps/batas-waktu',
          icon: AlarmClock,
        },
        {
          id: 'users',
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      id: 'history',
      title: 'History',
      items: [
        {
          id: 'log-tte',
          title: 'Log TTE',
          url: '/history/log-tte',
          icon: History,
        },
        {
          id: 'log-hapus-user',
          title: 'Log Hapus Users',
          url: '/history/log-hapus-users',
          icon: UserX,
        },
      ],
    },
    {
      id: 'dokumen',
      title: 'Dokumen',
      items: [
        {
          id: 'SPD',
          title: 'SPD',
          icon: FileText,
          items: [
            {
              id: 'berkas-masuk-spd',
              title: 'Berkas Masuk',
              url: '/dokumen/spd/berkas-masuk',
              icon: Inbox,
            },
            {
              id: 'permohonan-spd',
              title: 'Permohonan SPD',
              url: '/dokumen/spd/permohonan-spd',
              icon: FilePlus2,
            },
            {
              id: 'permohonan-diterima-spd',
              title: 'Permohonan Diterima',
              url: '/dokumen/spd/permohonan-diterima',
              icon: CheckCircle2,
            },
            {
              id: 'permohonan-ditolak-spd',
              title: 'Permohonan Ditolak',
              url: '/dokumen/spd/permohonan-ditolak',
              icon: XCircle,
            },
            {
              id: 'spd-ditandatangani-bud',
              title: 'SPD Ditandatangani BUD',
              url: '/dokumen/spd/spd-ditandatangani-bud',
              icon: Stamp,
            },
          ],
        },
        {
          id: 'spd-bud-tte',
          title: 'SPD BUD TTE',
          icon: FileSignature,
          items: [
            {
              id: 'permohonan-spd-bud-tte',
              title: 'Permohonan SPD BUD TTE',
              url: '/dokumen/spd/permohonan-spd-bud-tte',
              icon: FileSignature,
            },
            {
              id: 'permohonan-diterima-spd-tte',
              title: 'Permohonan Diterima',
              url: '/dokumen/spd/permohonan-diterima',
              icon: CheckCircle2,
            },
          ],
        },
        {
          id: 'paraf-spd',
          title: 'Paraf SPD',
          icon: PenLine,
          items: [
            {
              id: 'spd-belum-paraf',
              title: 'SPD Belum Paraf',
              url: '/dokumen/spd/belum-paraf',
              icon: FileClock,
            },
            {
              id: 'spd-sudah-paraf',
              title: 'SPD Sudah paraf',
              url: '/dokumen/spd/sudah-paraf',
              icon: FileCheck2,
            },
          ],
        },
        {
          id: 'sp2d',
          title: 'SP2D',
          icon: FileCheck2,
          items: [
            {
              id: 'berkas-masuk-sp2d',
              title: 'Berkas masuk',
              url: '/dokumen/sp2d/berkas-masuk',
              icon: Inbox,
            },
            {
              id: 'permohonan-penerbitan-sp2d',
              title: 'Permohonan Penerbitan SP2D',
              url: '/dokumen/sp2d/permohonan-penerbitan-sp2d',
              icon: FilePlus2,
            },
            {
              id: 'permohonan-diterima-sp2d',
              title: 'Permohonan Diterima',
              url: '/dokumen/sp2d/permohonan-diterima',
              icon: CheckCircle2,
            },
            {
              id: 'permohonan-ditolak-sp2d',
              title: 'Permohonan Ditolak',
              url: '/dokumen/sp2d/permohonan-ditolak',
              icon: XCircle,
            },
            {
              id: 'sp2d-di-publish-bud',
              title: 'SP2D Di Publish Kuasa BUD',
              url: '/dokumen/sp2d/sp2d-di-publish-kuasa-bud',
              icon: Stamp,
            },
            {
              id: 'sp2d-kirim-bank',
              title: 'SP2D Kirim Ke Bank',
              url: '/dokumen/sp2d/sp2d-kirim-ke-bank',
              icon: Send,
            },
          ],
        },
        {
          id: 'sp2d-tte',
          title: 'SP2D TTE',
          icon: FileSignature,
          items: [
            {
              id: 'permohonan-sp2d-tte',
              title: 'Permohonan SP2D TTE',
              url: '/dokumen/sp2d/permohonan-sp2d-tte',
              icon: FileSignature,
            },
            {
              id: 'permohonan-diterima-tte',
              title: 'Permohonan Diterima',
              url: '/dokumen/sp2d/permohonan-diterima',
              icon: CheckCircle2,
            },
            {
              id: 'sp2d-kirim-bank-tte',
              title: 'SP2D Kirim Ke Bank',
              url: '/dokumen/sp2d/sp2d-kirim-ke-bank',
              icon: Send,
            },
            {
              id: 'sp2d-di-publish-bud-tte',
              title: 'SP2D Di Publish Kuasa BUD',
              url: '/dokumen/sp2d/sp2d-di-publish-kuasa-bud',
              icon: Stamp,
            },
          ],
        },
      ],
    },
    {
      id: 'laporan-fungsional',
      title: 'Laporan Fungsional',
      items: [
        {
          id: 'penerimaan',
          title: 'Penerimaan',
          icon: ArrowDownCircle,
          items: [
            {
              id: 'berkas-masuk-penerimaan',
              title: 'Berkas Masuk Penerimaan',
              url: '/dokumen/laporan-fungsional/berkas-masuk-penerimaan',
              icon: UserCog,
            },
            {
              id: 'penerimaan-menu',
              title: 'Penerimaan',
              url: '/dokumen/laporan-fungsional/penerimaan',
              icon: ArrowDownCircle,
            },
            {
              id: 'penerimaan-diterima',
              title: 'Penerimaan - Diterima',
              url: '/dokumen/laporan-fungsional/penerimaan-diterima',
              icon: CheckCircle2,
            },
            {
              id: 'penerimaan-ditolak',
              title: 'Penerimaan - Ditolak',
              url: '/dokumen/laporan-fungsional/penerimaan-ditolak',
              icon: XCircle,
            },
          ],
        },
        {
          id: 'pengeluaran',
          title: 'Pengeluaran',
          icon: ArrowUpCircle,
          items: [
            {
              id: 'berkas-masuk-pengeluaran',
              title: 'Berkas Masuk Pengeluaran',
              url: '/dokumen/laporan-fungsional/berkas-masuk-pengeluaran',
              icon: UserCog,
            },
            {
              id: 'pengeluaran-menu',
              title: 'Pengeluaran',
              url: '/dokumen/laporan-fungsional/pengeluaran',
              icon: ArrowUpCircle,
            },
            {
              id: 'pengeluaran-diterima',
              title: 'Pengeluaran - Diterima',
              url: '/dokumen/laporan-fungsional/pengeluaran-diterima',
              icon: CheckCircle2,
            },
            {
              id: 'pengeluaran-ditolak',
              title: 'Pengeluaran - Ditolak',
              url: '/dokumen/laporan-fungsional/pengeluaran-ditolak',
              icon: XCircle,
            },
          ],
        },
      ],
    },
    {
      id: 'laporan-dpa',
      title: 'Dokumen Pelaksanaan Anggaran',
      items: [
        {
          id: 'laporan-dpa-judul',
          title: 'Laporan DPA',
          icon: FileSpreadsheet, // 🔥 ganti jadi ikon dokumen spreadsheet
          items: [
            {
              id: 'berkas-masuk-laporan-dpa',
              title: 'Berkas Masuk Laporan DPA',
              url: '/dokumen/laporan-dpa/berkas-masuk',
              icon: Inbox, // 🔥 lebih cocok untuk "berkas masuk"
            },
            {
              id: 'laporan-dpa-menu',
              title: 'Laporan DPA',
              url: '/dokumen/laporan-dpa/laporan-dpa',
              icon: FileSearch, // 🔍 laporan / detail dokumen
            },
            {
              id: 'laporan-dpa-diterima',
              title: 'Laporan DPA - Diterima',
              url: '/dokumen/laporan-dpa/laporan-dpa-diterima',
              icon: CheckCircle2, // ✔️ sudah cocok
            },
            {
              id: 'laporan-dpa-ditolak',
              title: 'Laporan DPA - Ditolak',
              url: '/dokumen/laporan-dpa/laporan-dpa-ditolak',
              icon: XCircle, // ❌ sudah cocok
            },
          ],
        },
        {
          id: 'laporan-pajak-bendahara-judul',
          title: 'Pajak Bendahara',
          icon: FileSpreadsheet, // 🔥 ganti jadi ikon dokumen spreadsheet
          items: [
            {
              id: 'berkas-masuk-laporan-pajak-bendahara',
              title: 'Berkas Masuk Laporan Pajak Bendahara',
              url: '/dokumen/laporan-pajak-bendahara/berkas-masuk',
              icon: Inbox, // 🔥 lebih cocok untuk "berkas masuk"
            },
            {
              id: 'laporan-pajak-bendahara-menu',
              title: 'Laporan Pajak Bendahara',
              url: '/dokumen/laporan-pajak-bendahara/laporan-pajak-bendahara',
              icon: FileSearch, // 🔍 laporan / detail dokumen
            },
            {
              id: 'laporan-pajak-bendahara-diterima',
              title: 'Laporan Pajak Bendahara - Diterima',
              url: '/dokumen/laporan-pajak-bendahara/laporan-pajak-bendahara-diterima',
              icon: CheckCircle2, // ✔️ sudah cocok
            },
            {
              id: 'laporan-pajak-bendahara-ditolak',
              title: 'Laporan Pajak Bendahara - Ditolak',
              url: '/dokumen/laporan-pajak-bendahara/laporan-pajak-bendahara-ditolak',
              icon: XCircle, // ❌ sudah cocok
            },
          ],
        },
        {
          id: 'laporan-asset-bendahara-judul',
          title: 'Asset Bendahara',
          icon: FileSpreadsheet, // 🔥 ganti jadi ikon dokumen spreadsheet
          items: [
            {
              id: 'berkas-masuk-laporan-asset-bendahara',
              title: 'Berkas Masuk Laporan Asset Bendahara',
              url: '/dokumen/laporan-asset-bendahara/berkas-masuk',
              icon: Inbox, // 🔥 lebih cocok untuk "berkas masuk"
            },
            {
              id: 'laporan-asset-bendahara-menu',
              title: 'Laporan Asset Bendahara',
              url: '/dokumen/laporan-asset-bendahara/laporan-asset-bendahara',
              icon: FileSearch, // 🔍 laporan / detail dokumen
            },
            {
              id: 'laporan-asset-bendahara-diterima',
              title: 'Laporan Asset Bendahara - Diterima',
              url: '/dokumen/laporan-asset-bendahara/laporan-asset-bendahara-diterima',
              icon: CheckCircle2, // ✔️ sudah cocok
            },
            {
              id: 'laporan-asset-bendahara-ditolak',
              title: 'Laporan Asset Bendahara - Ditolak',
              url: '/dokumen/laporan-asset-bendahara/laporan-asset-bendahara-ditolak',
              icon: XCircle, // ❌ sudah cocok
            },
          ],
        },
        {
          id: 'laporan-sp2b-ke-bud-judul',
          title: 'Laporan SP2B Ke BUD',
          icon: FileSpreadsheet, // 🔥 ganti jadi ikon dokumen spreadsheet
          items: [
            {
              id: 'berkas-masuk-laporan-sp2b-ke-bud',
              title: 'Berkas Masuk Laporan SP2B Ke BUD',
              url: '/dokumen/laporan-sp2b-ke-bud/berkas-masuk',
              icon: Inbox, // 🔥 lebih cocok untuk "berkas masuk"
            },
            {
              id: 'laporan-sp2b-ke-bud-menu',
              title: 'Laporan SP2B Ke BUD',
              url: '/dokumen/laporan-sp2b-ke-bud/laporan-sp2b-ke-bud',
              icon: FileSearch, // 🔍 laporan / detail dokumen
            },
            {
              id: 'laporan-sp2b-ke-bud-diterima',
              title: 'Laporan SP2B Ke BUD - Diterima',
              url: '/dokumen/laporan-sp2b-ke-bud/laporan-sp2b-ke-bud-diterima',
              icon: CheckCircle2, // ✔️ sudah cocok
            },
            {
              id: 'laporan-sp2b-ke-bud-ditolak',
              title: 'Laporan SP2B Ke BUD - Ditolak',
              url: '/dokumen/laporan-sp2b-ke-bud/laporan-sp2b-ke-bud-ditolak',
              icon: XCircle, // ❌ sudah cocok
            },
          ],
        },
      ],
    },

    {
      id: 'berkas-lain',
      title: 'Berkas TTE Lain-lain',
      items: [
        {
          id: 'berkas-lain-menu',
          title: 'Berkas Lain',
          url: '/dokumen/berkas-lain',
          icon: FolderOpen,
        },
      ],
    },
    {
      id: 'pengembalian',
      title: 'Pengembalian',
      items: [
        {
          id: 'pengembalian-menu',
          title: 'Pengembalian',
          url: '/pengembalian',
          icon: RotateCcw,
        },
      ],
    },
    {
      id: 'laporan',
      title: 'Laporan',
      items: [
        {
          id: 'buku-laporan',
          title: 'Laporan Pembukuan',
          url: '/laporan/buku-laporan',
          icon: BookOpen,
        },
        {
          id: 'laporan-realisasi-sumber-dana',
          title: 'Laporan Realisasi Sumber Dana',
          url: '/laporan/realisasi-sumber-dana',
          icon: BarChart3,
        },
        {
          id: 'laporan-daftar-belanja-skpd',
          title: 'Laporan Daftar Belanja per SKPD',
          url: '/laporan/daftar-belanja-per-skpd',
          icon: FileBarChart,
        },
        {
          id: 'laporan-realisasi-belanja',
          title: 'Laporan Realisasi Belanja',
          url: '/laporan/realisasi-belanja',
          icon: PieChart,
        },
      ],
    },
  ],
}
