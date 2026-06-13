


 export const ResetPasswordEmailbody = (link) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6; color: #333;">
      <h2 style="color: #111;">Reset Your Password</h2>
      <p>We received a request to reset your password.</p>
      <p> Click the button below to create a new password.</p>
      <a href="${link}"style="display: inline-block;padding: 12px 24px;background-color: #111;color: #fff;text-decoration: none;border-radius: 6px;font-weight: bold;margin: 15px 0;">
        Reset Password
      </a>
      <p>Or use this link:</p>
      <p>
        <a href="${link}" style="color: #2563eb; text-decoration: underline;">
          ${link}
        </a>
      </p>
      <p style="font-style: italic; color: #666;">
        This link will expire in 15 minutes.
      </p>
      <p style="margin-top: 30px;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  `