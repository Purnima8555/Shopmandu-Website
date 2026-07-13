

export const ResetPasswordEmailbody = (link) => `
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
              Account Security
            </span>
          </td>
          <td align="right">
            <span style="background:#3b82f6;color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:12px;">
              PASSWORD RESET
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Banner -->
    <div style="background:#eff6ff;border-bottom:1px solid #dbeafe;padding:14px 24px;">
      <p style="margin:0;font-size:13px;color:#1e40af;">
        A password reset was requested for your account
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 24px;">

      <p style="margin:0 0 12px;font-size:15px;">
        Hello,
      </p>

      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4b5563;">
        We received a request to reset your <strong>SHOPMANDU</strong> password.
        Click below to continue.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin-bottom:20px;">
        <a href="${link}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;padding:13px 32px;border-radius:6px;">
          Reset Password
        </a>
      </div>

      <!-- Fallback -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-bottom:20px;background:#f9fafb;">
        <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">
          You can also reset password through this link:
        </p>
        <p style="margin:0;font-size:12px;word-break:break-all;">
          <a href="${link}" style="color:#2563eb;text-decoration:underline;">
            ${link}
          </a>
        </p>
      </div>

      <!-- Expiry -->
      <div style="border:1px solid #fde68a;border-radius:8px;padding:14px 18px;background:#fffbeb;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#92400e;">
          ⏱ This link expires in 15 minutes.
        </p>
      </div>

      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
        If you didn’t request this, ignore this email.
      </p>

    </div>

    <!-- Footer -->
    <div style="background:#111827;color:#9ca3af;padding:14px;text-align:center;font-size:11px;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        © ${new Date().getFullYear()} SHOPMANDU. All rights reserved.
      </p>
    </div>

  </div>

</body>
`;
