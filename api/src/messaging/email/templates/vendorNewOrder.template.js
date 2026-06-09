


///
export const orderEmailForSeller = (data) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">

  <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #eaeaea;">

    <!-- Header -->
    <div style="background:#1f2937;padding:18px 24px;color:#fff;">
      <h2 style="margin:0;font-size:18px;"> New Order Received</h2>
      <p style="margin:6px 0 0;font-size:13px;opacity:0.85;">
        Order ID: ${data.orderNumber}
      </p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">

      <p style="margin:0 0 12px;font-size:14px;">
        Hello <strong>${data.vendorName}</strong>,
      </p>

      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;">
        Great news! You have received a new order. Please review the details below and prepare it for processing.
      </p>
      <!-- Order Summary Box -->
      <div style="border:1px solid #e5e7eb;border-radius:6px;padding:16px;margin-bottom:16px;background:#f9fafb;">

        <h3 style="margin:0 0 12px;font-size:14px;color:#111;">Order Summary</h3>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Total Items:</strong> ${data.totalItems}
        </p>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Total Amount:</strong> Rs. ${data.totalAmount}
        </p>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Payment Status:</strong>
          <span style="color:${data.paymentStatus === 'PAID' ? '#16a34a' : '#dc2626'};font-weight:bold;">
            ${data.paymentStatus}
          </span>
        </p>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Order Type:</strong> ${formatPaymentMethod(data.orderType)}
        </p>

      </div>

      <!-- Shipping Box -->
      <div style="border:1px solid #e5e7eb;border-radius:6px;padding:16px;">

        <h3 style="margin:0 0 12px;font-size:14px;color:#111;">Shipping Details</h3>

        <p style="margin:6px 0;font-size:13px;">
          ${data.shippingAddress.location}, ${data.shippingAddress.landmark}
        </p>

        <p style="margin:6px 0;font-size:13px;">
          ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}
        </p>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Phone:</strong> ${data.shippingAddress.mobile}
        </p>
      </div>
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