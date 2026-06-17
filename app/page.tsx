'use client';

import Link from 'next/link';
import { Sparkles, Sun, Command, Zap, ArrowRight, CheckCircle2, Code, CircleDot, Triangle, Square, Hexagon, CommandIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight scroll-reveal hook — no external animation library needed.
 * Adds a class once the element enters the viewport, then leaves it alone.
 */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      {/* 1. Sticky Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-bold tracking-tight text-[15px]">Meridian</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Features</Link>
            <Link href="#agent" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Agent</Link>
            <Link href="#pricing" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Pricing</Link>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/login" className="hidden md:block text-[13px] font-medium text-zinc-500 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm transition-colors duration-200">
              Sign In
            </Link>
            <Link
              href={user ? "/agent" : "/login"}
              className="px-4 py-2.5 rounded-full bg-zinc-900 text-white text-[13px] font-medium tracking-tight hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(59,111,224,0.35)]"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center w-full pt-32 pb-16">

        {/* 2. Hero Section */}
        <section className="flex flex-col items-center text-center max-w-5xl mx-auto px-6 w-full mt-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05] mb-8">
              Find your <span className="relative inline-block font-['var(--font-syne-mono)'] text-blue-600 font-normal">
                flow.
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-blue-500 overflow-visible opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,25 100,0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="150" strokeDashoffset="150" style={{ animation: 'meridian-draw 0.8s ease-out 0.6s forwards' }} />
                </svg>
              </span> <br className="hidden md:block" />
              <span className="text-zinc-400">Let <span className="relative inline-block font-['var(--font-syne-mono)'] text-blue-600 font-normal">
                AI
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-blue-500 overflow-visible opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="150" strokeDashoffset="150" style={{ animation: 'meridian-draw 0.8s ease-out 1.2s forwards' }} />
                </svg>
              </span> handle the rest.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl leading-relaxed tracking-tight mx-auto">
              Triage emails, schedule meetings, and clear your inbox at the speed of thought using natural language.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
              <Link
                href={user ? "/agent" : "/login"}
                className="group flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 text-white text-[15px] font-medium tracking-tight hover:bg-blue-600 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-[0_0_30px_rgba(59,111,224,0.4)] w-full sm:w-auto justify-center"
              >
                Try Interactive Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-900 border border-zinc-200 text-[15px] font-medium tracking-tight hover:bg-zinc-50 hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 transition-all duration-300 shadow-sm w-full sm:w-auto justify-center"
              >
                <Code className="w-4 h-4" />
                View GitHub
              </a>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Breathing ambient glow — replaces the static blur with a slow pulse */}
            <div
              className="absolute -inset-1 rounded-[2rem] bg-gradient-to-b from-blue-100 to-transparent opacity-50 blur-2xl"
              style={{ animation: 'meridian-breathe 6s ease-in-out infinite' }}
            />

            <div className="relative w-full rounded-2xl border border-zinc-200/60 bg-white shadow-2xl overflow-hidden flex flex-col text-left">
              <div className="h-12 border-b border-zinc-100 bg-zinc-50/50 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
              </div>
              <div className="p-8 flex flex-col gap-6 bg-zinc-50/30">
                <div
                  className="self-end max-w-[85%] md:max-w-[70%] bg-zinc-100 rounded-2xl rounded-tr-sm px-5 py-4 text-[15px] text-zinc-800 shadow-sm border border-zinc-200/50"
                  style={{ animation: 'meridian-rise 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}
                >
                  Cancel my 3pm meeting and draft a polite email to Sarah letting her know I need to reschedule.
                </div>
                <div
                  className="self-start max-w-[90%] md:max-w-[80%] flex items-start gap-4"
                  style={{ animation: 'meridian-rise 0.6s cubic-bezier(0.22,1,0.36,1) 0.9s both' }}
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 shadow-sm relative">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white" style={{ animation: 'meridian-ping 2s ease-out infinite' }} />
                  </div>
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[13px] font-bold text-zinc-900 bg-white border border-zinc-200 shadow-sm px-3 py-1 rounded-md flex items-center gap-1.5"
                        style={{ animation: 'meridian-pop 0.45s cubic-bezier(0.22,1,0.36,1) 1.3s both' }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Event Deleted
                      </span>
                      <span
                        className="text-[13px] font-bold text-zinc-900 bg-white border border-zinc-200 shadow-sm px-3 py-1 rounded-md flex items-center gap-1.5"
                        style={{ animation: 'meridian-pop 0.45s cubic-bezier(0.22,1,0.36,1) 1.55s both' }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Email Drafted
                      </span>
                    </div>
                    <div
                      className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 text-[15px] text-zinc-800 shadow-sm border border-zinc-200/60 leading-relaxed"
                      style={{ animation: 'meridian-rise 0.6s cubic-bezier(0.22,1,0.36,1) 1.8s both' }}
                    >
                      Done. I've removed the 3 PM meeting from your calendar and prepared a draft to Sarah. You can review it in your outbox. What's next?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Social Proof */}
        <Reveal className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center border-b border-zinc-100">
          <p className="text-[13px] font-semibold text-zinc-500 uppercase tracking-widest mb-8 text-center">
            Trusted by founders and engineers at top companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300"><CircleDot className="w-8 h-8" /><span className="text-xl font-bold tracking-tighter">Acme</span></div>
            <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300"><Triangle className="w-8 h-8" /><span className="text-xl font-bold tracking-tighter">Apex</span></div>
            <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300"><Square className="w-8 h-8" /><span className="text-xl font-bold tracking-tighter">Block</span></div>
            <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300"><Hexagon className="w-8 h-8" /><span className="text-xl font-bold tracking-tighter">Hexa</span></div>
          </div>
        </Reveal>

        {/* 4. Bento Box Feature Grid */}
        <section id="features" className="w-full max-w-6xl mx-auto px-6 py-24 md:py-32">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Everything you need to reach inbox zero.</h2>
            <p className="text-lg text-zinc-500 tracking-tight">Powerful abstractions that get out of your way.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Wide */}
            <Reveal delay={0} className="md:col-span-2">
              <div className="group relative overflow-hidden bg-white border border-zinc-200/60 rounded-[2rem] p-10 md:p-12 hover:shadow-xl hover:shadow-blue-100/40 hover:border-blue-200/60 transition-all duration-500 h-full">
                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center mb-8 group-hover:scale-105 group-hover:border-blue-200 transition-all duration-500">
                  <Sun className="w-7 h-7 text-zinc-900 group-hover:text-blue-600 transition-colors duration-500" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-3">The Morning Digest</h3>
                <p className="text-zinc-500 text-[16px] leading-relaxed max-w-md">
                  Wake up to an AI-generated synthesis of what actually matters. We extract the signal from the noise before you even open your laptop.
                </p>
              </div>
            </Reveal>

            {/* Card 2: Square */}
            <Reveal delay={120} className="md:col-span-1">
              <div className="group relative overflow-hidden bg-white border border-zinc-200/60 rounded-[2rem] p-10 md:p-12 hover:shadow-xl hover:shadow-blue-100/40 hover:border-blue-200/60 transition-all duration-500 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center mb-8 group-hover:scale-105 group-hover:border-blue-200 transition-all duration-500">
                    <CommandIcon className="w-7 h-7 text-zinc-900 group-hover:text-blue-600 transition-colors duration-500" />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-3">Keyboard Centric</h3>
                  <p className="text-zinc-500 text-[16px] leading-relaxed">
                    Keep your hands on the keys. Navigate everything in milliseconds without touching a mouse.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 3: Full Width */}
            <Reveal delay={240} className="md:col-span-3">
              <div className="group relative overflow-hidden bg-white border border-zinc-200/60 rounded-[2rem] p-10 md:p-12 hover:shadow-xl hover:shadow-blue-100/40 hover:border-blue-200/60 transition-all duration-500 flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-blue-200 transition-all duration-500">
                  <Zap className="w-7 h-7 text-zinc-900 group-hover:text-blue-600 transition-colors duration-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight mb-3">Corsair MCP Integration</h3>
                  <p className="text-zinc-500 text-[16px] leading-relaxed max-w-3xl">
                    A true agent that actually executes. Meridian seamlessly connects to your Google Workspace to send emails, draft replies, and schedule Meets autonomously.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 5. Deep Dive: The Agent (Zig-Zag) */}
        <section id="agent" className="w-full bg-zinc-50 py-24 md:py-32 border-y border-zinc-200/60">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <Reveal className="order-2 md:order-1 relative">
              <div className="w-full aspect-square md:aspect-[4/3] bg-white rounded-[2rem] shadow-2xl shadow-blue-100/40 border border-zinc-200/60 p-8 flex flex-col justify-center relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"
                  style={{ animation: 'meridian-breathe 7s ease-in-out infinite' }}
                />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="self-end bg-zinc-100 rounded-2xl rounded-tr-sm px-5 py-3 text-[14px] text-zinc-800 shadow-sm border border-zinc-200/50 w-3/4">
                    Schedule a sync with the design team for tomorrow at 10am.
                  </div>
                  <div className="self-start w-3/4 flex flex-col gap-2">
                    <span className="text-[12px] font-bold text-zinc-900 bg-white border border-zinc-200 shadow-sm px-3 py-1.5 rounded-md flex items-center gap-2 self-start">
                      <Zap className="w-3.5 h-3.5 text-blue-600" style={{ animation: 'meridian-flicker 1.6s ease-in-out infinite' }} /> Fetching Calendar
                    </span>
                    <span className="text-[12px] font-bold text-zinc-900 bg-white border border-zinc-200 shadow-sm px-3 py-1.5 rounded-md flex items-center gap-2 self-start">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Event Created: Design Sync
                    </span>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 text-[14px] text-zinc-800 shadow-sm border border-zinc-200/60 mt-1">
                      I've scheduled the Design Sync for tomorrow at 10 AM and included a Google Meet link.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150} className="order-1 md:order-2 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Your inbox, fully autonomous.</h2>
              <p className="text-lg text-zinc-500 leading-relaxed mb-8">
                Meridian doesn't just draft emails. It leverages Model Context Protocol (MCP) via Corsair to actively manage your calendar, fetch context from previous threads, and send emails on your behalf.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-zinc-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Generates and attaches Google Meet links.
                </li>
                <li className="flex items-center gap-3 text-zinc-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Reads your latest unread emails for context.
                </li>
                <li className="flex items-center gap-3 text-zinc-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Prepares drafts perfectly formatted to your style.
                </li>
              </ul>
            </Reveal>
          </div>
        </section>

        {/* 6. Pricing Section */}
        <section id="pricing" className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Simple pricing for focus.</h2>
            <p className="text-lg text-zinc-500 tracking-tight">Start for free, upgrade when you need infinite speed.</p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Reveal delay={0}>
              <div className="bg-white border border-zinc-200/80 rounded-[2rem] p-10 flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400 h-full">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Basic</h3>
                <div className="text-4xl font-bold tracking-tighter mb-6">$0<span className="text-lg text-zinc-400 font-normal tracking-normal">/mo</span></div>
                <p className="text-zinc-500 mb-8 pb-8 border-b border-zinc-100">For individuals wanting to experience the future of email.</p>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-zinc-700"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> 50 emails synced per day</li>
                  <li className="flex items-center gap-3 text-zinc-700"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> 5 AI agent calls per day</li>
                  <li className="flex items-center gap-3 text-zinc-700"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> 1 Morning Digest</li>
                </ul>
                <Link href="/login" className="w-full py-4 rounded-xl bg-zinc-100 text-zinc-900 font-bold tracking-tight hover:bg-zinc-200 transition-colors duration-300 text-center">
                  Get Started
                </Link>
              </div>
            </Reveal>

            {/* Pro Tier */}
            <Reveal delay={130}>
              <div className="bg-zinc-950 rounded-[2rem] p-10 flex flex-col shadow-2xl relative overflow-hidden text-white border border-zinc-800 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(59,111,224,0.35)] transition-all duration-400 h-full">
                <div
                  className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-25 -translate-y-1/2 translate-x-1/2"
                  style={{ animation: 'meridian-breathe 8s ease-in-out infinite' }}
                />
                <h3 className="text-2xl font-bold tracking-tight mb-2 relative z-10">Pro</h3>
                <div className="text-4xl font-bold tracking-tighter mb-6 relative z-10">$20<span className="text-lg text-zinc-500 font-normal tracking-normal">/mo</span></div>
                <p className="text-zinc-400 mb-8 pb-8 border-b border-zinc-800 relative z-10">For professionals who live in their inbox.</p>
                <ul className="space-y-4 mb-10 flex-1 relative z-10">
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Unlimited email sync</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Unlimited AI agent calls</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Priority Claude/Mistral access</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Advanced Automations</li>
                </ul>
                <Link href="/login" className="w-full py-4 rounded-xl bg-white text-zinc-900 font-bold tracking-tight hover:bg-blue-50 transition-colors duration-300 text-center relative z-10">
                  Upgrade to Pro
                </Link>
              </div>
            </Reveal>

            {/* Enterprise Tier */}
            <Reveal delay={260}>
              <div className="bg-white border border-zinc-200/80 rounded-[2rem] p-10 flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400 h-full">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Enterprise</h3>
                <div className="text-4xl font-bold tracking-tighter mb-6">Custom</div>
                <p className="text-zinc-500 mb-8 pb-8 border-b border-zinc-100">For teams needing custom integrations and dedicated support.</p>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-zinc-700"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Dedicated success manager</li>
                  <li className="flex items-center gap-3 text-zinc-700"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Custom MCP integrations</li>
                  <li className="flex items-center gap-3 text-zinc-700"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Enterprise-grade security</li>
                  <li className="flex items-center gap-3 text-zinc-700"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> SLA guarantees</li>
                </ul>
                <a href="mailto:sales@example.com" className="w-full py-4 rounded-xl bg-zinc-100 text-zinc-900 font-bold tracking-tight hover:bg-zinc-200 transition-colors duration-300 text-center">
                  Contact Sales
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. Bottom CTA */}
        <Reveal className="w-full max-w-5xl mx-auto px-6 py-12 md:py-24">
          <div className="bg-zinc-950 rounded-[3rem] p-16 md:p-24 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-transparent"
              style={{ animation: 'meridian-breathe 9s ease-in-out infinite' }}
            />
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-8 relative z-10">Ready to clear your mind?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href={user ? "/agent" : "/login"}
                className="px-10 py-5 rounded-full bg-white text-zinc-900 text-[16px] font-bold tracking-tight hover:bg-blue-50 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(96,150,255,0.4)]"
              >
                Start the Interactive Demo
              </Link>
              {!user && (
                <Link
                  href="/login"
                  className="px-10 py-5 rounded-full bg-zinc-900 text-white text-[16px] font-bold tracking-tight hover:bg-zinc-800 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-all duration-300 border border-zinc-800 hover:border-blue-600/50"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </Reveal>

      </main>

      {/* 8. Comprehensive Footer */}
      <footer className="border-t border-zinc-200/60 bg-zinc-50 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 flex flex-col pr-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-bold tracking-tight text-[16px]">Meridian</span>
            </div>
            <p className="text-zinc-500 text-[14px] leading-relaxed mb-6">
              The fastest email and calendar experience ever made. Powered by Corsair, integrated with everything you need to reach inbox zero.
            </p>
            <div className="flex items-center gap-4 text-zinc-400">
              <Code className="w-5 h-5 hover:text-blue-600 cursor-pointer transition-colors duration-300" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold tracking-tight text-[14px] mb-2">Product</h4>
            <Link href="#features" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Features</Link>
            <Link href="#agent" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">AI Agent</Link>
            <Link href="#pricing" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Pricing</Link>
            <Link href="/login" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Sign In</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold tracking-tight text-[14px] mb-2">Resources</h4>
            <a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Documentation</a>
            <a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">API Reference</a>
            <a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Blog</a>
            <a href="https://github.com" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">GitHub</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold tracking-tight text-[14px] mb-2">Legal</h4>
            <a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 border-t border-zinc-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[13px] text-zinc-500 font-medium">© 2026 Meridian Technologies Inc. All rights reserved.</span>
          <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
            Designed with precision.
          </div>
        </div>
      </footer>

      {/* Keyframes — scoped via style tag since these are one-off, named animations */}
      <style jsx global>{`
        @keyframes meridian-breathe {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.06); }
        }
        @keyframes meridian-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes meridian-pop {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes meridian-ping {
          0% { opacity: 0.9; transform: scale(1); }
          70%, 100% { opacity: 0; transform: scale(2.4); }
        }
        @keyframes meridian-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes meridian-draw {
          to { stroke-dashoffset: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </div>
  );
}