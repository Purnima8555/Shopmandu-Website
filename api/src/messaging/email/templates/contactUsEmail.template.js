export const contactUsEmail = (name, email, phone, message) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Contact Us Message</title>
</head>

<body style="margin:0;padding:40px 20px;background:#eef3f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1f2937;">

<div style="max-width:720px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,.12);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6a89a7,#4f6f90);padding:40px 35px;color:#ffffff;">

        <div style="display:inline-block;background:rgba(255,255,255,.15);padding:8px 14px;border-radius:50px;font-size:13px;font-weight:600;letter-spacing:.5px;">
            SHOPMANDU
        </div>

        <h1 style="margin:22px 0 10px;font-size:30px;font-weight:700;">
            📩 New Contact Message
        </h1>

        <p style="margin:0;font-size:16px;line-height:1.7;opacity:.95;">
            A customer has submitted a new inquiry through the
            <strong>Contact Us</strong> form.
        </p>

    </div>

    <!-- Body -->
    <div style="padding:35px;">

        <h2 style="margin:0 0 20px;font-size:22px;color:#111827;">
            Customer Information
        </h2>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">

            <tr>
                <td style="padding-bottom:18px;">

                    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:18px;">

                        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#6b7280;letter-spacing:.5px;">
                            Full Name
                        </div>

                        <div style="margin-top:8px;font-size:18px;font-weight:600;color:#111827;">
                            ${name}
                        </div>

                    </div>

                </td>
            </tr>

            <tr>
                <td style="padding-bottom:18px;">

                    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:18px;">

                        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#6b7280;">
                            Email Address
                        </div>

                        <div style="margin-top:8px;">
                            <a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-size:16px;">
                                ${email}
                            </a>
                        </div>

                    </div>

                </td>
            </tr>

            <tr>
                <td>

                    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:18px;">

                        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#6b7280;">
                            Phone Number
                        </div>

                        <div style="margin-top:8px;font-size:16px;font-weight:500;">
                            ${
                              phone
                                ? `<a href="tel:${phone}" style="color:#2563eb;text-decoration:none;">${phone}</a>`
                                : "Not Provided"
                            }
                        </div>

                    </div>

                </td>
            </tr>

        </table>

        <!-- Message -->

        <div style="margin-top:38px;">

            <h2 style="margin-bottom:18px;font-size:22px;color:#111827;">
                Customer Message
            </h2>

            <div style="
                background:#f9fbfd;
                border:1px solid #dbe5ef;
                border-left:6px solid #6a89a7;
                border-radius:12px;
                padding:24px;
                line-height:1.9;
                font-size:15px;
                color:#374151;
                white-space:pre-wrap;
                word-break:break-word;
            ">
                ${message}
            </div>

        </div>

        <!-- Quick Actions -->

        <div style="margin-top:40px;">

            <h2 style="margin-bottom:18px;font-size:22px;color:#111827;">
                Quick Actions
            </h2>

            <div style="
                background:#f8fafc;
                border:1px solid #e5e7eb;
                border-radius:12px;
                padding:22px;
            ">

                <p style="margin:0 0 14px;font-size:15px;line-height:1.8;">
                    Reply directly to the customer using the email below.
                </p>

                <a href="mailto:${email}"
                    style="
                        display:inline-block;
                        background:#6a89a7;
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 26px;
                        border-radius:10px;
                        font-weight:600;
                    ">
                    Reply to Customer
                </a>

            </div>

        </div>

    </div>

</div>

</body>
</html>
`;
};