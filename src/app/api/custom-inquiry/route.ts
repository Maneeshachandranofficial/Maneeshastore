import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { whatsappNumber, customItems } = await request.json();

    if (!whatsappNumber || !customItems || customItems.length === 0) {
      return NextResponse.json(
        { error: 'WhatsApp number and custom items are required' },
        { status: 400 }
      );
    }

    const itemsList = customItems.map((item: any) => `- ${item.name} (Size: ${item.size || 'One Size'})`).join('<br/>');

    const { data, error } = await resend.emails.send({
      from: 'Maneesha Chandran <onboarding@resend.dev>',
      to: 'maneeshachandranweb@gmail.com',
      subject: 'New Custom Order Inquiry!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #4B272D; font-weight: normal; margin-bottom: 20px;">Custom Order Inquiry</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.5;">
            A customer is checking out a mixed cart and wants to inquire about the following custom pieces:
          </p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            ${itemsList}
          </div>
          <p style="color: #333; font-size: 16px; line-height: 1.5;">
            Please contact them at their WhatsApp Number:
          </p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong style="font-size: 18px; color: #1a110e;">${whatsappNumber}</strong>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Inquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
