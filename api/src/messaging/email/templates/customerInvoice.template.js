export const customerInvoiceTemplate = (data) => {
    return `
    <body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
        <tr>
        <td align="center">
            <table width="650" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);">

            <!-- HEADER -->
            <tr>
                <td style="background:#111827;padding:28px 32px;">
                <table width="100%">
                    <tr>
                    <td>
                        <h1 style="margin:0;color:#fff;font-size:20px;letter-spacing:1px;">SHOPMANDU</h1>
                        <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">Invoice / Order Receipt</p>
                    </td>
                    <td align="right">
                        <p style="margin:0;color:#fff;font-size:14px;font-weight:bold;">#${data.orderNumber}</p>
                        <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">${data.orderStatus}</p>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>

            <!-- CUSTOMER INFO -->
            <tr>
                <td style="padding:28px 32px 0;">
                <table width="100%">
                    <tr>
                    <td>
                        <p style="margin:0;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Billed To</p>
                        <p style="margin:6px 0 0;font-size:14px;font-weight:bold;color:#111827;">${data.customerName}</p>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>

            <!-- ITEMS -->
            <tr>
                <td style="padding:20px 32px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
                    <tr style="background:#f9fafb;">
                    <th style="padding:10px;text-align:left;color:#6b7280;font-size:11px;text-transform:uppercase;">Product</th>
                    <th style="padding:10px;text-align:center;color:#6b7280;font-size:11px;text-transform:uppercase;">Qty</th>
                    <th style="padding:10px;text-align:right;color:#6b7280;font-size:11px;text-transform:uppercase;">Price</th>
                    <th style="padding:10px;text-align:right;color:#6b7280;font-size:11px;text-transform:uppercase;">Total</th>
                    </tr>
                    ${data.items
                        .map(
                        (item, i) => `
                    <tr style="border-bottom:1px solid #f0f0f0;background:${i % 2 === 0 ? "#ffffff" : "#fafafa"};">
                    <td style="padding:12px 10px;color:#111827;">${item.productName}</td>
                    <td style="padding:12px 10px;text-align:center;color:#374151;">${item.quantity}</td>
                    <td style="padding:12px 10px;text-align:right;color:#374151;">Rs ${item.price}</td>
                    <td style="padding:12px 10px;text-align:right;color:#111827;font-weight:bold;">Rs ${item.total}</td>
                    </tr>`,
                        )
                        .join("")}
                </table>
                </td>
            </tr>

            <!-- TOTAL + QR -->
            <tr>
                <td style="padding:24px 32px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                    <!-- QR VERIFY -->
                    <td width="45%" valign="top">
                        <table cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="border:1px solid #e5e7eb;border-radius:6px;padding:6px;">
                            <img src="${data.qr}" width="80" style="display:block;" />
                            </td>
                            <td style="padding-left:12px;vertical-align:middle;">
                            <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">Scan to<br/>check order</p>
                            </td>
                        </tr>
                        </table>
                    </td>

                    <td width="10%"></td>

                    <!-- TOTAL -->
                    <td width="45%" valign="top" align="right">
                        <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="border-top:2px solid #111827;padding-top:12px;text-align:right;">
                            <p style="margin:0;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Order Total</p>
                            <p style="margin:6px 0 0;font-size:22px;font-weight:bold;color:#111827;">Rs ${data.totalAmount}</p>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td style="background:#f9fafb;text-align:center;padding:18px;border-top:1px solid #eee;">
                <p style="margin:0;font-size:12px;color:#6b7280;">Thank you for shopping with <strong>SHOPMANDU</strong></p>
                <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">This is a system-generated invoice.</p>
                </td>
            </tr>

            </table>
        </td>
        </tr>
    </table>

</body>
`;
};
