import { describe, expect, it } from 'vitest';
import { extractGmailContent } from '@/lib/gmail-message';

const encode = (value: string) => Buffer.from(value).toString('base64url');

describe('extractGmailContent', () => {
  it('prefers the HTML alternative and preserves attachments', () => {
    const result = extractGmailContent({
      mimeType: 'multipart/mixed',
      parts: [
        {
          mimeType: 'multipart/alternative',
          parts: [
            { mimeType: 'text/plain', body: { data: encode('Plain fallback') } },
            {
              mimeType: 'text/html',
              body: { data: encode('<table><tr><td>Rich email</td></tr></table>') },
            },
          ],
        },
        {
          mimeType: 'application/pdf',
          filename: 'invite.pdf',
          body: { attachmentId: 'attachment-1', size: 42 },
        },
      ],
    });

    expect(result).toEqual({
      body: '<table><tr><td>Rich email</td></tr></table>',
      bodyType: 'html',
      attachments: [{ filename: 'invite.pdf', mimeType: 'application/pdf', size: 42 }],
    });
  });

  it('falls back to plain text when no HTML part exists', () => {
    const result = extractGmailContent({
      mimeType: 'text/plain',
      body: { data: encode('Plain message') },
    });

    expect(result.body).toBe('Plain message');
    expect(result.bodyType).toBe('text');
  });
});
