// Edge Function de Supabase: envía por email la confirmación del pedido.
// Copia este archivo tal cual en el editor de Edge Functions del panel de
// Supabase (Edge Functions -> Create a new function -> "send-order-email").
// Necesita el secreto RESEND_API_KEY configurado en el proyecto.

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface RequestBody {
  email: string;
  orderCode: string;
  pickupTime: string;
  address: string;
  businessName: string;
  items: OrderItem[];
  total: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { email, orderCode, pickupTime, address, businessName, items, total } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Falta el email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const itemsHtml = (items ?? [])
      .map(
        (it) =>
          `<li>${it.quantity} × ${it.name} — ${(it.price * it.quantity).toFixed(2).replace('.', ',')} €</li>`
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #2A1E16;">
        <h2 style="color:#D42B00; margin-bottom: 4px;">${businessName}</h2>
        <p>Gracias por tu pedido. Aquí tienes los detalles:</p>
        <p><strong>Número de pedido:</strong> ${orderCode}</p>
        <p><strong>Hora de recogida:</strong> ${pickupTime}</p>
        <p><strong>Dirección de recogida:</strong> ${address}</p>
        <ul style="padding-left: 18px;">${itemsHtml}</ul>
        <p><strong>Total: ${Number(total).toFixed(2).replace('.', ',')} €</strong></p>
        <p style="margin-top: 24px; font-size: 13px; color: #6E5642;">
          Guarda este correo como justificante de tu pedido.
        </p>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${businessName} <onboarding@resend.dev>`,
        to: [email],
        subject: `Tu pedido ${orderCode} — ${businessName}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
