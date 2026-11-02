import type { MessagePart } from '@corsair-dev/gmail/types';

export interface GmailAttachment {
  filename: string;
  mimeType?: string;
  size?: number;
}

export interface GmailContent {
  body: string;
  bodyType: 'html' | 'text';
  attachments: GmailAttachment[];
}

function decodeBase64Url(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf8');
}

export function extractGmailContent(payload?: MessagePart, fallback = ''): GmailContent {
  const htmlBodies: string[] = [];
  const textBodies: string[] = [];
  const attachments: GmailAttachment[] = [];

  const visit = (part?: MessagePart) => {
    if (!part) return;

    if (part.filename) {
      attachments.push({
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body?.size,
      });
    } else if (part.body?.data) {
      try {
        const decoded = decodeBase64Url(part.body.data);
        if (part.mimeType === 'text/html') htmlBodies.push(decoded);
        if (part.mimeType === 'text/plain') textBodies.push(decoded);
      } catch (error) {
        console.warn('Unable to decode Gmail message part:', error);
      }
    }

    part.parts?.forEach(visit);
  };

  visit(payload);

  const html = htmlBodies.find((body) => body.trim().length > 0);
  if (html) return { body: html, bodyType: 'html', attachments };

  const text = textBodies.find((body) => body.trim().length > 0);
  return { body: text || fallback, bodyType: 'text', attachments };
}
