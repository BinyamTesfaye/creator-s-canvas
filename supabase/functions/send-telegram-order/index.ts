// @ts-nocheck

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Escape MarkdownV2 special characters
function escapeMarkdown(text: string) {
  if (!text) return "";
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Missing orderId" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Create Supabase client (Edge runtime uses Deno.env)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // Get order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Get product details
    let productImage: string | null = null;
    let productDetails: any = null;

    if (order.product_id) {
      const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", order.product_id)
        .single();

      if (product) {
        productDetails = product;
        productImage = product.image_url;
      }
    }

    // Get Telegram settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("telegram_bot_token, telegram_chat_id")
      .single();

    if (!settings?.telegram_bot_token || !settings?.telegram_chat_id) {
      return new Response(
        JSON.stringify({ message: "Telegram not configured" }),
        { status: 200, headers: corsHeaders }
      );
    }

    const botToken = settings.telegram_bot_token;
    const chatId = settings.telegram_chat_id;

    const orderDate = new Date(order.created_at).toLocaleString("en-US");

    const message = `
🛒 *NEW ORDER RECEIVED*

━━━━━━━━━━━━━━━━━━

📦 *Product*
• *Name:* ${escapeMarkdown(order.product_name)}
• *Quantity:* ${order.quantity}
• *Unit Price:* $${productDetails?.price?.toFixed(2) || "N/A"}
• *Total:* *$${order.total_price?.toFixed(2) || "0.00"}*

━━━━━━━━━━━━━━━━━━

👤 *Customer*
• *Name:* ${escapeMarkdown(order.customer_name)}
• *Contact:* ${escapeMarkdown(order.customer_contact)}

${
  order.message
    ? `💬 *Note:*\n${escapeMarkdown(order.message)}`
    : ""
}

━━━━━━━━━━━━━━━━━━

📅 *Date:* ${escapeMarkdown(orderDate)}
🆔 *Order ID:* \`${escapeMarkdown(order.id.slice(0, 8))}\`
📊 *Status:* ${escapeMarkdown(order.status?.toUpperCase() || "PENDING")}

━━━━━━━━━━━━━━━━━━
🚀 Creator Canvas
`;

    await sendTelegram(botToken, chatId, message, productImage);

    // Mark as sent
    await supabase
      .from("orders")
      .update({ telegram_sent: true })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

async function sendTelegram(
  botToken: string,
  chatId: string,
  message: string,
  image?: string | null
) {
  const baseUrl = `https://api.telegram.org/bot${botToken}`;

  // Try sending image first
  if (image) {
    const photoResponse = await fetch(`${baseUrl}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: image,
        caption: message,
        parse_mode: "MarkdownV2",
      }),
    });

    if (photoResponse.ok) return;
  }

  // Fallback to text
  await fetch(`${baseUrl}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "MarkdownV2",
    }),
  });
}