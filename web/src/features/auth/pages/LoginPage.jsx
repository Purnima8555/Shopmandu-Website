import { Link, Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import PasswordInput from "../components/PasswordInput";
import useAuthStore from "../../../store/authStore";
import { useForm } from "react-hook-form";
import { generateGoogleOauthUrl } from "../../../api/auth.api";
// import Loader from "../../../components/common/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../schemas/auth.validation";
import { dismissToast, showSuccess } from "../../../utils/toast";
import sendApiRequest from "../../../utils/sendApiRequest";
import { useEffect } from "react";

const LoginPage = () => {
useEffect(() => {
  console.log("Login mounted");

  return () => {
    console.log("Login unmounted");
  };
}, []);

  //// handel from using react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  /// load login/loding store from zustance storage
  const { login, loading, isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }

  /// login form submit handler.
const loginHandelSubmit = async (data) => {
  const res = await sendApiRequest(() =>
    login({
      email: data.email,
      password: data.password,
    })
  );
  if (!res) return;
  reset();
  dismissToast();
  showSuccess("Login successful");
};



  const continueWithGoogle = async () => {
    const url = await generateGoogleOauthUrl();
    window.location.href = url;
  };

  // if (loading) {
  //   return <Loader fullScreen text="Signing you in..." />;
  // }

  return (
    <div className="min-h-[87vh] flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>

            <p className="mt-2 text-muted-foreground">Login to your account</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(loginHandelSubmit)}
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="example@gmail.com"
              required
              error={errors.email?.message}
              {...register("email")}
            />
            <PasswordInput
              label="Password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button className="w-full cursor-pointer" disabled={loading} type="submit">
               {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="flex items-center gap-2 my-6">
            <div className="h-px flex-1 bg-border"></div>

            <span className="text-sm text-muted-foreground">OR</span>

            <div className="h-px flex-1 bg-border"></div>
          </div>

          <button
            onClick={continueWithGoogle}
            className=" w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border hover:bg-surface transition cursor-pointer"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
