import Link from 'next/link'
import { Github, Twitter, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t-3 border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-16 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary border-3 border-background flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">💧</span>
              </div>
              <span className="text-2xl font-bold brutal-title tracking-tight text-background">PayDrip</span>
            </div>
            <p className="text-background/70 max-w-sm mb-8 leading-relaxed">
              The future of payroll is continuous. Stream salaries in real-time using Ethereum smart contracts.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-background text-foreground flex items-center justify-center border-3 border-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 bg-background text-foreground flex items-center justify-center border-3 border-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 bg-background text-foreground flex items-center justify-center border-3 border-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold brutal-title text-sm mb-6 text-background">Product</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-background/70 hover:text-background transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-background/70 hover:text-background transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/dashboard/employer" className="text-background/70 hover:text-background transition-colors">
                  For Employers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/employee" className="text-background/70 hover:text-background transition-colors">
                  For Employees
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold brutal-title text-sm mb-6 text-background">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors">
                  Smart Contracts
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-background transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold brutal-title text-sm mb-6 text-background">Stay Updated</h4>
            <p className="text-background/70 mb-4 text-sm">Get the latest updates on PayDrip.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 bg-background text-foreground border-3 border-background text-sm"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground font-bold uppercase text-sm border-3 border-background hover:bg-accent transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2024 PayDrip. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-background/50 hover:text-background transition-colors">Privacy</a>
            <a href="#" className="text-background/50 hover:text-background transition-colors">Terms</a>
            <a href="#" className="text-background/50 hover:text-background transition-colors">Cookies</a>
          </div>
          <div className="brutal-tag bg-accent text-accent-foreground text-xs">
            Built on Ethereum
          </div>
        </div>
      </div>
    </footer>
  )
}
