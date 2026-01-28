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

    // Get order details with product info
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

    // Get product details if product_id exists
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
        JSON.stringify({ message: "Telegram not configured", configured: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format detailed message
    const orderDate = new Date(order.created_at).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = `🛒 *NEW ORDER RECEIVED!*
━━━━━━━━━━━━━━━━━━━━

📦 *Product Details:*
• Name: ${order.product_name}
• Quantity: ${order.quantity}
• Unit Price: $${productDetails?.price?.toFixed(2) || "N/A"}
• Total: *$${order.total_price?.toFixed(2) || "0.00"}*
${productDetails?.category ? `• Category: ${productDetails.category}` : ""}
${productDetails?.size ? `• Size: ${productDetails.size}` : ""}
${productDetails?.paper_type ? `• Paper: ${productDetails.paper_type}` : ""}

━━━━━━━━━━━━━━━━━━━━

👤 *Customer Information:*
• Name: ${order.customer_name}
• Contact: ${order.customer_contact}
${order.message ? `\n💬 *Customer Message:*\n"${order.message}"` : ""}

━━━━━━━━━━━━━━━━━━━━

📅 *Order Date:* ${orderDate}
🔖 *Order ID:* \`${order.id.slice(0, 8)}...\`
📊 *Status:* ${order.status?.toUpperCase() || "PENDING"}`;

    console.log("Sending Telegram message...");

    // If product has an image, send it with the caption
    if (productImage) {
      // Send photo with caption
      const photoUrl = `https://api.telegram.org/bot${telegram_bot_token}/sendPhoto`;
      const photoResponse = await fetch(photoUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegram_chat_id,
          photo: productImage,
          caption: message,
          parse_mode: "Markdown",
        }),
      });

      const photoResult = await photoResponse.json();
      console.log("Telegram photo response:", photoResult);

      if (!photoResponse.ok) {
        // If photo fails, fall back to text message
        console.log("Photo send failed, falling back to text message");
        await sendTextMessage(telegram_bot_token, telegram_chat_id, message);
      }
    } else {
      // Send text message only
      await sendTextMessage(telegram_bot_token, telegram_chat_id, message);
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

async function sendTextMessage(botToken: string, chatId: string, message: string) {
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  });

  const result = await response.json();
  console.log("Telegram text response:", result);

  if (!response.ok) {
    throw new Error(`Telegram API error: ${JSON.stringify(result)}`);
  }

  return result;
}