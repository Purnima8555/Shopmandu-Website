
export const orderConfirmationEmail = (data) => `
<body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">

  <!-- Wrapper -->
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#111827;padding:18px 24px;text-align:center;">
      <h1 style="margin:0;font-size:18px;color:#ffffff;letter-spacing:1px;">
        SHOPMANDU
      </h1>
      <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">
        Order Confirmation
      </p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">

      <p style="font-size:14px;margin:0 0 12px;">
        Hi <strong>${data.customerName}</strong>,
      </p>

      <p style="font-size:14px;line-height:1.6;margin:0 0 18px;color:#374151;">
        Thank you for shopping with <strong>SHOPMANDU</strong>. Your order has been successfully placed and is now being processed.
      </p>

      <!-- Order Box -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:#f9fafb;font-size:13px;">

        <p style="margin:6px 0;">
          <strong>Order ID:</strong> ${data.orderNumber}
        </p>

        <p style="margin:6px 0;">
          <strong>Items:</strong> ${data.totalItems}
        </p>

        <p style="margin:6px 0;">
          <strong>Total Amount:</strong> <span style="font-weight:bold;">Rs. ${data.totalAmount}</span>
        </p>

        <p style="margin:6px 0;">
          <strong>Payment Method:</strong> ${formatPaymentMethod(data.paymentMethod)}
        </p>

        <p style="margin:6px 0;">
          <strong>Payment Status:</strong>
          <span style="color:${data.paymentStatus === "PAID" ? "#16a34a" : "#dc2626"};font-weight:bold;">
            ${data.paymentStatus}
          </span>
        </p>

      </div>

      <!-- Address -->
      <div style="margin-top:18px;font-size:13px;line-height:1.6;">
        <p style="margin:0 0 6px;font-weight:bold;">Delivery Address</p>
        <p style="margin:0;color:#374151;">
          ${data.shippingAddress.location}, ${data.shippingAddress.landmark || ""}<br/>
          ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}
        </p>
      </div>

      <!-- Info -->
      <div style="margin-top:20px;padding:12px;background:#eff6ff;border-left:4px solid #3b82f6;font-size:12px;color:#1e3a8a;border-radius:6px;">
        You’ll receive updates when your order is packed, shipped, and out for delivery.
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#111827;color:#9ca3af;padding:14px;text-align:center;font-size:11px;">
      © ${new Date().getFullYear()} SHOPMANDU • All rights reserved
    </div>

  </div>

</body>
`;

const formatPaymentMethod = (method = "") =>
  method
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());