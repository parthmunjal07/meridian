import DOMPurify from 'isomorphic-dompurify';
import useSWR from 'swr';
import {
  Archive,
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  MailOpen,
  Paperclip,
  Reply,
  Trash2,
  Video,
} from 'lucide-react';
import { format } from 'date-fns';

interface EmailAttachment {
  filename: string;
  mimeType?: string;
  size?: number;
}

interface EmailView {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string;
  cc?: string;
  date: string;
  bodyType?: 'html' | 'text';
  attachments?: EmailAttachment[];
}

interface EmailDetailResponse {
  email: EmailView;
}

export interface ReadingPaneProps {
  email: EmailView | null;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (id: string) => void;
  onClose?: () => void;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Unable to load full email');
  return response.json();
};

function formatFileSize(size?: number) {
  if (!size) return 'Attachment';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ReadingPane({
  email,
  onArchive,
  onDelete,
  onReply,
  onClose,
}: ReadingPaneProps) {
  const detailUrl =
    email && !email.id.startsWith('mock-') ? `/api/emails/${encodeURIComponent(email.id)}` : null;
  const { data: detailData, isLoading: isEmailLoading } = useSWR<EmailDetailResponse>(
    detailUrl,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (!email) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-mail-canvas px-8 text-center font-sans">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-mail-line bg-mail-muted text-mail-secondary">
          <MailOpen className="h-5 w-5" strokeWidth={1.6} />
        </div>
        <p className="mt-4 text-[14px] font-semibold text-mail-primary">Open a message</p>
        <p className="mt-1 max-w-48 text-[12px] leading-5 text-mail-secondary">
          Select an email to read its full contents.
        </p>
      </div>
    );
  }

  const detailedEmail = detailData?.email || email;
  const isHtmlEmail =
    detailedEmail.bodyType === 'html' || /<[a-z][\s\S]*>/i.test(detailedEmail.body);
  const sanitizedHtml = isHtmlEmail
    ? DOMPurify.sanitize(detailedEmail.body, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select'],
        FORBID_ATTR: ['srcdoc'],
      })
    : '';
  const emailDate = new Date(detailedEmail.date);
  const attachments = detailedEmail.attachments || [];

  const senderMatch = detailedEmail.from.match(/^([^<]+)<([^>]+)>/);
  const senderName = senderMatch ? senderMatch[1].trim() : detailedEmail.from;
  const senderEmail = senderMatch ? senderMatch[2].trim() : detailedEmail.from;
  const initials =
    senderName
      .split(/\s+/)
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const actionClassName =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-mail-secondary transition-colors hover:bg-mail-muted hover:text-mail-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mail-primary focus-visible:ring-offset-2';

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-mail-canvas font-sans text-mail-primary">
      <header className="flex min-h-16 shrink-0 items-center gap-3 border-b border-mail-line px-4 sm:px-6">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={actionClassName}
            aria-label="Back to inbox"
          >
            <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </button>
        )}

        <h1 className="min-w-0 flex-1 truncate text-[17px] font-semibold tracking-[-0.025em]">
          {detailedEmail.subject || '(No subject)'}
        </h1>
        <time
          dateTime={emailDate.toISOString()}
          className="shrink-0 text-[11px] font-medium tabular-nums text-mail-secondary"
        >
          {format(emailDate, 'd MMM yyyy, h:mm a')}
        </time>
      </header>

      <div className="flex shrink-0 items-start gap-3 border-b border-mail-line px-4 py-4 sm:px-6">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mail-avatar-sand text-[11px] font-semibold text-mail-avatar-sand-ink ring-1 ring-inset ring-mail-line"
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="truncate text-[14px] font-semibold tracking-[-0.015em]">
              {senderName}
            </span>
            {senderEmail !== senderName && (
              <span className="truncate text-[12px] text-mail-secondary">
                &lt;{senderEmail}&gt;
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-[11px] leading-4 text-mail-secondary">
            <span className="font-medium text-mail-primary">To:</span> {detailedEmail.to || 'Me'}
            {detailedEmail.cc && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="font-medium text-mail-primary">Cc:</span> {detailedEmail.cc}
              </>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5" aria-label="Email actions">
          <button
            type="button"
            onClick={() => onReply(email.id)}
            className={actionClassName}
            aria-label="Reply"
            title="Reply"
          >
            <Reply className="h-[17px] w-[17px]" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => onArchive(email.id)}
            className={actionClassName}
            aria-label="Archive"
            title="Archive"
          >
            <Archive className="h-[17px] w-[17px]" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(email.id)}
            className={actionClassName}
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 className="h-[17px] w-[17px]" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-mail-canvas">
        <article className="mx-auto flex min-h-full w-full max-w-[900px] flex-col">
          <div className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
            {isEmailLoading ? (
              <div className="space-y-3" role="status" aria-label="Loading full email">
                <div className="h-3.5 w-11/12 animate-pulse rounded bg-mail-muted motion-reduce:animate-none" />
                <div className="h-3.5 w-full animate-pulse rounded bg-mail-muted motion-reduce:animate-none" />
                <div className="h-3.5 w-4/5 animate-pulse rounded bg-mail-muted motion-reduce:animate-none" />
                <div className="h-32 w-full animate-pulse rounded-xl bg-mail-muted motion-reduce:animate-none" />
              </div>
            ) : isHtmlEmail ? (
              <div
                className="min-w-0 max-w-full overflow-x-auto text-[14px] leading-[1.65] text-mail-primary [&_a]:text-blue-700 [&_img]:h-auto [&_img]:max-w-full [&_table]:max-w-full"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            ) : (
              <div className="whitespace-pre-wrap break-words text-[14px] leading-[1.7] text-mail-primary">
                {detailedEmail.body}
              </div>
            )}
          </div>

          {!isEmailLoading && attachments.length > 0 && (
            <section
              aria-labelledby="attachment-heading"
              className="mx-4 mb-4 rounded-2xl border border-mail-line bg-mail-muted p-4 sm:mx-6 sm:mb-6"
            >
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-mail-secondary" strokeWidth={1.7} />
                <h2 id="attachment-heading" className="text-[12px] font-semibold text-mail-primary">
                  {attachments.length === 1 ? '1 attachment' : `${attachments.length} attachments`}
                </h2>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {attachments.map((attachment, index) => {
                  const Icon = attachment.mimeType?.startsWith('image/')
                    ? ImageIcon
                    : attachment.mimeType?.startsWith('video/')
                      ? Video
                      : FileText;

                  return (
                    <div
                      key={`${attachment.filename}-${index}`}
                      className="flex min-h-14 min-w-0 max-w-full items-center gap-3 rounded-xl border border-mail-line bg-mail-canvas px-3 py-2.5 shadow-[0_1px_1px_rgba(24,24,23,0.03)] sm:max-w-[260px]"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mail-muted text-mail-secondary">
                        <Icon className="h-4 w-4" strokeWidth={1.7} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-mail-primary">
                          {attachment.filename}
                        </p>
                        <p className="mt-0.5 text-[10px] text-mail-secondary">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </article>
      </div>
    </section>
  );
}
