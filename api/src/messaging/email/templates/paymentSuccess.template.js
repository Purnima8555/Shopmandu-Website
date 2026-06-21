
// ===================== CUSTOMER PAYMENT SUCCESS =====================
export const customerPaymentSuccessTemplate = (data) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">
    <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaeaea;">

        <!-- Header -->
        <div style="background:#111827;padding:24px;color:#fff;text-align:center;">
            <h1 style="margin:0;font-size:20px;">Payment Successful </h1>
            <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">
                Your order has been confirmed
            </p>
        </div>

        <!-- Body -->
        <div style="padding:28px 24px;">

            <p style="margin:0 0 14px;font-size:14px;">
                Hello <strong>${data.userName}</strong>,
            </p>

            <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#4b5563;">
                We’ve successfully received your payment. Your order is now confirmed and will be processed shortly.
            </p>

            <!-- Payment Summary -->
            <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:#f9fafb;">
                <p style="margin:0;font-size:13px;">
                    <strong>Order Number:</strong> ${data.orderNumber}
                </p>

                <p style="margin:8px 0 0;font-size:13px;">
                    <strong>Payment Method:</strong> ${data.paymentMethod}
                </p>

                <p style="margin:8px 0 0;font-size:13px;">
                    <strong>Total Paid:</strong> Rs. ${data.amount}
                </p>
            </div>

            <p style="margin:20px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
                You can view your order details anytime in your account dashboard.
            </p>

        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #eaeaea;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">
                © ${new Date().getFullYear()} SHOPMANDU. All rights reserved.
            </p>
        </div>

    </div>
</body>
`;

// ===================== VENDOR PAYMENT SUCCESS =====================
export const vendorPaymentSuccessTemplate = (data) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">
    <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaeaea;">

        <!-- Header -->
        <div style="background:#111827;padding:24px;color:#fff;text-align:center;">
            <h1 style="margin:0;font-size:20px;">New Paid Order </h1>
            <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">
                A customer has successfully placed an order
            </p>
        </div>

        <!-- Body -->
        <div style="padding:28px 24px;">

            <p style="margin:0 0 14px;font-size:14px;">
                Hello <strong>${data.vendorName}</strong>,
            </p>

            <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#4b5563;">
                Good news! A new paid order has been assigned to you. Please start processing it as soon as possible.
            </p>

            <!-- Order Summary -->
            <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:#f9fafb;">
                <p style="margin:0;font-size:13px;">
                    <strong>Order Number:</strong> ${data.orderNumber}
                </p>

                <p style="margin:8px 0 0;font-size:13px;">
                    <strong>Customer:</strong> ${data.customerName}
                </p>

                <p style="margin:8px 0 0;font-size:13px;">
                    <strong>Total Amount:</strong> Rs. ${data.amount}
                </p>
            </div>

            <p style="margin:20px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
                Please ensure timely fulfillment to maintain customer satisfaction.
            </p>

        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #eaeaea;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">
                © ${new Date().getFullYear()} SHOPMANDU. All rights reserved.
            </p>
        </div>

    </div>
</body>
`;
