import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Since the domain is not verified, we must send TO the registered email address
    // using the onboarding@resend.dev sandbox sender.
    const { data, error } = await resend.emails.send({
      from: 'Maneesha Chandran <onboarding@resend.dev>',
      to: 'maneeshachandranweb@gmail.com', // The email used to register the Resend account
      subject: 'New Inner Circle Subscriber!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #4B272D; font-weight: normal; margin-bottom: 20px;">New Inner Circle Subscriber</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.5;">
            You have a new subscriber for The Inner Circle:
          </p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong style="font-size: 18px; color: #1a110e;">${email}</strong>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eaeaea; pt: 15px;">
            This email was sent securely from your Maneesha Chandran website.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
