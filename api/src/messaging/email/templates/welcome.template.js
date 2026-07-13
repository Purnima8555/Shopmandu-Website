

export const welcomeEmailTemplate = (data) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">

  <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaeaea;box-shadow:0 2px 6px rgba(0,0,0,0.04);">

    <!-- Header -->
    <div style="background:#111827;padding:32px 24px;text-align:center;color:#fff;">

      <h1 style="margin:16px 0 6px;font-size:22px;">
        Welcome aboard, ${data.userName}! 
      </h1>

      <p style="margin:0;font-size:13px;color:#9ca3af;">
        Your account has been created successfully
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 24px;">

      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4b5563;">
        Hi <strong>${data.userName}</strong>, thanks for joining <strong>SHOPMANDU</strong>!
        We're thrilled to have you with us. Your account is now active and ready to go —
        here's a quick look at what you can do next.
      </p>

      <!-- Account Info -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:20px;background:#f9fafb;">

        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">

          <tr>
            <td style="padding:5px 0;color:#6b7280;">
              Email
            </td>

            <td style="padding:5px 0;text-align:right;font-weight:bold;color:#111827;">
              ${data.email}
            </td>
          </tr>

          <tr>
            <td style="padding:5px 0;color:#6b7280;">
              Status
            </td>

            <td style="padding:5px 0;text-align:right;">
              <span style="
                background:#dcfce7;
                color:#16a34a;
                font-weight:bold;
                font-size:12px;
                padding:3px 10px;
                border-radius:10px;
              ">
                Active
              </span>
            </td>
          </tr>

        </table>

      </div>

      <!-- Get Started -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;margin-bottom:24px;">

        <h3 style="margin:0 0 14px;font-size:14px;color:#111827;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">
          ✨ Get Started
        </h3>

        <p style="margin:0 0 10px;font-size:13px;color:#374151;line-height:1.6;">
          <strong>Browse products</strong> — explore thousands of items across every category.
        </p>

        <p style="margin:0 0 10px;font-size:13px;color:#374151;line-height:1.6;">
          <strong>Place orders</strong> — fast checkout with multiple payment options.
        </p>

        <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">
          <strong>Start selling</strong> — create your own store and turn your ideas into income.
        </p>

      </div>

      <!-- Button -->
      <div style="text-align:center;margin-bottom:8px;">

        <a
          href="${data.appUrl}"
          style="
            display:inline-block;
            background:#111827;
            color:#ffffff;
            text-decoration:none;
            font-size:14px;
            font-weight:bold;
            padding:13px 32px;
            border-radius:6px;
          "
        >
          Start Shopping →
        </a>

      </div>

    </div>

    <!-- Footer -->
    <div style="background:#111827;color:#9ca3af;padding:14px;text-align:center;font-size:11px;">

      <p style="margin:0;font-size:11px;color:#9ca3af;">
        If you did not create this account, you can safely ignore this email.
      </p>

      <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">
        © ${new Date().getFullYear()} SHOPMANDU • All rights reserved.
      </p>

    </div>

  </div>

</body>
`;
