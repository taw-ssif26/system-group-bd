'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Newspaper, FolderOpen, Building2, Users,
  Image, Briefcase, UserCheck, MessageSquare, MapPin,
  Settings, Shield, LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const nav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { section: 'Content' },
  { label: 'News', href: '/admin/news', icon: Newspaper },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Businesses', href: '/admin/businesses', icon: Building2 },
  { label: 'Leadership', href: '/admin/leadership', icon: Users },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { section: 'Operations' },
  { label: 'Careers', href: '/admin/careers', icon: Briefcase },
  { label: 'Applications', href: '/admin/applications', icon: UserCheck },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Outlets', href: '/admin/outlets', icon: MapPin },
  { section: 'System' },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Audit Logs', href: '/admin/audit', icon: Shield },
]

interface Props {
  user: { name?: string | null; email?: string | null; role?: string }
}

export default function AdminSidebar({ user }: Props) {
  const path = usePathname()

  return (
    <aside className="w-60 bg-[#111111] border-r border-[#222] flex flex-col shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#222]">
        <div className="text-white text-sm font-medium tracking-wide">System Group</div>
        <div className="text-[#666] text-xs mt-0.5">Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {nav.map((item, i) => {
          if ('section' in item) {
            return (
              <div key={i} className="px-2 pt-5 pb-1.5">
                <span className="text-[#444] text-[10px] tracking-[0.2em] uppercase">{item.section}</span>
              </div>
            )
          }
          const Icon = item.icon!
          const active = path === item.href || (item.href !== '/admin' && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href!}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm mb-0.5 transition-colors ${
                active ? 'bg-[#1A1A1A] text-white' : 'text-[#888] hover:text-white hover:bg-[#161616]'
              }`}
            >
              <Icon size={15} className={active ? 'text-[#C9A84C]' : ''} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-[#222]">
        <div className="text-white text-sm font-medium truncate">{user.name}</div>
        <div className="text-[#555] text-xs truncate">{user.email}</div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 mt-3 text-[#666] hover:text-red-400 text-xs transition-colors"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
