


export const welcomeEmailTemplate = (data) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#333;">

  <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">

    <!-- Header -->
    <div style="background:#111827;padding:20px;text-align:center;color:#fff;">
      <h2 style="margin:0;font-size:18px;">Welcome to ShopMandu </h2>
      <p style="margin:5px 0 0;font-size:13px;opacity:0.8;">
        Your account is ready
      </p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">

      <p style="font-size:15px;margin:0 0 12px;">
        Hi <strong>${data.userName}</strong>,
      </p>

      <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
        Welcome to <strong>ShopMandu</strong>! We're excited to have you on board.  
        You can now explore products, place orders, and enjoy a smooth shopping experience.
      </p>

      <!-- Quick Info Box -->
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:14px;font-size:13px;">

        <p style="margin:4px 0;"><strong>Email:</strong> ${data.email}</p>
        <p style="margin:4px 0;"><strong>Status:</strong> Active Account</p>

      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin-top:20px;">
        <a href="${data.appUrl}"
           style="background:#111827;color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:14px;display:inline-block;">
          Start Shopping
        </a>
      </div>

      <p style="font-size:12px;color:#6b7280;margin-top:20px;line-height:1.5;">
        If you did not create this account, you can safely ignore this email.
      </p>
    </div>

 

  </div>

</body>
`;
