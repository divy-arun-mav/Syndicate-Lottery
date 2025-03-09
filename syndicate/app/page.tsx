"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ConnectWallet from "@/components/Web3/ConnectWallet";
import { ArrowRight, Award, CheckCircle, Coins, Gift, Ticket, Trophy, Users } from "lucide-react";
  
export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b custom-header">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Syndicate</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
                How It Works
              </Link>
              <Link href="#faq" className="text-sm font-medium hover:text-primary">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ConnectWallet />
              </Button>
              <Button onClick={() => router.push("/dashboard")} size="lg" className="gap-1">
                Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Decentralized Lotteries with Guaranteed Fairness
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Create and participate in transparent blockchain lotteries with partial matching rewards and creator
                      incentives.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button onClick={() => router.push("/joinlot")} size="lg" className="gap-1">
                      Start Playing <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => router.push("/createlot")} size="lg" variant="outline">
                      Create a Lottery
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,223,0,0.5),rgba(255,165,0,0.2))] blur-3xl"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      <Image
                        src="/slotmachine.jpg"
                        alt="Slot Machine"
                        width={500}
                        height={500}
                        className="object-contain filter drop-shadow-[0_0_15px_rgba(255,223,0,0.8)] transition-transform duration-300 ease-in-out hover:scale-110"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    Features
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-[#ffd700]">Why Choose Syndicate?</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-[#ffd700]">
                    Our decentralized lottery platform offers unique features designed for fairness and excitement.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-[#ffd700]">Partial Matching Rewards</h3>
                  <p className="text-center text-muted-foreground text-[#ffd700]">
                    Get 4% of the pool for 4-digit matches and 2% for 3-digit matches, increasing your chances of winning.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Coins className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-[#ffd700]">Creator Incentives</h3>
                  <p className="text-center  text-[#ffd700]">
                    Lottery creators earn 5% of the total pool, encouraging more exciting lotteries for everyone.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-[#ffd700]">Guaranteed Fairness</h3>
                  <p className="text-center text-muted-foreground text-[#ffd700]">
                    Smart contracts ensure transparent selection of winners with no possibility of manipulation.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-[#ffd700]">Minimum Participation</h3>
                  <p className="text-center text-muted-foreground text-[#ffd700]">
                    If minimum participation isn't met, all funds are returned, ensuring fair play for everyone.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-[#ffd700]">Customizable Lotteries</h3>
                  <p className="text-center text-muted-foreground text-[#ffd700]">
                    Create lotteries with custom prize pools, durations, and participant limits.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Ticket className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-[#ffd700]">Detailed History</h3>
                  <p className="text-center text-muted-foreground text-[#ffd700]">
                    Track your participation, profits, losses, and created lotteries in one dashboard.
                  </p>
                </div>
              </div>
            </div>
          </section>
  
          <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    Process
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How Syndicate Works</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                    Our platform makes creating and participating in lotteries simple and transparent.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
                <div className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    1
                  </div>
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    width={100}
                    height={100}
                    alt="Create a lottery"
                    className="rounded-lg"
                  />
                  <h3 className="text-xl font-bold text-[#ffd700]">Create or Join</h3>
                  <p className="text-center text-muted-foreground">
                    Create your own lottery with custom parameters or join existing ones with your preferred tickets.
                  </p>
                </div>
                <div className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    2
                  </div>
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    width={100}
                    height={100}
                    alt="Wait for completion"
                    className="rounded-lg"
                  />
                  <h3 className="text-xl font-bold text-[#ffd700]">Wait for Completion</h3>
                  <p className="text-center text-muted-foreground">
                    Lotteries run until their time limit or maximum participation is reached, with transparent tracking.
                  </p>
                </div>
                <div className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    3
                  </div>
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    width={100}
                    height={100}
                    alt="Collect rewards"
                    className="rounded-lg"
                  />
                  <h3 className="text-xl font-bold text-[#ffd700]">Collect Rewards</h3>
                  <p className="text-center text-muted-foreground">
                    Winners automatically receive their rewards, with partial matches also earning a percentage of the
                    pool.
                  </p>
                </div>
              </div>
            </div>
          </section>
  
          <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Try Your Luck?</h2>
                    <p className="md:text-xl/relaxed">
                      Join thousands of players already participating in Syndicate lotteries and creating their own prize
                      pools.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button size="lg" onClick={() => router.push("/joinlot")} variant="secondary" className="gap-1">
                      Fortune wheel<ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-primary-foreground/10 p-4 text-center">
                    <div className="text-3xl font-bold">$10M+</div>
                    <div className="text-sm font-medium">Total Prize Money</div>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-primary-foreground/10 p-4 text-center">
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm font-medium">Active Users</div>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-primary-foreground/10 p-4 text-center">
                    <div className="text-3xl font-bold">1,000+</div>
                    <div className="text-sm font-medium">Active Lotteries</div>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-primary-foreground/10 p-4 text-center">
                    <div className="text-3xl font-bold">5,000+</div>
                    <div className="text-sm font-medium">Winners</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">FAQ</div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                    Everything you need to know about Syndicate.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2">
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-[#ffd700]">How are winners selected?</h3>
                  <p className="mt-2 text-muted-foreground">
                    Winners are selected using a transparent random function on the blockchain that cannot be manipulated,
                    ensuring fair selection.
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-[#ffd700]">What happens if minimum participation isn't met?</h3>
                  <p className="mt-2 text-muted-foreground">
                    If the minimum number of participants isn't reached, all funds are returned to ticket purchasers and
                    the lottery creation fee is returned to the creator.
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-[#ffd700]">How do partial matches work?</h3>
                  <p className="mt-2 text-muted-foreground">
                    If your ticket has 4 matching digits, you receive 4% of the pool. If it has 3 matching digits, you
                    receive 2% of the pool, even if you're not the main winner.
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-[#ffd700]">How much does it cost to create a lottery?</h3>
                  <p className="mt-2 text-muted-foreground">
                    There is a small fee to create a lottery, but creators earn 5% of the total pool amount, making it
                    potentially profitable to create popular lotteries.
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-[#ffd700]">Can I track my lottery history?</h3>
                  <p className="mt-2 text-muted-foreground">
                    Yes, you can view all lotteries you've participated in, created, your profits, losses, and more
                    through your user dashboard.
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-[#ffd700]">Is Syndicate secure?</h3>
                  <p className="mt-2 text-muted-foreground">
                    Yes, all lottery operations run on secure smart contracts that have been audited for security and
                    fairness, with all transactions recorded on the blockchain.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full border-t custom-footer py-6 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Ticket className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">Syndicate</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  A decentralized lottery platform with fairness and transparency at its core.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider">Platform</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      Smart Contracts
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      Security Audits
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      Twitter
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      Discord
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm hover:text-primary">
                      GitHub
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Syndicate. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      <style jsx>{`
        /* Overall Layout */
        .container {
          font-family: "Roboto", sans-serif;
        }
        /* Global Page Background */
        .flex.min-h-screen {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #f5f5f5;
        }
        /* Header Styling */
        .custom-header {
          background: rgba(20, 20, 40, 0.95);
          backdrop-filter: blur(5px);
          border-color: #2c3e50;
        }
        header span {
          font-family: "Montserrat", sans-serif;
          color: #ffd700;
        }
        nav a {
          font-family: "Roboto", sans-serif;
          color: #f5f5f5;
        }
        nav a:hover {
          color: #ffd700;
        }
        /* Button Overrides */
        .btn, button {
          font-family: "Roboto", sans-serif;
        }
        /* Hero Section */
        h1 {
          font-family: "Montserrat", sans-serif;
          color: #ffd700;
        }
        p.text-muted-foreground {
          color: #ccc;
        }
        /* Features Section */
        #features h2 {
          font-family: "Montserrat", sans-serif;
          color: #ffd700;
        }
        #features p {
          font-family: "Roboto", sans-serif;
          color: #ccc;
        }
        /* How It Works Section */
        #how-it-works h2 {
          font-family: "Montserrat", sans-serif;
          color: #ffd700;
        }
        #how-it-works p {
          font-family: "Roboto", sans-serif;
          color: #ccc;
        }
        /* FAQ Section */
        #faq h2 {
          font-family: "Montserrat", sans-serif;
          color: #ffd700;
        }
        #faq p {
          font-family: "Roboto", sans-serif;
          color: #ccc;
        }
        /* Footer Styling */
        .custom-footer {
          background: #141414;
          border-color: #2c3e50;
        }
        footer h4 {
          font-family: "Montserrat", sans-serif;
          color: #ffd700;
        }
        footer a {
          font-family: "Roboto", sans-serif;
          color: #f5f5f5;
        }
        footer a:hover {
          color: #ffd700;
        }
      `}</style>
    </>
  );
}
