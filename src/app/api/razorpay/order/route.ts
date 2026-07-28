import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

// Creates a Razorpay order. The amount is recomputed on the SERVER from the
// real product prices in Sanity (never trusted from the browser), so a tampered
// client can't change what is charged. Price-on-request items are ignored here
// (they go through WhatsApp/consultation, not online pay).
export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const ids = items.map((i: any) => i.id).filter(Boolean);
    const products = await client.fetch(
      `*[_type == "product" && id in $ids]{ "id": id, price, numericPrice, priceOnRequest }`,
      { ids }
    );
    const byId: Record<string, any> = Object.fromEntries(products.map((p: any) => [p.id, p]));

    let amountPaise = 0;
    for (const it of items) {
      const p = byId[it.id];
      if (!p || p.priceOnRequest) continue;
      const rupees =
        typeof p.numericPrice === 'number' && p.numericPrice > 0
          ? p.numericPrice
          : parseInt(String(p.price || '').replace(/[^\d]/g, ''), 10) || 0;
      const qty = Math.max(1, parseInt(String(it.quantity), 10) || 1);
      amountPaise += rupees * 100 * qty;
    }

    if (amountPaise <= 0) {
      return NextResponse.json({ error: 'Nothing payable in this order' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error('Razorpay keys missing from environment');
      return NextResponse.json({ error: 'Payment is not configured yet' }, { status: 500 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt: `rcpt_${Date.now()}` }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Razorpay order creation failed:', res.status, body);
      return NextResponse.json({ error: 'Could not start payment' }, { status: 502 });
    }

    const order = await res.json();
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error('Order route error:', err);
    return NextResponse.json({ error: 'Could not start payment' }, { status: 500 });
  }
}
