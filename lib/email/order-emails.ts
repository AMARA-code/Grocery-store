// ─────────────────────────────────────────────────────────────────────────────
// Email templates for FreshCart order workflow
// ─────────────────────────────────────────────────────────────────────────────

export interface OrderEmailData {
  customerName:    string;
  orderId:         string;
  total:           number;
  originalTotal?:  number;
  discount?:       number;
  promoCode?:      string;
  items:           { name: string; quantity: number; price: number }[];
  shippingAddress: string;
  paymentMethod:   string;
  transactionId?:  string | null;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function pkrFormat(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency", currency: "PKR", maximumFractionDigits: 0,
  }).format(amount);
}

function itemRows(items: OrderEmailData["items"]) {
  return items.map((item) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;color:#374151;font-size:14px;">
        ${item.name}
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;color:#374151;font-size:14px;text-align:center;">
        ×${item.quantity}
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;color:#374151;font-size:14px;text-align:right;">
        ${pkrFormat(item.price * item.quantity)}
      </td>
    </tr>`).join("");
}

function discountRows(discount: number, originalTotal: number, promoCode?: string) {
  if (!discount) return "";
  return `
    <tr>
      <td colspan="2" style="padding:8px 14px;font-size:13px;color:#9ca3af;">
        Original subtotal
      </td>
      <td style="padding:8px 14px;font-size:13px;color:#9ca3af;text-align:right;text-decoration:line-through;">
        ${pkrFormat(originalTotal)}
      </td>
    </tr>
    <tr style="background:#f0fdf4;">
      <td colspan="2" style="padding:8px 14px;font-size:13px;color:#16a34a;font-weight:600;">
        🎉 Promo ${promoCode ? `(${promoCode})` : "discount"} — 10% off
      </td>
      <td style="padding:8px 14px;font-size:13px;color:#16a34a;text-align:right;font-weight:600;">
        − ${pkrFormat(discount)}
      </td>
    </tr>
  `;
}

function emailShell(headerColor: string, headerEmoji: string, headerLabel: string, body: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>FreshCart</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${headerColor};border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">${headerEmoji}</div>
            <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">FreshCart</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;letter-spacing:1px;text-transform:uppercase;">
              ${headerLabel}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f3f4f6;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:11px;">
              © 2026 FreshCart · Fresh groceries delivered to your door
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. COD Order Confirmed
// ─────────────────────────────────────────────────────────────────────────────
export function codConfirmationTemplate(data: OrderEmailData): string {
  const hasDiscount = !!data.discount && !!data.originalTotal;

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">
      Your order is confirmed, ${data.customerName}! 🎉
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
      Great news! Your order has been <strong style="color:#16a34a;">confirmed</strong> by our team
      and is being prepared right now. Since you chose <strong>Cash on Delivery</strong>, please
      have <strong>${pkrFormat(data.total)}</strong> ready when your order arrives — same day delivery!
    </p>

    ${hasDiscount ? `
    <!-- Promo banner -->
    <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #86efac;border-radius:12px;padding:14px 18px;margin-bottom:20px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#15803d;font-weight:700;">
        🎉 You saved ${pkrFormat(data.discount!)} with code ${data.promoCode ?? "FRESH10"}!
      </p>
    </div>` : ""}

    <!-- Order ID -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
      <span style="color:#15803d;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order ID</span>
      <div style="color:#166534;font-size:15px;font-weight:700;margin-top:4px;font-family:monospace;">
        #${data.orderId.slice(0, 8).toUpperCase()}
      </div>
    </div>

    <!-- Bill / Items table -->
    <h3 style="margin:0 0 12px;color:#111827;font-size:15px;font-weight:700;">🧾 Your Bill</h3>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Item</th>
          <th style="padding:10px 14px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Qty</th>
          <th style="padding:10px 14px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows(data.items)}</tbody>
      <tfoot>
        ${hasDiscount ? discountRows(data.discount!, data.originalTotal!, data.promoCode) : ""}
        <tr style="background:#f0fdf4;">
          <td colspan="2" style="padding:12px 14px;font-size:14px;font-weight:700;color:#111827;">
            💵 Amount to Pay on Delivery
          </td>
          <td style="padding:12px 14px;font-size:16px;font-weight:800;color:#16a34a;text-align:right;">
            ${pkrFormat(data.total)}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Delivery info -->
    <div style="background:#f9fafb;border-radius:10px;padding:16px;margin-bottom:24px;">
      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;margin-bottom:6px;">📌 Delivery Address</div>
      <div style="font-size:13px;color:#374151;line-height:1.5;">${data.shippingAddress}</div>
    </div>

    <!-- What's next -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <div style="font-size:13px;font-weight:700;color:#1d4ed8;margin-bottom:8px;">📋 What happens next?</div>
      <ul style="margin:0;padding-left:18px;color:#1e40af;font-size:13px;line-height:1.9;">
        <li>Our team is packing your fresh items now</li>
        <li>You'll receive a shipment email once your order is on the way</li>
        <li>Delivery is <strong>same day</strong> — please be available</li>
        <li>Pay <strong>${pkrFormat(data.total)}</strong> in cash when it arrives</li>
      </ul>
    </div>

    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;">
      Questions? Reply to this email and we'll sort it out.<br/>
      Thank you for choosing <strong style="color:#16a34a;">FreshCart</strong> 🌿
    </p>
  `;

  return emailShell(
    "linear-gradient(135deg,#16a34a,#15803d)",
    "✅",
    "Order Confirmed",
    body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Advance Payment Confirmed
// ─────────────────────────────────────────────────────────────────────────────
export function advanceConfirmationTemplate(data: OrderEmailData): string {
  const hasDiscount = !!data.discount && !!data.originalTotal;

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">
      Payment confirmed, ${data.customerName}! 🎉
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
      We've verified your advance payment and your order is now
      <strong style="color:#7c3aed;">confirmed</strong>. Your groceries are being packed for
      <strong>same-day delivery</strong>. No payment needed at the door — you're all set!
    </p>

    ${hasDiscount ? `
    <!-- Promo banner -->
    <div style="background:linear-gradient(135deg,#faf5ff,#ede9fe);border:1px solid #c4b5fd;border-radius:12px;padding:14px 18px;margin-bottom:20px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#6d28d9;font-weight:700;">
        🎉 You saved ${pkrFormat(data.discount!)} with code ${data.promoCode ?? "FRESH10"}!
      </p>
    </div>` : ""}

    <!-- Order ID + TXN -->
    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
      <span style="color:#6d28d9;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order ID</span>
      <div style="color:#5b21b6;font-size:15px;font-weight:700;margin-top:4px;font-family:monospace;">
        #${data.orderId.slice(0, 8).toUpperCase()}
      </div>
      ${data.transactionId ? `
      <div style="margin-top:10px;">
        <span style="color:#6d28d9;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Transaction ID</span>
        <div style="color:#7c3aed;font-size:13px;font-family:monospace;margin-top:2px;">${data.transactionId}</div>
      </div>` : ""}
    </div>

    <!-- Receipt / Items table -->
    <h3 style="margin:0 0 12px;color:#111827;font-size:15px;font-weight:700;">🧾 Payment Receipt</h3>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Item</th>
          <th style="padding:10px 14px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Qty</th>
          <th style="padding:10px 14px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows(data.items)}</tbody>
      <tfoot>
        ${hasDiscount ? discountRows(data.discount!, data.originalTotal!, data.promoCode) : ""}
        <tr style="background:#faf5ff;">
          <td colspan="2" style="padding:12px 14px;font-size:14px;font-weight:700;color:#111827;">
            ✅ Amount Paid
          </td>
          <td style="padding:12px 14px;font-size:16px;font-weight:800;color:#7c3aed;text-align:right;">
            ${pkrFormat(data.total)}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Delivery info -->
    <div style="background:#f9fafb;border-radius:10px;padding:16px;margin-bottom:24px;">
      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;margin-bottom:6px;">📌 Delivery Address</div>
      <div style="font-size:13px;color:#374151;line-height:1.5;">${data.shippingAddress}</div>
    </div>

    <!-- What's next -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <div style="font-size:13px;font-weight:700;color:#1d4ed8;margin-bottom:8px;">📋 What happens next?</div>
      <ul style="margin:0;padding-left:18px;color:#1e40af;font-size:13px;line-height:1.9;">
        <li>Your payment has been verified ✔</li>
        <li>Our team is packing your fresh items now</li>
        <li>You'll receive a shipment email once your order is on the way</li>
        <li>Delivery is <strong>same day</strong> — no payment needed at the door</li>
      </ul>
    </div>

    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;">
      Keep this email as your receipt.<br/>
      Thank you for choosing <strong style="color:#7c3aed;">FreshCart</strong> 🌿
    </p>
  `;

  return emailShell(
    "linear-gradient(135deg,#7c3aed,#5b21b6)",
    "💜",
    "Payment Confirmed",
    body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Shipment Notification
// ─────────────────────────────────────────────────────────────────────────────
export function shipmentNotificationTemplate(data: OrderEmailData): string {
  const isCod = data.paymentMethod === "cod";

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">
      Your order is on its way, ${data.customerName}! 🚚
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
      Your groceries have just been dispatched and are heading to your door.
      ${isCod
        ? `Please have <strong>${pkrFormat(data.total)}</strong> ready in cash for the delivery person.`
        : "Your payment is already confirmed — no action needed at the door."}
    </p>

    <!-- Order ID -->
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
      <span style="color:#9a3412;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order ID</span>
      <div style="color:#c2410c;font-size:15px;font-weight:700;margin-top:4px;font-family:monospace;">
        #${data.orderId.slice(0, 8).toUpperCase()}
      </div>
    </div>

    <!-- Items summary -->
    <h3 style="margin:0 0 12px;color:#111827;font-size:15px;font-weight:700;">📋 What's in your delivery</h3>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Item</th>
          <th style="padding:10px 14px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Qty</th>
          <th style="padding:10px 14px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows(data.items)}</tbody>
      <tfoot>
        <tr style="background:#fff7ed;">
          <td colspan="2" style="padding:12px 14px;font-size:14px;font-weight:700;color:#111827;">Total</td>
          <td style="padding:12px 14px;font-size:16px;font-weight:800;color:#ea580c;text-align:right;">
            ${pkrFormat(data.total)}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Delivery address -->
    <div style="background:#f9fafb;border-radius:10px;padding:16px;margin-bottom:24px;">
      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;margin-bottom:6px;">📌 Delivering To</div>
      <div style="font-size:13px;color:#374151;line-height:1.5;">${data.shippingAddress}</div>
    </div>

    ${isCod ? `
    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:4px;">💵 Cash on Delivery Reminder</div>
      <p style="margin:0;color:#78350f;font-size:13px;line-height:1.6;">
        Please have <strong>${pkrFormat(data.total)}</strong> ready in cash when the delivery person arrives.
      </p>
    </div>` : `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <div style="font-size:13px;font-weight:700;color:#15803d;margin-bottom:4px;">✅ Payment Already Received</div>
      <p style="margin:0;color:#166534;font-size:13px;line-height:1.6;">
        Your advance payment of <strong>${pkrFormat(data.total)}</strong> has been confirmed.
        Nothing to pay at the door!
      </p>
    </div>`}

    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;">
      Questions? Reply to this email and we'll help right away.<br/>
      Thank you for shopping with <strong style="color:#ea580c;">FreshCart</strong> 🌿
    </p>
  `;

  return emailShell(
    "linear-gradient(135deg,#f97316,#ea580c)",
    "🚚",
    "Order Shipped",
    body
  );
}