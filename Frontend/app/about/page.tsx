import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <section className="py-16 px-6 bg-primary border-b-2 border-border">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold brutal-title text-primary-foreground mb-4">
              About PayDrip
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Revolutionizing how salaries are paid, one second at a time.
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="brutal-card p-8 mb-8">
              <h2 className="text-2xl font-bold brutal-title mb-4">The Problem</h2>
              <p className="text-muted-foreground mb-4">
                Traditional payroll is broken. Employees work for weeks before seeing a single penny.
                This creates financial stress and doesn't reflect the continuous value workers provide.
              </p>
              <p className="text-muted-foreground">
                Employers hold capital that's already been earned, while employees live paycheck to paycheck.
              </p>
            </div>

            <div className="brutal-card p-8 mb-8 bg-accent">
              <h2 className="text-2xl font-bold brutal-title mb-4">The Solution</h2>
              <p className="text-accent-foreground mb-4">
                PayDrip streams salaries in real-time using Ethereum smart contracts.
                Every second, employees automatically accrue their earnings.
              </p>
              <p className="text-accent-foreground">
                Withdraw anytime. No waiting. No middlemen. Just continuous, trustless payments.
              </p>
            </div>

            <div className="brutal-card p-8">
              <h2 className="text-2xl font-bold brutal-title mb-6">How It Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center border-2 border-border flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Employer Creates Stream</h3>
                    <p className="text-muted-foreground">Deposit ETH and set the payment duration. The smart contract handles the rest.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center border-2 border-border flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Continuous Accrual</h3>
                    <p className="text-muted-foreground">Every second, the employee's balance increases proportionally.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center border-2 border-border flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Withdraw Anytime</h3>
                    <p className="text-muted-foreground">Employees can withdraw their earned funds whenever they want. No approval needed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
