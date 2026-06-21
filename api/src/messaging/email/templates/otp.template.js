
export const otpEmailBody = (otp, user) => {

    const emailbody = `
<body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#111827;">

    <!-- Wrapper -->
    <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#111827;padding:18px 24px;text-align:center;">
        <h1 style="margin:0;font-size:18px;color:#ffffff;letter-spacing:1px;">
            SHOPMANDU
        </h1>

        <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">
            Account Verification
        </p>
        </div>

        <!-- Body -->
        <div style="padding:24px;">

        <p style="font-size:14px;margin:0 0 12px;">
            Hello <strong>${user.userName}</strong>,
        </p>

        <p style="font-size:14px;line-height:1.6;margin:0 0 22px;color:#374151;">
            Thank you for registering with <strong>SHOPMANDU</strong>.
            Use the verification code below to confirm your email address and activate your account.
        </p>

        <!-- OTP Box -->
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:24px;background:#f9fafb;text-align:center;">

            <p style="margin:0 0 10px;font-size:12px;color:#6b7280;letter-spacing:1px;text-transform:uppercase;">
            Verification Code
            </p>

            <div style="
            display:inline-block;
            background:#111827;
            color:#ffffff;
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            padding:14px 28px;
            border-radius:8px;
            ">
            ${otp}
            </div>

            <p style="margin:14px 0 0;font-size:12px;color:#dc2626;font-weight:bold;">
            ⏱ This code will expire in 5 minutes
            </p>

        </div>

        <!-- Security Notice -->
        <div style="
            margin-top:20px;
            padding:14px;
            background:#fffbeb;
            border-left:4px solid #f59e0b;
            border-radius:6px;
        ">

            <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
            <strong>Security Tip:</strong>
            SHOPMANDU will never ask for your OTP through phone calls, chat, or email.
            Never share this code with anyone. If you didn't request this verification,
            you may safely ignore this email.
            </p>

        </div>

        <!-- Sign Off -->
        <p style="margin-top:24px;font-size:14px;color:#374151;line-height:1.6;">
            Thanks for choosing <strong>SHOPMANDU</strong>.<br>
            <strong>The SHOPMANDU Team</strong>
        </p>

        </div>

        <!-- Footer -->
        <div style="background:#111827;color:#9ca3af;padding:14px;text-align:center;font-size:11px;">

        <p style="margin:0;">
            This is an automated message. Please do not reply to this email.
        </p>

        <p style="margin:4px 0 0;">
            © ${new Date().getFullYear()} SHOPMANDU • All rights reserved.
        </p>

        </div>

    </div>

</body>
`;

    return emailbody;
};
