
export const orderEmailForSeller = (data) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#333;">

  <!-- Wrapper -->
  <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaeaea;box-shadow:0 2px 6px rgba(0,0,0,0.04);">

    <!-- Header -->
    <div style="background:#111827;padding:22px 24px;color:#fff;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <span style="font-size:18px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">
              SHOPMANDU
            </span>

            <span style="display:block;font-size:11px;color:#9ca3af;margin-top:2px;">
              Vendor Order Notification
            </span>
          </td>

          <td align="right">
            <span style="background:#22c55e;color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:12px;">
              NEW ORDER
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Banner -->
    <div style="background:#ecfdf5;border-bottom:1px solid #d1fae5;padding:14px 24px;">
      <p style="margin:0;font-size:13px;color:#065f46;">
        Order ID: <strong>#${data.orderNumber}</strong>
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 24px;">

      <p style="margin:0 0 12px;font-size:15px;">
        Hello <strong>${data.vendorName}</strong>,
      </p>

      <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#4b5563;">
        Great news! You've received a new order on <strong>SHOPMANDU</strong>.
        Please review the details below and prepare it for processing as soon as possible.
      </p>

      <!-- Order Summary -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;margin-bottom:18px;background:#f9fafb;">

        <h3 style="margin:0 0 14px;font-size:14px;color:#111827;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">
          Order Summary
        </h3>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Total Items:</strong> ${data.totalItems}
        </p>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Total Amount:</strong>
          <span style="font-weight:bold;">Rs. ${data.totalAmount}</span>
        </p>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Payment Status:</strong>

          <span style="
            background:${data.paymentStatus === "PAID" ? "#dcfce7" : "#fee2e2"};
            color:${data.paymentStatus === "PAID" ? "#16a34a" : "#dc2626"};
            font-weight:bold;
            font-size:12px;
            padding:3px 10px;
            border-radius:10px;
          ">
            ${data.paymentStatus}
          </span>
        </p>

        <p style="margin:6px 0;font-size:13px;">
          <strong>Order Type:</strong>
          ${formatPaymentMethod(data.orderType)}
        </p>

      </div>

      <!-- Shipping Box -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;">

        <h3 style="margin:0 0 14px;font-size:14px;color:#111827;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">
          Shipping Details
        </h3>

        <p style="margin:4px 0;font-size:13px;color:#374151;">
          ${data.shippingAddress.location}, ${data.shippingAddress.landmark || ""}
        </p>

        <p style="margin:4px 0;font-size:13px;color:#374151;">
          ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}
        </p>

        <p style="margin:8px 0 0;font-size:13px;color:#374151;">
          <strong>Phone:</strong> ${data.shippingAddress.mobile}
        </p>

      </div>

      <!-- Action Notice -->
      <div style="
        margin-top:18px;
        padding:12px;
        background:#fff7ed;
        border-left:4px solid #f97316;
        border-radius:6px;
        font-size:12px;
        color:#9a3412;
      ">
        Please ensure the order is processed and updated in your vendor dashboard promptly.
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#111827;color:#9ca3af;padding:14px;text-align:center;font-size:11px;">

      <p style="margin:0;">
        This is an automated notification from SHOPMANDU. Please do not reply to this email.
      </p>

      <p style="margin:4px 0 0;">
        © ${new Date().getFullYear()} SHOPMANDU • All rights reserved.
      </p>

    </div>

  </div>

</body>
`;

const formatPaymentMethod = (method = "") =>
  method
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
