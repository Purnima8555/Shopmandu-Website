


export const orderConfirmationEmail = (data) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#333;">

  <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #eaeaea;">

    <!-- Header -->
    <div style="background:#111827;color:#fff;padding:16px 20px;">
      <h2 style="margin:0;font-size:16px;">Order Confirmed</h2>
      <p style="margin:4px 0 0;font-size:12px;opacity:0.8;">
        ${data.orderNumber}
      </p>
    </div>

    <!-- Body -->
    <div style="padding:20px;">

      <p style="margin:0 0 12px;font-size:14px;">
        Hi <strong>${data.customerName}</strong>, your order has been successfully confirmed.
      </p>

      <!-- Summary Box -->
      <div style="background:#f9fafb;border:1px solid #eee;border-radius:6px;padding:12px;font-size:13px;">

        <p style="margin:6px 0;">
          <strong>Items:</strong> ${data.totalItems}
        </p>

        <p style="margin:6px 0;">
          <strong>Total Amount:</strong> Rs. ${data.totalAmount}
        </p>

        <p style="margin:6px 0;">
        <strong>Payment Method:</strong> ${formatPaymentMethod(data.paymentMethod)}
        </p>

        <p style="margin:6px 0;">
        <strong>Payment Status:</strong>
        <span style="color:${data.paymentStatus === 'PAID' ? '#16a34a' : '#dc2626'};font-weight:bold;">
            ${data.paymentStatus}
        </span>
        </p>

      </div>

      <!-- Address -->
      <div style="margin-top:12px;font-size:13px;line-height:1.5;">
        <strong>Delivery Address</strong><br>
        ${data.shippingAddress.location}, ${data.shippingAddress.landmark}<br>
        ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}
      </div>

      <!-- Footer note -->
      <p style="margin-top:14px;font-size:12px;color:#666;">
        You’ll receive shipping updates once your order is dispatched.
      </p>

    </div>

  </div>

</body>
`;

/// remove _ from CASH_ON_DELIVERY
const formatPaymentMethod = (method = "") => {
    return method
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};