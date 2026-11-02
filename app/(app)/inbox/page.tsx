'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'react-intersection-observer';
import EmailItem from '@/components/EmailItem';
import ReadingPane from '@/components/ReadingPane';
import CalendarSidebar from '@/components/CalendarSidebar';
import ComposeModal from '@/components/ComposeModal';
import ShortcutOverlay from '@/components/ShortcutOverlay';
import {
  Archive,
  Inbox,
  ListFilter,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InboxPage() {
  const { user } = useAuth();
  const limit = 20;
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{ to: string; subject: string } | null>(null);
  const [view, setView] = useState<'INBOX' | 'ARCHIVED' | 'SENT' | 'SPAM'>('INBOX');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isShortcutOverlayOpen, setIsShortcutOverlayOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'NEWEST' | 'OLDEST' | 'UNREAD_FIRST'>('NEWEST');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [mailFilter, setMailFilter] = useState<'ALL' | 'UNREAD' | 'OTHERS'>('ALL');
  const [greeting, setGreeting] = useState('Good morning');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const hour = new Date().getHours();
      setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: any) => {
      if (debouncedSearchQuery) {
        if (pageIndex > 0) return null;
        return `/api/emails/search?q=${encodeURIComponent(debouncedSearchQuery)}`;
      }

      if (previousPageData && !previousPageData.nextCursor) return null;
      if (pageIndex === 0) return `/api/emails?limit=${limit}&view=${view}`;
      return `/api/emails?cursor=${previousPageData.nextCursor}&limit=${limit}&view=${view}`;
    },
    [debouncedSearchQuery, limit, view]
  );

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && !isValidating && !isReachingEnd && !debouncedSearchQuery) {
        setSize(size + 1);
      }
    },
  });

  const emails = data ? data.flatMap((page) => page.emails || []) : [];

  let displayEmails = [...emails];
  if (sortOption === 'OLDEST') {
    displayEmails.reverse();
  } else if (sortOption === 'UNREAD_FIRST') {
    displayEmails.sort((a: any, b: any) => {
      if (a.isRead === b.isRead) return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.isRead ? 1 : -1;
    });
  }

  const unreadCount = emails.filter((email: any) => !email.isRead).length;
  const otherCount = emails.length - unreadCount;

  if (mailFilter === 'UNREAD') {
    displayEmails = displayEmails.filter((email: any) => !email.isRead);
  } else if (mailFilter === 'OTHERS') {
    displayEmails = displayEmails.filter((email: any) => email.isRead);
  }

  const selectedEmail = emails.find((e: any) => e?.id === selectedEmailId) || null;

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.emails?.length === 0;
  const isFilteredEmpty = !isLoadingInitialData && displayEmails.length === 0;
  const isReachingEnd = debouncedSearchQuery
    ? true
    : isEmpty ||
      (data && data[data.length - 1]?.emails?.length < limit) ||
      (data && !data[data.length - 1]?.nextCursor);

  // SSE Realtime Updates
  useEffect(() => {
    if (debouncedSearchQuery) return;

    const eventSource = new EventSource('/api/sse');
    eventSource.onmessage = (event) => {
      try {
        const newEmail = JSON.parse(event.data);
        mutate((currentData: any) => {
          if (!currentData) return currentData;
          const newData = [...currentData];
          newData[0] = {
            ...newData[0],
            emails: [newEmail, ...newData[0].emails],
          };
          return newData;
        }, false);
      } catch (e) {
        console.error('Failed to parse SSE message', e);
      }
    };
    return () => eventSource.close();
  }, [mutate, debouncedSearchQuery]);

  const removeEmailOptimistically = async (id: string, action: 'archive' | 'delete') => {
    if (selectedEmailId === id) setSelectedEmailId(null);

    await mutate((currentData: any) => {
      if (!currentData) return currentData;
      return currentData.map((page: any) => ({
        ...page,
        emails: page.emails.filter((e: any) => e.id !== id),
      }));
    }, false);

    try {
      const res = await fetch(`/api/emails/${id}/${action}`, { method: 'POST' });
      if (!res.ok) throw new Error(`Failed to ${action}`);
    } catch (err) {
      console.error(`Rollback ${action}`, err);
      mutate();
    }
  };

  const handleArchive = useCallback(
    (id: string) => removeEmailOptimistically(id, 'archive'),
    [selectedEmailId, mutate]
  );
  const handleDelete = useCallback(
    (id: string) => removeEmailOptimistically(id, 'delete'),
    [selectedEmailId, mutate]
  );

  const handleReply = useCallback(
    (id: string) => {
      const email = emails.find((e: any) => e.id === id);
      if (email) {
        setReplyTo({ to: email.from, subject: email.subject });
        setIsComposeOpen(true);
      }
    },
    [emails]
  );

  const handleSend = async (payload: {
    to: string;
    subject: string;
    body: string;
    cc?: string;
    bcc?: string;
  }) => {
    await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  // Handle compose query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('compose') === 'true') {
      const to = params.get('to');
      const subject = params.get('subject');
      if (to) {
        setReplyTo({ to, subject: subject || '' });
        setIsComposeOpen(true);

        // Remove query parameters from URL without reloading
        const newUrl =
          window.location.protocol + '//' + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      )
        return;
      switch (e.key) {
        case 'c':
          e.preventDefault();
          setReplyTo(null);
          setIsComposeOpen(true);
          break;
        case 'e':
          e.preventDefault();
          if (selectedEmailId) handleArchive(selectedEmailId);
          break;
        case 'r':
          e.preventDefault();
          if (selectedEmailId) handleReply(selectedEmailId);
          break;
        case '/':
          e.preventDefault();
          setTimeout(() => searchInputRef.current?.focus(), 0);
          break;
        case '?':
          e.preventDefault();
          setIsShortcutOverlayOpen((prev) => !prev);
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedEmailId(null);
          break; // Close reading pane
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedEmailId, handleArchive, handleReply]);

  const tabs = [
    { id: 'ALL', label: 'All mails', count: null },
    { id: 'UNREAD', label: 'Unread', count: unreadCount },
    { id: 'OTHERS', label: 'Others', count: otherCount },
  ] as const;

  const mailboxes = [
    { id: 'INBOX', label: 'Inbox', icon: Inbox },
    { id: 'ARCHIVED', label: 'Archived', icon: Archive },
    { id: 'SENT', label: 'Sent', icon: Send },
    { id: 'SPAM', label: 'Spam', icon: ShieldAlert },
  ] as const;

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there';

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden bg-white w-full h-full">
      {/* Pane 2: Email List (Main Content) */}
      <div className="flex-1 min-w-0 flex flex-col h-full relative border-r border-mail-line bg-mail-canvas">
        {/* Greeting and inbox controls */}
        <header className="min-h-[72px] flex items-center justify-between gap-4 px-4 sm:px-5 border-b border-mail-line shrink-0">
          <div className="flex min-w-0 items-baseline gap-2.5">
            <h1 className="truncate text-[17px] font-semibold tracking-[-0.02em] text-mail-primary sm:text-[18px]">
              {greeting}, {firstName}
            </h1>
            <span aria-hidden="true" className="h-4 w-px shrink-0 bg-mail-line" />
            <p className="shrink-0 text-[13px] font-medium tabular-nums text-mail-secondary">
              {emails.length.toLocaleString()} {emails.length === 1 ? 'Email' : 'Emails'}
            </p>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              aria-label="Search and filter mail"
              aria-expanded={isSortMenuOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-mail-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mail-primary focus-visible:ring-offset-2 ${isSortMenuOpen ? 'bg-mail-muted text-mail-primary' : 'hover:bg-mail-muted hover:text-mail-primary'}`}
            >
              <ListFilter className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </button>

            {isSortMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-[280px] rounded-2xl border border-mail-line bg-white p-3 shadow-[0_18px_45px_rgba(24,24,27,0.12)]">
                <label htmlFor="mail-search" className="sr-only">
                  Search mail
                </label>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mail-secondary" />
                  <input
                    id="mail-search"
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search mail"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-11 w-full rounded-xl border border-mail-line bg-mail-muted pl-9 pr-3 text-[13px] text-mail-primary outline-none placeholder:text-mail-secondary focus:border-mail-primary focus:ring-2 focus:ring-mail-primary/10"
                  />
                </div>

                <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-mail-secondary">
                  Mailbox
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {mailboxes.map((mailbox) => {
                    const Icon = mailbox.icon;
                    return (
                      <button
                        key={mailbox.id}
                        type="button"
                        onClick={() => {
                          setView(mailbox.id);
                          setMailFilter('ALL');
                          setSelectedEmailId(null);
                        }}
                        className={`flex min-h-11 items-center gap-2 rounded-lg px-2.5 text-left text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mail-primary ${view === mailbox.id ? 'bg-mail-primary text-white' : 'text-mail-secondary hover:bg-mail-muted hover:text-mail-primary'}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {mailbox.label}
                      </button>
                    );
                  })}
                </div>

                <div className="my-3 h-px bg-mail-line" />
                <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-mail-secondary">
                  Sort
                </p>
                <div className="space-y-0.5">
                  {(
                    [
                      ['NEWEST', 'Newest first'],
                      ['OLDEST', 'Oldest first'],
                      ['UNREAD_FIRST', 'Unread first'],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSortOption(id)}
                      className={`flex min-h-10 w-full items-center justify-between rounded-lg px-2.5 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mail-primary ${sortOption === id ? 'font-semibold text-mail-primary' : 'text-mail-secondary hover:bg-mail-muted hover:text-mail-primary'}`}
                    >
                      {label}
                      {sortOption === id && (
                        <span className="h-1.5 w-1.5 rounded-full bg-mail-unread" />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => mutate()}
                  className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-mail-line text-[12px] font-semibold text-mail-primary transition-colors hover:bg-mail-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mail-primary"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isValidating ? 'animate-spin motion-reduce:animate-none' : ''}`}
                  />
                  Refresh mail
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-mail-line bg-mail-muted/60 px-4 py-4 shrink-0 sm:px-5">
          <div className="grid min-w-0 flex-1 grid-cols-3 rounded-xl border border-mail-line bg-mail-control p-1 shadow-[inset_0_1px_1px_rgba(24,24,27,0.03)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMailFilter(tab.id);
                  setSelectedEmailId(null);
                }}
                aria-pressed={mailFilter === tab.id}
                className={`min-h-9 truncate rounded-lg px-2 text-[12px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mail-primary focus-visible:ring-offset-1 ${
                  mailFilter === tab.id
                    ? 'bg-white text-mail-primary shadow-[0_1px_4px_rgba(24,24,27,0.09)]'
                    : 'text-mail-secondary hover:text-mail-primary'
                }`}
              >
                {tab.label}
                {tab.count !== null ? ` (${tab.count})` : ''}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setReplyTo(null);
              setIsComposeOpen(true);
            }}
            aria-label="Compose email"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-mail-line bg-white text-mail-primary shadow-[0_1px_4px_rgba(24,24,27,0.08)] transition-transform hover:bg-mail-muted active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mail-primary focus-visible:ring-offset-2"
          >
            <Plus className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto bg-mail-canvas">
          {isLoadingInitialData ? (
            <div className="flex flex-col">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border-b border-mail-line px-4 py-4 sm:px-5"
                >
                  <div
                    className="h-10 w-10 shrink-0 rounded-xl bg-mail-muted animate-pulse motion-reduce:animate-none"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                  <div className="flex-1 space-y-2 pt-0.5">
                    <div className="flex items-center justify-between">
                      <div
                        className="h-3 w-28 rounded-full bg-mail-line animate-pulse motion-reduce:animate-none"
                        style={{ animationDelay: `${i * 100 + 50}ms` }}
                      />
                      <div
                        className="h-3 w-12 rounded-full bg-mail-muted animate-pulse motion-reduce:animate-none"
                        style={{ animationDelay: `${i * 100 + 100}ms` }}
                      />
                    </div>
                    <div
                      className="h-3.5 w-2/3 rounded-full bg-mail-line animate-pulse motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 100 + 150}ms` }}
                    />
                    <div
                      className="h-3 w-5/6 rounded-full bg-mail-muted animate-pulse motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 100 + 200}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : isFilteredEmpty ? (
            <div className="mx-auto flex max-w-xs flex-col items-center px-6 pt-20 text-center">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-mail-muted text-mail-secondary">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="text-[14px] font-semibold text-mail-primary">No mail here</p>
              <p className="mt-1 text-[12px] leading-5 text-mail-secondary">
                Try another filter or refresh this mailbox.
              </p>
            </div>
          ) : (
            displayEmails.map((email: any) => (
              <EmailItem
                key={email.id}
                email={email}
                isSelected={selectedEmailId === email.id}
                onSelect={() => setSelectedEmailId(email.id)}
              />
            ))
          )}

          {/* Loading / End indicator */}
          <div ref={ref} className="py-8 text-center">
            {isLoadingMore ? (
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            ) : isReachingEnd && !isEmpty ? (
              <p className="text-[11px] text-zinc-400 font-medium">No more emails</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Pane 3: Right Sidebar Toggle (Reading Pane OR Calendar) */}
      {selectedEmailId && selectedEmail && (
        <ReadingPane
          email={selectedEmail}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onReply={handleReply}
          onClose={() => setSelectedEmailId(null)}
        />
      )}

      <div className={selectedEmailId && selectedEmail ? 'hidden' : 'block h-full shrink-0'}>
        <CalendarSidebar />
      </div>

      {/* Modals */}
      {isComposeOpen && (
        <ComposeModal
          onClose={() => setIsComposeOpen(false)}
          onSend={handleSend}
          replyTo={replyTo}
        />
      )}

      {isShortcutOverlayOpen && <ShortcutOverlay onClose={() => setIsShortcutOverlayOpen(false)} />}
    </div>
  );
}
