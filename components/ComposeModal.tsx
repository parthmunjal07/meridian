import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mail, Users, PenLine, Sparkles } from 'lucide-react';

export interface ComposeModalProps {
  onClose: () => void;
  onSend: (payload: { to: string; subject: string; body: string; cc?: string; bcc?: string }) => Promise<void>;
  replyTo?: { to: string; subject: string } | null;
}

export default function ComposeModal({ onClose, onSend, replyTo }: ComposeModalProps) {
  const [to, setTo] = useState(replyTo?.to || '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState(replyTo?.subject ? (replyTo.subject.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`) : '');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!replyTo?.to) {
      document.getElementById('compose-to')?.focus();
    } else {
      bodyRef.current?.focus();
    }
  }, []); // Run only once on mount

  const handleSend = async () => {
    if (isSending) return;

    const bodyText = bodyRef.current?.value || '';

    if (!to) {
      setError("Please specify a recipient.");
      return;
    }

    if (bodyText.length > 100000) {
      setError("Message body is too large.");
      return;
    }

    try {
      setIsSending(true);
      setError(null);
      await onSend({ to, subject, body: bodyText, cc, bcc });
      onClose();
    } catch (err) {
      setError("Failed to send email. Please try again.");
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Render chips based on comma separated emails
  const renderChips = (value: string, onChange: (val: string) => void) => {
    if (value && value.includes(',')) {
      return value.split(',').map(t => t.trim()).filter(Boolean).map((t, i) => (
        <div key={i} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mr-2 text-[13px] text-blue-700 font-medium shadow-sm">
          <div className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`} />
          {t}
          <button 
            className="text-zinc-500 hover:text-zinc-300 ml-1"
            onClick={(e) => {
              e.stopPropagation();
              const newVal = value.split(',').map(email => email.trim()).filter(email => email !== t).join(', ');
              onChange(newVal);
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ));
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-200">
      <div
        className="w-[700px] bg-white border border-zinc-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between shrink-0 border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-zinc-900 tracking-tight leading-none mb-1.5">Compose message</h2>
              <p className="text-[12px] text-zinc-500 font-medium">Keyboard-centric draft window</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-zinc-500 text-[12px] font-medium font-mono">
            <button onClick={() => setShowCc(!showCc)} className={`hover:text-zinc-900 transition-colors tracking-wide ${showCc ? 'text-zinc-900 font-bold' : ''}`}>CC</button>
            <button onClick={() => setShowBcc(!showBcc)} className={`hover:text-zinc-900 transition-colors tracking-wide ${showBcc ? 'text-zinc-900 font-bold' : ''}`}>BCC</button>
            <button onClick={onClose} className="hover:text-zinc-900 transition-colors ml-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {error && (
            <div className="px-4 py-2 bg-red-900/50 text-red-300 text-xs border border-red-800/50 rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Recipients */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1 px-1 text-zinc-500">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold tracking-[0.15em]">RECIPIENTS</span>
            </div>
            
            <div className="flex items-center flex-wrap gap-y-2 bg-white border border-zinc-200 shadow-sm rounded-xl px-3 py-2 min-h-[44px] cursor-text" onClick={() => document.getElementById('compose-to')?.focus()}>
              <span className="text-[11px] font-bold text-zinc-400 mr-2 w-6">TO</span>
              {renderChips(to, setTo)}
              <input
                id="compose-to"
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 min-w-[150px] bg-transparent text-zinc-900 text-[13px] font-medium focus:outline-none placeholder:text-zinc-400"
                placeholder=""
              />
            </div>

            {showCc && (
              <div className="flex items-center flex-wrap gap-y-2 bg-white border border-zinc-200 shadow-sm rounded-xl px-3 py-2 min-h-[44px] cursor-text" onClick={() => document.getElementById('compose-cc')?.focus()}>
                <span className="text-[11px] font-bold text-zinc-400 mr-2 w-6">CC</span>
                {renderChips(cc, setCc)}
                <input
                  id="compose-cc"
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="flex-1 min-w-[150px] bg-transparent text-zinc-900 text-[13px] font-medium focus:outline-none placeholder:text-zinc-400"
                  placeholder=""
                />
              </div>
            )}

            {showBcc && (
              <div className="flex items-center flex-wrap gap-y-2 bg-white border border-zinc-200 shadow-sm rounded-xl px-3 py-2 min-h-[44px] cursor-text" onClick={() => document.getElementById('compose-bcc')?.focus()}>
                <span className="text-[11px] font-bold text-zinc-400 mr-2 w-6">BCC</span>
                {renderChips(bcc, setBcc)}
                <input
                  id="compose-bcc"
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  className="flex-1 min-w-[150px] bg-transparent text-zinc-900 text-[13px] font-medium focus:outline-none placeholder:text-zinc-400"
                  placeholder=""
                />
              </div>
            )}
          </div>

          {/* Message Area */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-3 px-1 text-zinc-500">
              <div className="flex items-center gap-2">
                <PenLine className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold tracking-[0.15em]">MESSAGE</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.1em] flex items-center gap-1.5 font-mono">
                <span className="font-sans text-[12px] opacity-80">⌘ ↵</span> TO SEND
              </span>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 min-h-0">
              <div className="bg-white border border-zinc-200 shadow-sm rounded-xl px-5 py-3 shrink-0">
                <input
                  id="compose-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-transparent text-zinc-900 text-[14px] font-bold focus:outline-none placeholder:text-zinc-400"
                  placeholder="Subject"
                />
              </div>
              
              <div 
                className="flex-1 bg-white border border-zinc-200 shadow-sm rounded-xl p-5 cursor-text overflow-y-auto flex flex-col"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    bodyRef.current?.focus();
                  }
                }}
              >
                <textarea
                  ref={bodyRef}
                  className="flex-1 outline-none text-zinc-800 text-[14px] bg-transparent resize-none placeholder:text-zinc-400 leading-relaxed"
                  placeholder="Write your message..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-200 bg-white text-zinc-500 shadow-sm text-[11px] font-mono font-medium tracking-wide">
            <span className="font-sans text-[13px] opacity-80">⌘ ↵</span> to send
          </div>

          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors text-[13px] font-medium">
              <Sparkles className="w-4 h-4" />
              AI assist
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6 py-2 rounded-full text-[13px] font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
