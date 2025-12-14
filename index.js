const express = require("express");
 
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Haptags backend running");
});

app.post("/create-payment", (req, res) => {
  const orderId = "ORD" + Date.now();
  const data = {
    merchant_id: process.env.HDFC_MERCHANT_ID,
    order_id: orderId,
    amount: req.body.amount,
    currency: "INR",
    redirect_url: "https://haptags-backend.onrender.com/payment-response",
    cancel_url: "https://haptags-backend.onrender.com/payment-response",
  };
  const checksum = crypto
    .createHash("sha256")
    .update(Object.values(data).join("|") + process.env.HDFC_WORKING_KEY)
    .digest("hex");
  res.json({ ...data, checksum });
});

app.post("/payment-response", (req, res) => {
  if (req.body.order_status === "Success") {
    res.redirect("https://haptagslms.in/payment-success");
  } else {
    res.redirect("https://haptagslms.in/payment-failed");
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Backend running")
);
