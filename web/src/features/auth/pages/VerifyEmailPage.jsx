import { useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button";
import { resendEmailVerifyOtp } from "../../../api/auth.api";
import { dismissToast, showSuccess } from "../../../utils/toast";
import sendApiRequest from "../../../utils/sendApiRequest";
import useAuthStore from "../../../store/authStore";

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // get email from parameter
  const { state } = useLocation();
    const { verifyEmail } = useAuthStore();

  const email = state?.email;

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    const res = await sendApiRequest(() =>
      verifyEmail({
        email,
        otp: otpCode,
      }),
    );

    if (!res) return;

    setOtp(["", "", "", "", "", ""]);
    dismissToast();
    showSuccess(res.message || "Email verified successfully.");

    navigate("/login");
  };

  const handleResendOtp = async () => {
    const res = await sendApiRequest(() => resendEmailVerifyOtp({ email }));

    if (!res) return;

    dismissToast();
    showSuccess(res.message || "OTP resent successfully.");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">📧</div>

          <h1 className="text-3xl font-bold">Verify Your Email</h1>

          <p className="mt-3 text-muted-foreground">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className=" w-12 h-14 text-center text-xl font-semibold rounded-xl border border-border bg-card outline-none focus:border-primary focus:ring-2 focus:ring-primary-light "
              />
            ))}
          </div>

          <Button className="w-full" type="submit">
            Verify Email
          </Button>
        </form>

        <div className="mt-5 text-center flex items-center justify-around">
          <button
            type="button"
            className="text-[16px] text-primary cursor-pointer hover:underline"
            onClick={handleResendOtp}
          >
            Resend Code
          </button>

          <p className="text-center text-[16px]">
            <Link to="/login" className="text-primary">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
