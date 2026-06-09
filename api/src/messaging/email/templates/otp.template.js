

export const otpEmailBody = (otp, user) => {
    const emailbody = `
    <h4>Verify your ShopMandu account.</h4>
    <p>Dear, ${user.userName}</p>
    <p>
        Thank you for registering with <b>ShopMandu</b>.
        Use the OTP below to verify your email address.
    </p>
    <h2><u>${otp}</u></h2>
    <p><b>This code will expire in 5 minutes.</b></p>
    <p>
        If you did not request this email, you can safely ignore it.
    </p>
    <p>
        Thanks,<br>
        <b>The ShopMandu Rock Team</b>
    </p>

    `;
    return emailbody;
}
