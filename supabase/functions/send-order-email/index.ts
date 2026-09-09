// Edge Function de Supabase: envía por email la confirmación del pedido.
// Copia este archivo tal cual en el editor de Edge Functions del panel de
// Supabase (Edge Functions -> Create a new function -> "send-order-email").
// Necesita el secreto RESEND_API_KEY configurado en el proyecto.
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automáticamente
// en toda Edge Function, no hace falta configurarlos a mano.
//
// El cliente solo manda el id del pedido: el resto de datos (email, hora de
// recogida, artículos, total, nombre y dirección del negocio) se leen aquí
// directamente de la base de datos con la service role key. Así el contenido
// del correo no se puede manipular ni inyectar HTML llamando a la función a
// mano, y solo se puede mandar el correo a la dirección que ya quedó
// guardada en ese pedido en concreto.

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Solo se reenvía la confirmación de pedidos recién creados, para que no se
// pueda usar la función como forma de reenviar correos a voluntad sobre
// pedidos antiguos simplemente adivinando su id.
const MAX_ORDER_AGE_MS = 15 * 60 * 1000;

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface RequestBody {
  orderId: number;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Función mal configurada' }, 500);
  }

  try {
    const body: RequestBody = await req.json();
    const orderId = Number(body.orderId);

    if (!Number.isFinite(orderId) || orderId <= 0) {
      return jsonResponse({ error: 'orderId inválido' }, 400);
    }

    const restHeaders = {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    };

    const [orderRes, businessRes] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=email,pickup_time,items,total,created_at`,
        { headers: restHeaders }
      ),
      fetch(`${SUPABASE_URL}/rest/v1/business_info?id=eq.1&select=name,address`, {
        headers: restHeaders,
      }),
    ]);

    if (!orderRes.ok || !businessRes.ok) {
      return jsonResponse({ error: 'No se pudo leer el pedido' }, 502);
    }

    const [order] = await orderRes.json();
    const [business] = await businessRes.json();

    if (!order || !order.email) {
      return jsonResponse({ error: 'Pedido no encontrado o sin email' }, 404);
    }

    const ageMs = Date.now() - new Date(order.created_at).getTime();
    if (ageMs > MAX_ORDER_AGE_MS) {
      return jsonResponse({ error: 'El pedido ya no admite reenvío de confirmación' }, 403);
    }

    const businessName = business?.name ?? 'Asador Pilar';
    const orderCode = `AP-${new Date().getFullYear()}-${String(orderId).padStart(4, '0')}`;
    const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

    const itemsHtml = items
      .map(
        (it) =>
          `<li>${escapeHtml(it.quantity)} × ${escapeHtml(it.name)} — ${(it.price * it.quantity)
            .toFixed(2)
            .replace('.', ',')} €</li>`
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #2A1E16;">
        <h2 style="color:#D42B00; margin-bottom: 4px;">${escapeHtml(businessName)}</h2>
        <p>Gracias por tu pedido. Aquí tienes los detalles:</p>
        <p><strong>Número de pedido:</strong> ${orderCode}</p>
        <p><strong>Hora de recogida:</strong> ${escapeHtml(order.pickup_time)}</p>
        <p><strong>Dirección de recogida:</strong> ${escapeHtml(business?.address ?? '')}</p>
        <ul style="padding-left: 18px;">${itemsHtml}</ul>
        <p><strong>Total: ${Number(order.total).toFixed(2).replace('.', ',')} €</strong></p>
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
        to: [order.email],
        subject: `Tu pedido ${orderCode} — ${businessName}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      return jsonResponse({ error: errText }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
