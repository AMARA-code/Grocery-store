const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 4000;

// ── Supabase admin client (uses service-role key → bypasses RLS) ──
// Set these in your .env / environment variables — never commit them.
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

app.use(cors());
app.use(express.json());

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ── Simulated payment endpoint ────────────────────────────────
// Records the advance-payment attempt on the order.
// Revenue is NOT counted here — admin must verify first (see below).
app.post("/api/payments", async (req, res) => {
  const { orderId, name, email, amount, payerName, cnic, payerAccount } = req.body;

  if (!orderId || !name || !email || !amount || !payerName || !cnic || !payerAccount) {
    return res.status(400).json({ ok: false, message: "Missing required fields." });
  }

  const paymentId = `PAY-${Math.floor(Math.random() * 899999 + 100000)}`;

  // Store the transaction reference on the order so the admin can see it.
  // payment_verified stays FALSE — admin must confirm manually.
  if (supabase.supabaseUrl) {
    await supabase
      .from("orders")
      .update({
        transaction_id: paymentId,
        status: "processing",
        payment_verified: false     // explicitly false until admin approves
      })
      .eq("id", orderId);
  }

  return res.json({ ok: true, paymentId, orderId });
});

// ── Admin: verify advance payment → adds to revenue ──────────
// POST /api/admin/verify-payment  { orderId }
// Marks payment_verified = true on an advance order.
// The DB generated column `revenue_counted` becomes true automatically.
app.post("/api/admin/verify-payment", async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ ok: false, message: "orderId required." });

  const { error } = await supabase
    .from("orders")
    .update({
      payment_verified: true,
      status: "processing"          // move order along once payment confirmed
    })
    .eq("id", orderId)
    .eq("payment_method", "advance"); // safety: only works on advance orders

  if (error) {
    console.error("verify-payment error:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }

  return res.json({ ok: true, message: "Payment verified. Order now counts toward revenue." });
});

// ── Admin: mark COD delivered + cash received → adds to revenue ──
// POST /api/admin/mark-delivered  { orderId }
// Sets cash_collected = true and status = 'delivered'.
// The DB generated column `revenue_counted` becomes true automatically.
app.post("/api/admin/mark-delivered", async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ ok: false, message: "orderId required." });

  const { error } = await supabase
    .from("orders")
    .update({
      cash_collected: true,
      status: "delivered"
    })
    .eq("id", orderId)
    .eq("payment_method", "cod"); // safety: only works on COD orders

  if (error) {
    console.error("mark-delivered error:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }

  return res.json({ ok: true, message: "Order marked delivered. Cash revenue recorded." });
});

// ── Admin: revenue summary ────────────────────────────────────
// GET /api/admin/revenue
// Returns the revenue_summary view row.
app.get("/api/admin/revenue", async (_req, res) => {
  const { data, error } = await supabase
    .from("revenue_summary")
    .select("*")
    .single();

  if (error) {
    console.error("revenue error:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }

  return res.json({ ok: true, data });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});