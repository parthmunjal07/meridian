'use client';

import Link from 'next/link';
import {
  Sparkles,
  CalendarDays,
  Mail,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase,
  Globe,
  ShieldCheck,
  Layout,
  Filter,
  Check,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef, useState } from 'react';

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
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  // States for the abstract "flow" animation
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900 scroll-smooth overflow-x-hidden">
      {/* 1. Elegant Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FCFCFD]/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-[17px] text-slate-900">Meridian</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-[14px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200">Capabilities</Link>
            <Link href="#assistant" className="text-[14px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200">The Assistant</Link>
            <Link href="#pricing" className="text-[14px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200">Plans</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden md:block text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">
              Sign In
            </Link>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-[14px] font-medium tracking-tight hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center w-full pt-32 pb-16">

        {/* Soft Ambient Background Glow */}
        <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-blue-50/60 rounded-full blur-[120px]"></div>
          <div className="absolute top-[10%] right-[-10%] w-[50%] h-[70%] bg-slate-100/80 rounded-full blur-[100px]"></div>
        </div>

        {/* 2. Hero Section */}
        <section className="flex flex-col items-center text-center max-w-6xl mx-auto px-6 w-full mt-24 mb-32 relative">
          
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10 w-full flex flex-col items-center">
            

            <h1 className="text-5xl md:text-7xl lg:text-[84px] font-semibold tracking-tight leading-[1.05] mb-8 text-slate-900 text-balance max-w-5xl mx-auto">
              Orchestrate your day. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-800">Effortlessly.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-[65ch] leading-relaxed mx-auto font-light text-balance">
              Meridian compiles your emails and calendar into one seamless flow, eliminating manual coordination so you can focus on what truly matters.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 w-full sm:w-auto">
              <Link
                href={user ? "/dashboard" : "/login"}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white text-[16px] font-semibold tracking-wide hover:scale-105 hover:bg-slate-800 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full sm:w-auto min-w-[200px]"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 border border-slate-200/80 text-[16px] font-semibold tracking-wide hover:bg-slate-50 transition-all duration-300 shadow-sm w-full sm:w-auto min-w-[200px]"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Signature Visual: Framed Abstract Workflow */}
          <div className="relative w-full max-w-5xl mx-auto z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
            {/* macOS Window Wrapper */}
            <div className="relative w-full rounded-[2rem] border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
              
              {/* Window Header */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200/50 bg-white/40">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                <div className="mx-auto flex items-center gap-2 opacity-50 pr-12">
                  <Sparkles className="w-3 h-3 text-slate-600" />
                  <span className="text-[12px] font-medium text-slate-600 uppercase tracking-widest">Meridian Core</span>
                </div>
              </div>

              {/* Window Content */}
              <div className="flex flex-col md:flex-row items-stretch min-h-[450px]">
                
                {/* Left Side: Unstructured Inbox */}
                <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col justify-center bg-slate-50/50 relative overflow-hidden text-left">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none opacity-50"></div>
                  <div className="text-[13px] font-semibold text-slate-400 uppercase tracking-widest mb-8 relative z-10">The Noise</div>
                  <div className="space-y-4 relative z-10">
                    
                    {/* Email 1 */}
                    <div className={`p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-700 ${step >= 1 ? 'opacity-30 scale-95 blur-[2px]' : 'opacity-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-slate-900 text-sm">Sarah Jenkins</span>
                        <span className="text-[11px] text-slate-400">10:42 AM</span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        "Could we push our Q3 sync to tomorrow afternoon? I'm completely booked today. Let me know what time works."
                      </p>
                    </div>

                    {/* Email 2 */}
                    <div className={`p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-700 ${step >= 2 ? 'opacity-30 scale-95 blur-[2px]' : 'opacity-100 delay-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-slate-900 text-sm">Board Update</span>
                        <span className="text-[11px] text-slate-400">9:15 AM</span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        "Please find attached the preliminary figures for next week's meeting. We need to align on the narrative before Monday."
                      </p>
                    </div>

                  </div>
                </div>

                {/* Right Side: The Flow (Meridian) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#FAFAFB] text-left">
                  <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    <div className="text-[13px] font-semibold text-slate-900 uppercase tracking-widest">Meridian Organized</div>
                  </div>
                  
                  <div className="relative min-h-[240px]">
                    {/* Action 1 */}
                    <div className={`absolute inset-x-0 transition-all duration-700 transform ${step === 1 || step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center"><CalendarDays className="w-5 h-5 text-slate-600" /></div>
                          <div>
                            <p className="text-[15px] font-semibold text-slate-900">Rescheduled: Q3 Sync</p>
                            <p className="text-[13px] text-slate-500">Tomorrow, 2:00 PM</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50/80 px-4 py-2 rounded-xl w-max">
                          <Check className="w-4 h-4" /> Calendar Updated Automatically
                        </div>
                      </div>
                    </div>

                    {/* Action 2 */}
                    <div className={`absolute inset-x-0 transition-all duration-700 transform ${step === 3 || step === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center"><Layout className="w-5 h-5 text-slate-600" /></div>
                          <div>
                            <p className="text-[15px] font-semibold text-slate-900">Meeting Brief Created</p>
                            <p className="text-[13px] text-slate-500">Board Update alignment</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50/80 px-4 py-2 rounded-xl w-max">
                          <Check className="w-4 h-4" /> Added to Monday's agenda
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 3. Social Proof (Executive focused) */}
        <Reveal className="w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center border-t border-slate-200/60">
          <p className="text-[13px] font-medium text-slate-500 mb-10 text-center">
            Trusted by executives at forward-thinking companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2"><Globe className="w-6 h-6 text-slate-800" /><span className="text-xl font-bold tracking-tight text-slate-800">Global Partners</span></div>
            <div className="flex items-center gap-2"><Briefcase className="w-6 h-6 text-slate-800" /><span className="text-xl font-bold tracking-tight text-slate-800">Apex Capital</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-slate-800" /><span className="text-xl font-bold tracking-tight text-slate-800">Merit Health</span></div>
          </div>
        </Reveal>

        {/* 4. Bento Box Feature Grid */}
        <section id="features" className="w-full max-w-6xl mx-auto px-6 py-32 border-t border-slate-200/60">
          <Reveal className="mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-slate-900 leading-[1.1] text-balance">Your time is your most <br className="hidden md:block" /> valuable asset.</h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-[65ch] text-balance">Meridian removes the friction of daily logistics. By unifying your communications and scheduling, it gives you hours back every week.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(240px,auto)]">

            {/* Card 1: Tall (Row 1-2, Col 1) */}
            <Reveal delay={0} className="md:col-span-1 md:row-span-2">
              <div className="group relative overflow-hidden bg-indigo-50/50 border border-indigo-100/50 rounded-[2rem] p-8 hover:shadow-lg transition-all duration-500 h-full flex flex-col">
                <h3 className="text-2xl font-semibold tracking-tight mb-2 text-slate-900">Intelligent Triage</h3>
                <div className="flex-1 flex flex-col justify-center items-center py-8">
                  <div className="w-24 h-24 rounded-2xl bg-indigo-100/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-sm border border-indigo-200/50">
                    <Filter className="w-10 h-10 text-indigo-400" />
                  </div>
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  Stop drowning in noise. Meridian automatically categorizes communications, highlighting what requires immediate attention.
                </p>
              </div>
            </Reveal>

            {/* Card 2: Wide (Row 1, Col 2-3) */}
            <Reveal delay={100} className="md:col-span-2 md:row-span-1">
              <div className="group relative overflow-hidden bg-rose-50/50 border border-rose-100/50 rounded-[2rem] p-8 hover:shadow-lg transition-all duration-500 h-full flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold tracking-tight mb-3 text-slate-900">Fluid Scheduling</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Meetings are scheduled, moved, and canceled through natural conversation. No more tab switching or manual calendar invites.
                  </p>
                </div>
                <div className="w-full md:w-auto flex justify-end">
                  <div className="w-20 h-20 rounded-2xl bg-rose-100/50 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-500 shadow-sm border border-rose-200/50">
                    <CalendarDays className="w-8 h-8 text-rose-400" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 3: Square (Row 2, Col 2) */}
            <Reveal delay={150} className="md:col-span-1 md:row-span-1">
              <div className="group relative overflow-hidden bg-amber-50/50 border border-amber-100/50 rounded-[2rem] p-8 hover:shadow-lg transition-all duration-500 h-full flex flex-col justify-between">
                <h3 className="text-xl font-semibold tracking-tight mb-4 text-slate-900">Morning Briefings</h3>
                <div className="flex-1 flex items-center justify-center py-4">
                  <Sparkles className="w-12 h-12 text-amber-400 group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  Wake up to a synthesized summary of what happened overnight.
                </p>
              </div>
            </Reveal>

            {/* Card 4: Square (Row 2, Col 3) */}
            <Reveal delay={200} className="md:col-span-1 md:row-span-1">
              <div className="group relative overflow-hidden bg-emerald-50/50 border border-emerald-100/50 rounded-[2rem] p-8 hover:shadow-lg transition-all duration-500 h-full flex flex-col justify-between">
                <h3 className="text-xl font-semibold tracking-tight mb-4 text-slate-900">Drafts Prepared</h3>
                <div className="flex-1 flex items-center justify-center py-4">
                  <Mail className="w-12 h-12 text-emerald-400 group-hover:-translate-y-1 transition-transform duration-500" />
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  Responses to routine inquiries are drafted automatically in your tone.
                </p>
              </div>
            </Reveal>

            {/* Card 5: Wide (Row 3, Col 1-2) */}
            <Reveal delay={250} className="md:col-span-2 md:row-span-1">
              <div className="group relative overflow-hidden bg-orange-50/50 border border-orange-100/50 rounded-[2rem] p-8 hover:shadow-lg transition-all duration-500 h-full flex flex-col justify-end">
                <div className="absolute top-8 right-8 w-20 h-20 rounded-2xl bg-orange-100/50 flex items-center justify-center shadow-sm border border-orange-200/50 group-hover:scale-105 transition-transform duration-500">
                  <Briefcase className="w-8 h-8 text-orange-400" />
                </div>
                <div className="relative z-10 w-full md:w-2/3 mt-12 md:mt-0">
                  <h3 className="text-2xl font-semibold tracking-tight mb-3 text-slate-900">Cross-Team Sync</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Synchronize across multiple calendars to find perfect overlaps without sending a single "what time works for you?" message.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 6: Square (Row 3, Col 3) */}
            <Reveal delay={300} className="md:col-span-1 md:row-span-1">
              <div className="group relative overflow-hidden bg-sky-50/50 border border-sky-100/50 rounded-[2rem] p-8 hover:shadow-lg transition-all duration-500 h-full flex flex-col justify-between">
                <h3 className="text-xl font-semibold tracking-tight mb-4 text-slate-900">Enterprise Privacy</h3>
                <div className="flex-1 flex items-center justify-center py-4">
                  <ShieldCheck className="w-12 h-12 text-sky-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  Your data is siloed, encrypted, and never used to train public models.
                </p>
              </div>
            </Reveal>

          </div>
        </section>

        {/* 5. Deep Dive: The Assistant */}
        <section id="assistant" className="w-full py-32 border-y border-slate-200/60 bg-white">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            <Reveal className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 w-max mb-8">
                <Sparkles className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Your Invisible Chief of Staff</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-slate-900 leading-[1.1] text-balance">
                Context-aware. <br /> Proactive. <br /> Secure.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-10 font-light max-w-[65ch]">
                Meridian understands context—not just words. It anticipates your needs and proactively prepares you for the day ahead.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-emerald-600" /></div>
                  <div>
                    <strong className="block text-slate-900 font-medium mb-1">Morning Briefings</strong>
                    <span className="text-slate-500 text-[15px] leading-relaxed block">Wake up to a synthesized summary of what happened overnight and what requires attention today.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-emerald-600" /></div>
                  <div>
                    <strong className="block text-slate-900 font-medium mb-1">Drafts Prepared in Your Voice</strong>
                    <span className="text-slate-500 text-[15px] leading-relaxed block">Responses to routine inquiries are drafted automatically, waiting only for your final approval.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-emerald-600" /></div>
                  <div>
                    <strong className="block text-slate-900 font-medium mb-1">Enterprise-Grade Privacy</strong>
                    <span className="text-slate-500 text-[15px] leading-relaxed block">Your data is siloed, encrypted, and never used to train public models. Absolute confidentiality.</span>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={150} className="relative">
              <div className="relative w-full aspect-[4/5] md:aspect-square rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col p-8 md:p-12">
                <div className="flex-1 flex flex-col justify-center space-y-8">

                  {/* Chat Bubbles representing the Assistant */}
                  <div className="self-end bg-white border border-slate-200 rounded-2xl rounded-tr-sm p-5 shadow-sm max-w-[85%] text-[15px] text-slate-800 leading-relaxed transform hover:-translate-y-1 transition-transform">
                    "Can you handle the scheduling with the design agency? I need a 45-minute review before Friday."
                  </div>

                  <div className="self-start flex gap-4 max-w-[90%]">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-5 text-[15px] text-slate-700 leading-relaxed">
                      <p className="mb-4">I've reviewed both calendars. They have an opening Thursday at 10 AM, and you are free.</p>
                      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 mb-4">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">Draft Created</p>
                          <p className="text-slate-500 text-[12px]">To: Design Agency</p>
                        </div>
                        <Link href="#" className="ml-auto text-[12px] font-medium text-slate-900 flex items-center">Review <ArrowUpRight className="w-3 h-3" /></Link>
                      </div>
                      <p>Should I send the email and hold the time on your calendar?</p>
                    </div>
                  </div>

                </div>
              </div>
            </Reveal>

          </div>
        </section>

        {/* 6. Pricing Section (Business focused) */}
        <section id="pricing" className="w-full max-w-5xl mx-auto px-6 py-32 border-b border-slate-200/60">
          <Reveal className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-slate-900 leading-[1.1] text-balance">An investment in your focus.</h2>
            <p className="text-lg text-slate-500 max-w-[65ch] leading-relaxed mx-auto font-light text-balance">Meridian pays for itself in the first week by returning hours of productive time to your schedule.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Executive Tier */}
            <Reveal delay={0}>
              <div className="bg-white border border-slate-200 rounded-3xl p-10 md:p-12 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold tracking-tight mb-2 text-slate-900">Executive</h3>
                <p className="text-slate-500 mb-8 text-[15px] font-light">For individual leaders seeking total inbox clarity.</p>

                <div className="text-5xl font-medium tracking-tight mb-8 text-slate-900">$49<span className="text-lg text-slate-400 font-normal">/month</span></div>

                <ul className="space-y-5 mb-12 flex-1">
                  <li className="flex items-center gap-3 text-slate-700 text-[15px]"><CheckCircle2 className="w-5 h-5 text-slate-300" /> Unlimited email & calendar sync</li>
                  <li className="flex items-center gap-3 text-slate-700 text-[15px]"><CheckCircle2 className="w-5 h-5 text-slate-300" /> Daily Morning Briefings</li>
                  <li className="flex items-center gap-3 text-slate-700 text-[15px]"><CheckCircle2 className="w-5 h-5 text-slate-300" /> Automated meeting coordination</li>
                  <li className="flex items-center gap-3 text-slate-700 text-[15px]"><CheckCircle2 className="w-5 h-5 text-slate-300" /> Contextual email drafting</li>
                </ul>
                <Link href="/login" className="w-full py-4 rounded-full bg-slate-900 text-white text-[15px] font-medium tracking-wide hover:bg-slate-800 transition-colors duration-300 text-center shadow-md hover:shadow-lg">
                  Start 14-Day Free Trial
                </Link>
              </div>
            </Reveal>

            {/* Team Tier */}
            <Reveal delay={100}>
              <div className="bg-slate-900 rounded-3xl p-10 md:p-12 flex flex-col h-full text-white shadow-xl relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <h3 className="text-2xl font-semibold tracking-tight mb-2 text-white relative z-10">Enterprise</h3>
                <p className="text-slate-400 mb-8 text-[15px] font-light relative z-10">For leadership teams requiring seamless coordination.</p>

                <div className="text-5xl font-medium tracking-tight mb-8 text-white relative z-10">$199<span className="text-lg text-slate-500 font-normal">/month</span></div>

                <ul className="space-y-5 mb-12 flex-1 relative z-10">
                  <li className="flex items-center gap-3 text-slate-200 text-[15px]"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Includes 5 Executive Licenses</li>
                  <li className="flex items-center gap-3 text-slate-200 text-[15px]"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Cross-team schedule optimization</li>
                  <li className="flex items-center gap-3 text-slate-200 text-[15px]"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Shared organizational context</li>
                  <li className="flex items-center gap-3 text-slate-200 text-[15px]"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Priority 24/7 Concierge Support</li>
                </ul>
                <a href="mailto:sales@meridian.com" className="w-full py-4 rounded-full bg-white text-slate-900 text-[15px] font-medium tracking-wide hover:bg-slate-100 transition-colors duration-300 text-center shadow-md hover:shadow-lg relative z-10">
                  Contact Sales
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. Bottom CTA */}
        <Reveal className="w-full max-w-6xl mx-auto px-6 py-32">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center relative overflow-hidden shadow-2xl">
            
            {/* Left Content */}
            <div className="flex-1 z-10 text-left relative">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.05] mb-6 max-w-xl text-balance">
                Your executive workflow is ready.
              </h2>
              <p className="text-[17px] text-slate-300 mb-10 max-w-md leading-relaxed font-light">
                Join the executives who have reclaimed their time and completely transformed how they manage their day.
              </p>
              
              <Link
                href={user ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-slate-900 text-[16px] font-semibold tracking-wide hover:scale-105 hover:bg-slate-50 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                Start Free Trial
              </Link>

              <div className="mt-16 flex items-center gap-4 text-sm text-slate-400">
                <span className="font-medium text-white flex items-center gap-1">
                  4.9 <span className="text-yellow-400">★</span>
                </span>
                <span>Trusted by CEOs globally</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <Link href="#pricing" className="hover:text-white transition-colors flex items-center gap-1">
                  View Pricing <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Right Graphics */}
            <div className="w-full md:w-5/12 h-64 md:h-auto absolute right-0 bottom-0 md:top-0 md:relative z-0 opacity-20 md:opacity-100 mt-12 md:mt-0 flex items-end md:items-center justify-end">
              <div className="relative w-[120%] h-[120%] right-[-10%] translate-y-[20%] md:translate-y-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-64 h-64 bg-slate-800 rounded-3xl rotate-12 blur-sm"></div>
                <div className="absolute w-72 h-72 bg-slate-700/50 rounded-full -translate-x-12 translate-y-12 blur-md"></div>
                <div className="relative w-48 h-64 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl -rotate-6 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white/50" />
                </div>
                <div className="absolute w-32 h-40 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl rotate-12 translate-x-24 -translate-y-12"></div>
              </div>
            </div>
            
          </div>
        </Reveal>

      </main>

      {/* 8. Majestic Footer */}
      <footer className="border-t border-slate-200/60 bg-[#FCFCFD] pt-24 overflow-hidden flex flex-col mt-20">
        <div className="max-w-7xl mx-auto px-6 w-full flex-1">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
            
            {/* Left Brand Area */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold tracking-wider text-xl text-slate-900 uppercase">Meridian</span>
              </div>
              <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-sm font-light">
                Helping executives streamline workflows, reduce complexity, and achieve meaningful results faster.
              </p>
              
              <div className="flex w-full max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter Your Email" 
                  className="flex-1 bg-white border border-slate-200 border-r-0 rounded-l-md px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
                />
                <button className="bg-slate-400 hover:bg-slate-500 text-white px-6 py-3 rounded-r-md text-[14px] font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Right Links Area */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10">
              {/* Col 1 */}
              <div className="flex flex-col gap-4">
                <h4 className="font-semibold tracking-widest text-[12px] text-slate-900 uppercase mb-4">Solutions</h4>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Executive Sync</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Flow Automation</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Team Briefings</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Secure Inbox</a>
              </div>
              {/* Col 2 */}
              <div className="flex flex-col gap-4">
                <h4 className="font-semibold tracking-widest text-[12px] text-slate-900 uppercase mb-4">Docs</h4>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Getting Started</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">API Reference</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Guides</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Integrations</a>
              </div>
              {/* Col 3 */}
              <div className="flex flex-col gap-4">
                <h4 className="font-semibold tracking-widest text-[12px] text-slate-900 uppercase mb-4">Resources</h4>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Blog</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Glossary</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Changelog</a>
              </div>
              {/* Col 4 */}
              <div className="flex flex-col gap-4">
                <h4 className="font-semibold tracking-widest text-[12px] text-slate-900 uppercase mb-4">Legal</h4>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Fair Use</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Terms & Conditions</a>
                <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">Subprocessors</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Massive Typographic Element */}
        <div className="w-full flex justify-center items-center overflow-hidden pointer-events-none select-none mt-10 mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FCFCFD] via-transparent to-transparent z-10 h-full"></div>
          <span className="text-[20vw] font-bold tracking-tighter leading-[0.8] text-slate-200/80">
            MERIDIAN
          </span>
        </div>

        {/* Bottom Sub-footer */}
        <div className="w-full bg-[#FCFCFD] relative z-20 pb-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-[14px] text-slate-500 font-medium">© 2026 Meridian Systems. All rights reserved.</span>
            <div className="flex gap-8">
              <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors font-medium">Terms of Service</a>
              <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors font-medium">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}