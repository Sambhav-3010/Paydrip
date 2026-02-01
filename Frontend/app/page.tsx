import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Clock, TrendingUp, Users, Wallet, CheckCircle2 } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.03]" />

          <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 brutal-tag mb-8">
                  <span className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse" />
                  Live on Ethereum Mainnet
                </div>

                <h1 className="text-5xl md:text-7xl font-bold brutal-title leading-[0.9] mb-8">
                  <span className="block">Salary</span>
                  <span className="block">Streaming</span>
                  <span className="block mt-2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 inline-block">Protocol</span>
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                  Pay your team continuously. Every second. Not every two weeks.
                  Powered by Ethereum smart contracts.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/dashboard/employer">
                    <Button size="lg" className="text-lg px-8 py-6">
                      Start Streaming <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="brutal-card p-8 bg-primary rotate-3 absolute -right-4 -top-4 w-full h-full" />
                <div className="brutal-card p-8 bg-card relative z-10">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-border">
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live Stream</span>
                    <span className="brutal-tag text-xs">Active</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Recipient</p>
                      <p className="font-bold text-lg">Alice Johnson</p>
                      <p className="text-xs text-muted-foreground brutal-mono">0x742d...E0bb</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Streamed</p>
                        <p className="brutal-stat text-primary">2.847</p>
                        <p className="text-sm text-muted-foreground">ETH</p>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Rate</p>
                        <p className="brutal-stat">0.023</p>
                        <p className="text-sm text-muted-foreground">ETH/day</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="h-3 bg-secondary border-2 border-border">
                        <div className="h-full bg-accent w-[68%]" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">68% streamed • 32 days remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y-2 border-border bg-secondary">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '$2.4M+', label: 'Total Streamed' },
              { value: '1,200+', label: 'Active Streams' },
              { value: '340+', label: 'Companies' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className={`p-8 md:p-12 text-center ${i < 3 ? 'border-r-2 border-border' : ''}`}>
                <p className="brutal-stat text-3xl md:text-4xl mb-2">{stat.value}</p>
                <p className="text-sm uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold brutal-title mb-4">
                Why PayDrip?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The future of payroll is continuous. Heres why companies are making the switch.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Real-Time Pay',
                  description: 'Employees earn every second. No more waiting 2 weeks for payday.',
                  color: 'bg-accent',
                },
                {
                  icon: Shield,
                  title: 'Trustless',
                  description: 'Smart contracts guarantee payments. No intermediaries needed.',
                  color: 'bg-primary',
                  textColor: 'text-primary-foreground',
                },
                {
                  icon: Clock,
                  title: 'Flexible Control',
                  description: 'Pause, resume, or cancel streams anytime. Full employer control.',
                  color: 'bg-chart-3',
                },
                {
                  icon: TrendingUp,
                  title: 'Better Cash Flow',
                  description: 'Employees can withdraw what theyve earned, improving financial health.',
                  color: 'bg-chart-4',
                  textColor: 'text-primary-foreground',
                },
                {
                  icon: Users,
                  title: 'Team Management',
                  description: 'Manage all your salary streams from a single dashboard.',
                  color: 'bg-chart-5',
                  textColor: 'text-primary-foreground',
                },
                {
                  icon: Wallet,
                  title: 'Low Fees',
                  description: 'Minimal gas costs. Stream to unlimited employees efficiently.',
                  color: 'bg-secondary',
                },
              ].map((feature, i) => (
                <div key={i} className="brutal-card p-8 flex flex-col">
                  <div className={`w-16 h-16 ${feature.color} ${feature.textColor || ''} border-2 border-border flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold brutal-title mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 px-6 bg-foreground text-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold brutal-title mb-8">
                  How It Works
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      step: '01',
                      title: 'Connect Wallet',
                      description: 'Connect your Ethereum wallet to get started. We support MetaMask, WalletConnect, and more.',
                    },
                    {
                      step: '02',
                      title: 'Create Stream',
                      description: 'Set the recipient, amount, and duration. Deposit ETH to fund the stream.',
                    },
                    {
                      step: '03',
                      title: 'Automatic Streaming',
                      description: 'The smart contract streams funds every second. No manual intervention needed.',
                    },
                    {
                      step: '04',
                      title: 'Withdraw Anytime',
                      description: 'Employees can withdraw their earned funds whenever they want. No approval required.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-16 h-16 bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center flex-shrink-0 border-2 border-background">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-background/70">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="brutal-card p-6 bg-card text-card-foreground">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    <div>
                      <p className="font-bold">Stream Created</p>
                      <p className="text-sm text-muted-foreground">10 ETH → alice.eth over 365 days</p>
                    </div>
                    <span className="ml-auto text-sm text-muted-foreground brutal-mono">2 min ago</span>
                  </div>
                </div>
                <div className="brutal-card p-6 bg-card text-card-foreground">
                  <div className="flex items-center gap-4">
                    <Wallet className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-bold">Withdrawal</p>
                      <p className="text-sm text-muted-foreground">0.5 ETH claimed by bob.eth</p>
                    </div>
                    <span className="ml-auto text-sm text-muted-foreground brutal-mono">5 min ago</span>
                  </div>
                </div>
                <div className="brutal-card p-6 bg-card text-card-foreground">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-6 h-6 text-chart-4" />
                    <div>
                      <p className="font-bold">Stream Updated</p>
                      <p className="text-sm text-muted-foreground">Rate increased to 0.05 ETH/day</p>
                    </div>
                    <span className="ml-auto text-sm text-muted-foreground brutal-mono">12 min ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold brutal-title mb-6">
              Ready to Transform Your Payroll?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join hundreds of companies already using PayDrip. Set up your first stream in under 5 minutes.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <Link href="/dashboard/employer">
                <Button size="lg" className="text-lg px-10 py-7">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/dashboard/employee">
                <Button size="lg" variant="outline" className="text-lg px-10 py-7">
                  View as Employee
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-8">
              No credit card required • Free to create streams • Only pay gas fees
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
