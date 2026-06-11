import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 to prevent email enumeration
      return NextResponse.json({ message: 'If the email exists and is unverified, a new link has been sent.' }, { status: 200 });
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Invalidate old tokens for this identifier
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Generate new Verification Token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expiresAt,
      },
    });

    // Send Email via Resend
    const verifyLink = `${appUrl}/api/auth/verify?token=${token}`;
    
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'noreply@corsair.dev', 
        to: email,
        subject: 'Verify your email address (Resend)',
        html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`,
      });
    } else {
      console.log('Mock email sent (no RESEND_API_KEY):', verifyLink);
    }

    return NextResponse.json({
      message: 'Verification link resent.',
    }, { status: 200 });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
