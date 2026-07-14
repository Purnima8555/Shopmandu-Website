
// ===================== KYC REJECTED =====================
export const kycRejectTemplate = (reason) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">

    <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaeaea;box-shadow:0 2px 6px rgba(0,0,0,0.04);">

        <!-- Header -->
        <div style="background:#111827;padding:22px 24px;color:#fff;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td>
                <span style="font-size:18px;font-weight:bold;letter-spacing:0.5px;color:#ffffff;">
                SHOPMANDU
                </span>
                <span style="display:block;font-size:11px;color:#9ca3af;margin-top:2px;">
                Vendor KYC Verification
                </span>
            </td>
            <td align="right">
                <span style="background:#dc2626;color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:12px;">
                REJECTED
                </span>
            </td>
            </tr>
        </table>
        </div>

        <!-- Banner -->
        <div style="background:#fef2f2;border-bottom:1px solid #fee2e2;padding:14px 24px;">
        <p style="margin:0;font-size:13px;color:#991b1b;">
            Your KYC verification request could not be approved
        </p>
        </div>

        <!-- Body -->
        <div style="padding:28px 24px;">
        <p style="margin:0 0 12px;font-size:15px;">
            Dear <strong>Vendor</strong>,
        </p>

        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#4b5563;">
            We've reviewed your submitted KYC documents. Unfortunately, we were unable to
            approve your verification request at this time.
        </p>

        <!-- Reason -->
        <div style="border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin-bottom:20px;background:#fef2f2;">
            <h3 style="margin:0 0 8px;font-size:13px;color:#991b1b;text-transform:uppercase;">
            Reason for Rejection
            </h3>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
            ${reason}
            </p>
        </div>

        <!-- Next steps -->
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:24px;background:#f9fafb;">
            <h3 style="margin:0 0 10px;font-size:14px;color:#111827;">
            What to do next
            </h3>
            <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">
            Please update your documents and resubmit your KYC request from the vendor dashboard.
            </p>
        </div>

        <div style="text-align:center;">
            <a href="#" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:6px;">
            Resubmit KYC
            </a>
        </div>

        </div>

        <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #eaeaea;">
        <p style="margin:0;font-size:11px;color:#9ca3af;">
            © ${new Date().getFullYear()} SHOPMANDU. All rights reserved.
        </p>
        </div>

    </div>

</body>
`;

// ===================== KYC APPROVED =====================
export const kycApproveTemplate = () => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">

    <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaeaea;box-shadow:0 2px 6px rgba(0,0,0,0.04);">

        <!-- Header -->
        <div style="background:#111827;padding:22px 24px;color:#fff;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td>
                <span style="font-size:18px;font-weight:bold;color:#fff;">SHOPMANDU</span>
                <span style="display:block;font-size:11px;color:#9ca3af;">Vendor KYC Verification</span>
            </td>
            <td align="right">
                <span style="background:#22c55e;color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:12px;">
                APPROVED
                </span>
            </td>
            </tr>
        </table>
        </div>

        <div style="background:#ecfdf5;padding:14px 24px;border-bottom:1px solid #d1fae5;">
        <p style="margin:0;font-size:13px;color:#065f46;">
            Your vendor account is now active
        </p>
        </div>

        <div style="padding:28px 24px;">
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#4b5563;">
            Your KYC verification has been successfully completed. You can now start selling on <strong>SHOPMANDU</strong>.
        </p>

        <div style="text-align:center;">
            <a href="#" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;padding:13px 32px;border-radius:6px;">
            Go to Dashboard →
            </a>
        </div>
        </div>

        <div style="background:#f9fafb;padding:16px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#9ca3af;">
            © ${new Date().getFullYear()} SHOPMANDU. All rights reserved.
        </p>
        </div>

    </div>

</body>
`;
