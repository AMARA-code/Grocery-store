export function reengagementTemplate(customerName: string): string {
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:700;">
      We miss you, ${customerName}! 🛒
    </h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.7;">
      It's been a while since your last order, and we just wanted to check in.
      Your favourite fresh groceries are still here — waiting to be delivered
      straight to your door, <strong>same day</strong>!
    </p>

    <!-- Visual highlight box -->
    <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:14px;padding:24px;margin-bottom:28px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">🥦🥛🍅🥚🍞</div>
      <p style="margin:0;color:#15803d;font-size:15px;font-weight:700;">
        Fresh produce · Daily essentials · Same-day delivery
      </p>
      <p style="margin:8px 0 0;color:#16a34a;font-size:13px;">
        Everything you need, delivered fresh to your door.
      </p>
    </div>

    <!-- Why come back -->
    <h3 style="margin:0 0 14px;color:#111827;font-size:15px;font-weight:700;">
      Here's what's waiting for you 👇
    </h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ["🚀", "Same-Day Delivery", "Order before noon, get it the same day."],
        ["🌿", "Always Fresh", "We source fresh produce daily — no stale stock."],
        ["💳", "Easy Payments", "Pay cash on delivery or advance — your choice."],
        ["🎯", "Wide Selection", "Vegetables, dairy, bakery & more in one place."],
      ].map(([emoji, title, desc]) => `
        <tr>
          <td style="padding:10px 0;vertical-align:top;width:40px;font-size:22px;">${emoji}</td>
          <td style="padding:10px 0 10px 8px;vertical-align:top;">
            <div style="font-size:13px;font-weight:700;color:#111827;">${title}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px;">${desc}</div>
          </td>
        </tr>
      `).join("")}
    </table>

    <!-- CTA Button -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-store.com"}/products"
        style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;text-decoration:none;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(22,163,74,0.35);">
        Shop Fresh Now →
      </a>
    </div>

    <!-- Soft note -->
    <div style="background:#f9fafb;border-radius:10px;padding:16px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.7;">
        You're receiving this because you're a valued FreshCart customer.<br/>
        If you no longer wish to receive these emails, simply reply with "unsubscribe".
      </p>
    </div>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>We miss you – FreshCart</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#15803d);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">💚</div>
            <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">FreshCart</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;letter-spacing:1px;text-transform:uppercase;">
              We Miss You
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            ${body}
          </td>
        </tr>
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