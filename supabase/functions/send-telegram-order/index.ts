import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { orderId } = await req.json();

    if (!orderId) {
      console.error("Missing orderId");
      return new Response(
        JSON.stringify({ error: "Missing orderId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing order:", orderId);

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get site settings for Telegram credentials
    const { data: settings, error: settingsError } = await supabase
      .from("site_settings")
      .select("telegram_bot_token, telegram_chat_id")
      .single();

    if (settingsError || !settings) {
      console.error("Settings not found:", settingsError);
      return new Response(
        JSON.stringify({ error: "Settings not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { telegram_bot_token, telegram_chat_id } = settings;

    if (!telegram_bot_token || !telegram_chat_id) {
      console.log("Telegram not configured, skipping notification");
      return new Response(
        JSON.stringify({ message: "Telegram not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format message
    const message = `🛒 *New Order Received!*

📦 *Product:* ${order.product_name}
🔢 *Quantity:* ${order.quantity}
💰 *Total:* $${order.total_price?.toFixed(2) || "0.00"}

👤 *Customer:* ${order.customer_name}
📞 *Contact:* ${order.customer_contact}
${order.message ? `\n💬 *Message:* ${order.message}` : ""}

📅 *Date:* ${new Date(order.created_at).toLocaleString()}`;

    console.log("Sending Telegram message...");

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegram_chat_id,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const telegramResult = await telegramResponse.json();
    console.log("Telegram response:", telegramResult);

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramResult);
      return new Response(
        JSON.stringify({ error: "Failed to send Telegram message", details: telegramResult }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order to mark Telegram as sent
    await supabase
      .from("orders")
      .update({ telegram_sent: true })
      .eq("id", orderId);

    console.log("Order notification sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
