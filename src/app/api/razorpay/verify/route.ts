import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Verifies a completed Razorpay payment. The signature is an HMAC the browser
// cannot forge, so this is what proves the payment is real. On success we email
// Maneesha the order details (there's no admin dashboard, so this is how she
// learns a sale happened).
export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items } = await request.json();
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ valid: false, error: 'not configured' }, { status: 500 });

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Constant-time compare to avoid timing attacks
    const valid =
      expected.length === String(razorpay_signature).length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(razorpay_signature)));

    if (!valid) {
      console.error('Razorpay signature mismatch for order', razorpay_order_id);
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Best-effort: fetch the payment (for customer contact) + notify Maneesha.
    let payerLine = '';
    let amountLine = '';
    try {
      const keyId = process.env.RAZORPAY_KEY_ID!;
      const auth = Buffer.from(`${keyId}:${secret}`).toString('base64');
      const pr = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (pr.ok) {
        const pay = await pr.json();
        payerLine = `${pay.email || '—'} · ${pay.contact || '—'}`;
        if (typeof pay.amount === 'number') amountLine = `₹ ${(pay.amount / 100).toLocaleString('en-IN')}`;
      }
    } catch (e) {
      console.error('Could not fetch payment details:', e);
    }

    try {
      const itemsList = Array.isArray(items) && items.length
        ? items.map((i: any) => `- ${i.name || i.id}${i.quantity ? ` × ${i.quantity}` : ''}${i.size ? ` (Size: ${i.size})` : ''}`).join('<br/>')
        : '(items unavailable)';
      const isTest = (process.env.RAZORPAY_KEY_ID || '').startsWith('rzp_test_');
      await resend.emails.send({
        from: 'Maneesha Chandran <onboarding@resend.dev>',
        to: 'maneeshachandranweb@gmail.com',
        subject: `${isTest ? '[TEST] ' : ''}🎉 New Paid Order!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h2 style="color: #4B272D; font-weight: normal;">New Paid Order</h2>
            <p style="color:#333; font-size:16px;">A customer just paid online. Details:</p>
            <div style="background:#f9f9f9; padding:15px; border-radius:4px; margin:16px 0; color:#1a110e;">
              ${itemsList}
            </div>
            <p style="color:#333; margin:6px 0;"><strong>Amount:</strong> ${amountLine || '—'}</p>
            <p style="color:#333; margin:6px 0;"><strong>Customer:</strong> ${payerLine || '—'}</p>
            <p style="color:#333; margin:6px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
            <p style="color:#333; margin:6px 0;"><strong>Order ID:</strong> ${razorpay_order_id}</p>
          </div>
        `,
      });
    } catch (e) {
      console.error('Order-notification email failed (payment still valid):', e);
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error('Verify route error:', err);
    return NextResponse.json({ valid: false, error: 'verification failed' }, { status: 500 });
  }
}
