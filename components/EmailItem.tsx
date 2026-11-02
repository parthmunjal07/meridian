import { format, formatDistanceToNow, isThisYear, isToday } from 'date-fns';
import { Paperclip } from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  body: string;
  from: string;
  date: string;
  isRead: boolean;
  attachments?: Array<{
    filename?: string;
    name?: string;
  }>;
}

export default function EmailItem({
  email,
  isSelected,
  onSelect,
}: {
  email: Email;
  isSelected?: boolean;
  onSelect: () => void;
}) {
  // Extract name and initials
  const senderMatch = email.from.match(/^([^<]+)</);
  const senderName = senderMatch ? senderMatch[1].trim() : email.from;
  const initials =
    senderName
      .split(/\s+/)
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  // Format date
  const emailDate = new Date(email.date);
  const relativeTime = formatDistanceToNow(emailDate, { addSuffix: true })
    .replace('less than a minute ago', 'Just now')
    .replace(/^about /, '')
    .replace(/ minutes? ago$/, ' min ago');
  const timeString = isToday(emailDate)
    ? relativeTime
    : format(emailDate, isThisYear(emailDate) ? 'MMM d' : 'MMM d, yyyy');

  // Preview logic
  const previewText = email.body
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
  const attachments = (email.attachments || [])
    .map((attachment) => attachment.filename || attachment.name)
    .filter((name): name is string => Boolean(name));

  const avatarStyles = [
    'bg-mail-avatar-sand text-mail-avatar-sand-ink',
    'bg-mail-avatar-slate text-mail-avatar-slate-ink',
    'bg-mail-avatar-lilac text-mail-avatar-lilac-ink',
    'bg-mail-avatar-sage text-mail-avatar-sage-ink',
    'bg-mail-avatar-rose text-mail-avatar-rose-ink',
  ];
  const avatarIndex =
    [...senderName].reduce((total, character) => total + character.charCodeAt(0), 0) %
    avatarStyles.length;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`group grid w-full grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-mail-line px-4 py-4 text-left transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mail-primary sm:px-5 ${
        isSelected ? 'bg-mail-muted' : 'bg-mail-canvas hover:bg-mail-muted/70'
      }`}
    >
      <div
        aria-hidden="true"
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-bold tracking-[-0.02em] ${avatarStyles[avatarIndex]}`}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`truncate text-[13px] tracking-[-0.01em] ${email.isRead ? 'font-medium text-mail-primary' : 'font-semibold text-mail-primary'}`}
            >
              {senderName}
            </span>
            {!email.isRead && (
              <>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-mail-unread"
                />
                <span className="sr-only">Unread</span>
              </>
            )}
          </div>
          <span className="shrink-0 text-[11px] font-medium tabular-nums text-mail-secondary">
            {timeString}
          </span>
        </div>

        <p
          className={`mt-0.5 truncate text-[14px] tracking-[-0.01em] ${
            email.isRead ? 'font-medium text-mail-primary' : 'font-semibold text-mail-primary'
          }`}
        >
          {email.subject}
        </p>

        <p className="mt-1 truncate text-[12px] leading-5 text-mail-secondary">
          {previewText || 'No preview available'}
        </p>

        {attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {attachments.slice(0, 2).map((attachment) => (
              <span
                key={attachment}
                className="inline-flex h-7 max-w-[150px] items-center gap-1.5 rounded-lg border border-mail-line bg-mail-muted px-2 text-[10px] font-medium text-mail-primary"
              >
                <Paperclip className="h-3 w-3 shrink-0" />
                <span className="truncate">{attachment}</span>
              </span>
            ))}
            {attachments.length > 2 && (
              <span className="inline-flex h-7 items-center rounded-lg border border-mail-line bg-mail-muted px-2 text-[10px] font-semibold text-mail-primary">
                +{attachments.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
