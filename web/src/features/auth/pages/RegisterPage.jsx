import { Link, Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Selecter from "../../../components/ui/Selecter";
import PasswordInput from "../components/PasswordInput";
import { useForm } from "react-hook-form";
import Loader from "../../../components/common/Loader";
import useAuthStore from "../../../store/authStore";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../../schemas/auth.validation";
import {showSuccess } from "../../../utils/toast";
import sendApiRequest from "../../../utils/sendApiRequest";

const RegisterPage = () => {
  const { registerUser, loading, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const navigate = useNavigate();

  /// when user is alrady login then redirect to home page
  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }

  const registerHandelSubmit = async (data) => {
      const formData = new FormData();

      formData.append("userName", data.userName);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("password", data.password);
      formData.append("roles", data.roles);

      const res = await sendApiRequest(()=>registerUser(formData));

      if(!res) return;

      if (res?.success) {
        navigate(`/verify-email`, {
          state: {
            email: data.email,
          },
        });
      }

      showSuccess(res.message || "Account Created.");
      reset();
  
  };

  if (loading) {
    return <Loader fullScreen text="Creating your account..." />;
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Create Account
            </h1>

            <p className="mt-1 text-muted-foreground">Join ShopMandu today</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(registerHandelSubmit)}
          >
            <Input
              label="Full Name"
              placeholder="Enter your name"
              error={errors.userName?.message}
              {...register("userName")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="example@gmail.com"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Mobile Number"
              type="tel"
              placeholder="+977 98XXXXXXXX"
              error={errors.mobile?.message}
              {...register("mobile")}
            />

            <Selecter
              label="Role"
              error={errors.roles?.message}
              {...register("roles")}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="VENDOR">Vendor</option>
            </Selecter>

            <PasswordInput
              label="Password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button className="w-full cursor-pointer" type="submit">
              Create Account
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border"></div>

            <span className="text-sm text-muted-foreground">OR</span>

            <div className="h-px flex-1 bg-border"></div>
          </div>

          <button className=" w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border hover:bg-surface transition cursor-pointer">
            <FcGoogle size={24} />
            Continue with Google
          </button>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
