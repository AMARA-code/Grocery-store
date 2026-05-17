export interface OrderConfirmationData {
  customerName: string;
  orderId: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: string;
  paymentMethod: string;
}

export function orderConfirmationTemplate(data: OrderConfirmationData): string {
  const itemRows = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#374151;font-size:14px;">
            ${item.name}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#374151;font-size:14px;text-align:center;">
            ×${item.quantity}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#374151;font-size:14px;text-align:right;">
            $${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>`
    )
    .join("");

  const paymentLabel =
    data.paymentMethod === "cod" ? "Cash on Delivery" : "Advance Payment";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed – FreshCart</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <div style="font-size:32px;margin-bottom:8px;">🛒</div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                FreshCart
              </h1>
              <p style="margin:6px 0 0;color:#fed7aa;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
                Order Confirmed
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">

              <!-- Greeting -->
              <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">
                Great news, ${data.customerName}! 🎉
              </h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
                Your order has been <strong style="color:#f97316;">confirmed</strong> by our team
                and is now being prepared for delivery. Thank you for shopping with FreshCart!
              </p>

              <!-- Order ID badge -->
              <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 18px;margin-bottom:28px;display:inline-block;width:100%;box-sizing:border-box;">
                <span style="color:#9a3412;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                  Order ID
                </span>
                <div style="color:#c2410c;font-size:15px;font-weight:700;margin-top:4px;font-family:monospace;">
                  #${data.orderId.slice(0, 8).toUpperCase()}
                </div>
              </div>

              <!-- Items table -->
              <h3 style="margin:0 0 12px;color:#111827;font-size:15px;font-weight:700;">
                📦 Your Items
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                      Product
                    </th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                      Qty
                    </th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
                <tfoot>
                  <tr style="background:#f9fafb;">
                    <td colspan="2" style="padding:12px;font-size:14px;font-weight:700;color:#111827;">
                      Total
                    </td>
                    <td style="padding:12px;font-size:16px;font-weight:800;color:#f97316;text-align:right;">
                      $${data.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <!-- Delivery info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="padding-right:8px;vertical-align:top;">
                    <div style="background:#f9fafb;border-radius:10px;padding:16px;">
                      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:6px;">
                        📍 Delivery Address
                      </div>
                      <div style="font-size:13px;color:#374151;line-height:1.5;">
                        ${data.shippingAddress}
                      </div>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:8px;vertical-align:top;">
                    <div style="background:#f9fafb;border-radius:10px;padding:16px;">
                      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:6px;">
                        💳 Payment Method
                      </div>
                      <div style="font-size:13px;color:#374151;font-weight:600;">
                        ${paymentLabel}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- What's next -->
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
                <div style="font-size:13px;font-weight:700;color:#15803d;margin-bottom:8px;">
                  ✅ What happens next?
                </div>
                <ul style="margin:0;padding-left:18px;color:#166534;font-size:13px;line-height:1.8;">
                  <li>Our team is packing your fresh items</li>
                  <li>You'll receive a delivery update soon</li>
                  <li>Estimated delivery: <strong>1–3 business days</strong></li>
                </ul>
              </div>

              <!-- Support note -->
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;line-height:1.6;">
                Questions? Reply to this email and we'll help you out.<br/>
                Thank you for choosing <strong style="color:#f97316;">FreshCart</strong> 🥦
              </p>

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
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}