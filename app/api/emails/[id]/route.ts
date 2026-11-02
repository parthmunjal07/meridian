import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/email.service';
import { requireRole } from '@/lib/rbac';

interface EmailRouteContext {
  params: Promise<{ id: string }>;
  user: { id: string };
}

export const GET = requireRole(
  [],
  async (_request: NextRequest, { params, user }: EmailRouteContext) => {
    try {
      const { id } = await params;
      const email = await EmailService.getEmail(user.id, id);
      return NextResponse.json({ email });
    } catch (error) {
      console.error('Error fetching full email:', error);
      return NextResponse.json({ error: 'Unable to load the full email' }, { status: 502 });
    }
  }
);
