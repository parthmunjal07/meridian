'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Sparkles,
  Zap,
  Crown,
  CheckCircle2,
  LogOut,
  ChevronRight,
  Clock,
  Copy,
  Check,
  BadgeCheck,
} from 'lucide-react';

// Role → plan display mapping
const PLAN_CONFIG: Record<string, {
  label: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  icon: React.ElementType;
  description: string;
  features: string[];
}> = {
  FREE: {
    label: 'Free',
    color: 'text-zinc-700',
    badgeBg: 'bg-zinc-100 text-zinc-700',
    badgeBorder: 'border-zinc-200',
    icon: Zap,
    description: 'Core productivity suite with intelligent Gmail and calendar sync.',
    features: [
      '20 AI agent actions / month',
      'Instant Gmail inbox sync',
      'Automated daily morning digest',
      'Integrated interactive calendar',
    ],
  },
  PRO: {
    label: 'Pro',
    color: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700',
    badgeBorder: 'border-blue-200',
    icon: Sparkles,
    description: 'Unlimited AI capabilities designed for busy executives and power users.',
    features: [
      'Unlimited AI agent actions & chats',
      'Priority background inbox indexing',
      'Autonomous calendar scheduling',
      'Custom multi-step agent workflows',
    ],
  },
  TEAM_MEMBER: {
    label: 'Team Member',
    color: 'text-violet-600',
    badgeBg: 'bg-violet-50 text-violet-700',
    badgeBorder: 'border-violet-200',
    icon: Crown,
    description: 'Collaborative AI workspace shared with your team.',
    features: [
      'Everything in Pro included',
      'Shared agent workspace & tools',
      'Team digest & schedule coordination',
      'Centralized billing & seats',
    ],
  },
  TEAM_ADMIN: {
    label: 'Team Admin',
    color: 'text-violet-600',
    badgeBg: 'bg-violet-50 text-violet-700',
    badgeBorder: 'border-violet-200',
    icon: Crown,
    description: 'Full administrative control and team workspace management.',
    features: [
      'Everything in Team',
      'Seat management & invitations',
      'Team audit logs & usage analytics',
      'Dedicated priority support',
    ],
  },
  SUPER_ADMIN: {
    label: 'Super Admin',
    color: 'text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700',
    badgeBorder: 'border-amber-200',
    icon: Shield,
    description: 'Full platform-wide administrative access.',
    features: [
      'Unrestricted platform privileges',
      'System-wide settings & monitoring',
      'Security audit log access',
      'Direct developer support line',
    ],
  },
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const role: string = (user as any)?.role || 'FREE';
  const plan = PLAN_CONFIG[role] || PLAN_CONFIG.FREE;
  const PlanIcon = plan.icon;

  const initials = user?.name
    ? user.name
      .split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  const handleCopyEmail = () => {
    if (!user?.email) return;
    navigator.clipboard.writeText(user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F9FAFB]">
      {/* Top Header */}
      <header className="h-[72px] bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 border border-zinc-200/60">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-zinc-900 tracking-tight leading-none">
              Account Profile
            </h1>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Manage your personal credentials, subscription, and security
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border ${plan.badgeBg} ${plan.badgeBorder}`}>
          <PlanIcon className="w-3.5 h-3.5" />
          {plan.label} Plan
        </span>
      </header>

      {/* Main Container */}
      <div className="flex-1 px-6 py-8 max-w-3xl w-full mx-auto flex flex-col gap-6">

        {/* User Identity Card */}
        <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-28 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="absolute top-4 right-5 text-white/70 text-[11px] font-medium tracking-wider uppercase bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Meridian ID
            </div>
          </div>

          {/* Profile Header Body */}
          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar & Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
              <div className="flex items-end gap-4">
                {/* Large Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-bold text-[24px] flex items-center justify-center ring-4 ring-white shadow-lg shrink-0 select-none">
                  {initials}
                </div>

                {/* Name & Email Headline */}
                <div className="mb-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-bold text-zinc-900 tracking-tight truncate leading-snug">
                      {user?.name || 'Unnamed User'}
                    </h2>
                    <BadgeCheck className="w-5 h-5 text-blue-600 shrink-0" title="Verified Account" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[13px] text-zinc-500 font-medium truncate">
                      {user?.email}
                    </span>
                    <button
                      onClick={handleCopyEmail}
                      type="button"
                      className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Credential Data Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-100">
              <div className="p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/50">
                <div className="flex items-center gap-2 text-zinc-400 mb-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Primary Email
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-zinc-800 truncate" title={user?.email}>
                  {user?.email || '—'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/50">
                <div className="flex items-center gap-2 text-zinc-400 mb-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Display Name
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-zinc-800 truncate">
                  {user?.name || '—'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/50">
                <div className="flex items-center gap-2 text-zinc-400 mb-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Auth Method
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-zinc-800 truncate">
                  {user?.authProvider === 'google'
                    ? 'Google OAuth'
                    : user?.authProvider === 'demo'
                      ? 'Demo Sandbox'
                      : 'Email & Password'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Plan & Subscription Card */}
        <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${plan.badgeBg} flex items-center justify-center border ${plan.badgeBorder} shadow-sm`}>
                  <PlanIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Membership Tier
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-zinc-900 tracking-tight">
                    Meridian {plan.label}
                  </h3>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Subscription
              </span>
            </div>

            <p className="text-[13px] text-zinc-600 mb-5 leading-relaxed">
              {plan.description}
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-zinc-100">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[13px] font-medium text-zinc-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Banner for Free Users */}
          {role === 'FREE' && (
            <div className="border-t border-zinc-100 px-6 py-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-zinc-900">
                    Upgrade to Meridian Pro
                  </p>
                  <p className="text-[12px] text-zinc-500">
                    Get unlimited AI scheduling and priority mailbox processing
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shrink-0"
              >
                Upgrade Plan
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* Security & Active Session */}
        <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 border border-zinc-200/60">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-zinc-900 tracking-tight">
                    Active Session & Security
                  </h3>
                  <p className="text-[12px] text-zinc-500">
                    Signed in with encrypted HTTP-only session tokens
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[12px] text-emerald-600 font-medium bg-emerald-50/70 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Secure
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-zinc-900">Sign Out</p>
                <p className="text-[12px] text-zinc-500">End your current session on this device</p>
              </div>

              <button
                id="profile-logout-btn"
                onClick={handleLogout}
                disabled={isLoggingOut}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                <LogOut className="w-3.5 h-3.5" />
                {isLoggingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
