'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Nav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50 bg-background border-b-3 border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-primary border-3 border-border flex items-center justify-center shadow-[3px_3px_0_var(--border)] group-hover:shadow-[5px_5px_0_var(--border)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all">
            <span className="text-primary-foreground font-bold text-2xl">💧</span>
          </div>
          <span className="text-2xl font-bold brutal-title tracking-tight">PayDrip</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className={`brutal-link uppercase tracking-wider text-sm py-2 ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`brutal-link uppercase tracking-wider text-sm py-2 ${isActive('/about') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            About
          </Link>
          <Link
            href="/dashboard/employer"
            className={`brutal-link uppercase tracking-wider text-sm py-2 ${isActive('/dashboard/employer') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Employers
          </Link>
          <Link
            href="/dashboard/employee"
            className={`brutal-link uppercase tracking-wider text-sm py-2 ${isActive('/dashboard/employee') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Employees
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard/employer">
            <Button size="default" className="px-6">
              Launch App
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <button
            className="p-3 border-3 border-border bg-card shadow-[3px_3px_0_var(--border)] hover:shadow-[5px_5px_0_var(--border)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t-3 border-border bg-card">
          <div className="px-6 py-6 space-y-4">
            <Link
              href="/"
              className={`block font-bold uppercase tracking-wider py-2 ${isActive('/') ? 'text-primary' : 'text-foreground'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block font-bold uppercase tracking-wider py-2 ${isActive('/about') ? 'text-primary' : 'text-foreground'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/dashboard/employer"
              className={`block font-bold uppercase tracking-wider py-2 ${isActive('/dashboard/employer') ? 'text-primary' : 'text-foreground'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Employers
            </Link>
            <Link
              href="/dashboard/employee"
              className={`block font-bold uppercase tracking-wider py-2 ${isActive('/dashboard/employee') ? 'text-primary' : 'text-foreground'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Employees
            </Link>
            <div className="pt-4">
              <Link href="/dashboard/employer" className="block">
                <Button className="w-full">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
