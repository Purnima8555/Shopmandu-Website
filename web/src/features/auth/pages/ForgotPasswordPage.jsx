import { Link, useNavigate } from "react-router-dom";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { forgetPasswordApi } from "../../../api/auth.api";
import { showSuccess } from "../../../utils/toast";
import sendApiRequest from "../../../utils/sendApiRequest";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleForgetFormSubmit = async (data) => {
    const res = await sendApiRequest(() =>
      forgetPasswordApi({ email: data.email }),
    );
    if (!res) return;

    reset();
    showSuccess(
      res.message ||
        "If an account exists with this email, a password reset link has been sent.",
    );

    navigate("/forgot-password/sent", {
      state: {
        email: data.email,
      },
    });
  };

  return (
    <div className="min-h-[86vh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Forgot Password</h1>

        <p className="text-center mt-2 text-muted-foreground">
          Enter your email and we'll send a reset link.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(handleForgetFormSubmit)}
        >
          <Input
            type="email"
            label="Email Address"
            placeholder="example@gmail.com"
            required
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />

          <Button className="w-full cursor-pointer " type="submit">
            Send Reset Link
          </Button>
        </form>

        <p className="text-center mt-6 text-sm">
          <Link to="/login" className="text-primary">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
