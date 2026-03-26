const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Simulated payment endpoint.
// In a real system you would call a payment gateway (Stripe, PayPal, JazzCash, etc.)
// and verify the transaction server-side. Here we simply accept the request and
// return success unless there is a server/network error.
app.post("/api/payments", (req, res) => {
  const { orderId, name, email, amount, payerName, cnic, payerAccount } = req.body;

  if (!orderId || !name || !email || !amount || !payerName || !cnic || !payerAccount) {
    return res.status(400).json({ ok: false, message: "Missing required fields." });
  }

  // Always mark payment as successful (no random failures here).
  // Any real failure will come from network/server issues instead.
  return res.json({
    ok: true,
    paymentId: `PAY-${Math.floor(Math.random() * 899999 + 100000)}`,
    orderId
  });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});

