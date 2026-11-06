import { useEffect, useMemo } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import type { NavCollapsible, NavItem, NavLink } from './types'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const navigate = useNavigate()
  const accessToken = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  // const userNik = user?.nik ?? '0'
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  useEffect(() => {
    if (!accessToken) {
      toast.error('Sesi Telah Habis, Coba login kembali.')
      navigate({ to: '/sign-in' })
    }
  }, [accessToken, navigate])

  // 🔥 Ambil role yang aktif dari localStorage
  const activeRole = localStorage.getItem('user_role')

  // 🔥 Ambil hanya menu dari rule yang sesuai role aktif
  const userMenuNames = useMemo(() => {
    if (!user?.rules || !activeRole) return []
    const activeRule = user.rules.find((rule) => rule.rule === activeRole)
    return activeRule ? activeRule.menus.map((m) => m.menu) : []
  }, [user, activeRole])

  function filterMenuItems(items: NavItem[], allowedIds: string[]): NavItem[] {
    return items.reduce<NavItem[]>((acc, item) => {
      // untuk collapsible
      let filteredChildren: NavItem[] | undefined = undefined
      if ('items' in item && item.items) {
        filteredChildren = filterMenuItems(item.items, allowedIds)
      }

      // keep item jika id allowed atau ada anak yang tersisa
      if (
        allowedIds.includes(item.id) ||
        (filteredChildren && filteredChildren.length > 0)
      ) {
        if ('items' in item) {
          // collapsible item
          acc.push({ ...item, items: filteredChildren } as NavCollapsible)
        } else {
          // link item
          acc.push(item as NavLink)
        }
      }

      return acc
    }, [])
  }

  // const allowedNikForBerkasLain = ['1218030212870001']

  const filteredNavGroups = useMemo(() => {
    return sidebarData.navGroups
      .map((group) => {
        const filteredItems = filterMenuItems(group.items, userMenuNames)
        return { ...group, items: filteredItems }
      })
      .filter(
        (group) => userMenuNames.includes(group.id) || group.items.length > 0
      )
  }, [userMenuNames])

  // const filteredNavGroups = useMemo(() => {
  //   return sidebarData.navGroups
  //     .map((group) => {
  //       // ⬇️ filter berdasarkan NIK
  //       if (
  //         group.id == 'berkas-lain' &&
  //         !allowedNikForBerkasLain.includes(userNik)
  //       ) {
  //         return null
  //       }

  //       if (
  //         group.items[0].id == 'berkas-lain-menu' &&
  //         !allowedNikForBerkasLain.includes(userNik)
  //       ) {
  //         return null
  //       }

  //       const filteredItems = filterMenuItems(group.items, userMenuNames)
  //       return { ...group, items: filteredItems }
  //     })
  //     .filter(
  //       (group): group is NonNullable<typeof group> =>
  //         !!group &&
  //         (userMenuNames.includes(group.id) || group.items.length > 0)
  //     )
  // }, [userMenuNames, userNik])

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <LayoutProvider>
          <SkipToMain />
          <AppSidebar>
            <SidebarHeader>
              <TeamSwitcher teams={sidebarData.teams} />
            </SidebarHeader>
            <SidebarContent>
              {filteredNavGroups.map((props) => (
                <NavGroup key={props.title} {...props} />
              ))}
            </SidebarContent>
            <SidebarFooter>
              <NavUser userData={user ?? sidebarData.user} />
            </SidebarFooter>
            <SidebarRail />
          </AppSidebar>
          <SidebarInset
            className={cn(
              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-[[data-layout=fixed]]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - 1rem (total margins) to prevent overflow
              // 'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-1rem)]',
              'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]',

              // Set content container, so we can use container queries
              '@container/content'
            )}
          >
            {children ?? <Outlet />}
          </SidebarInset>
        </LayoutProvider>
      </SidebarProvider>
    </SearchProvider>
  )
}
