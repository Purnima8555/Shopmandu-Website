import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";
import { useForm } from "react-hook-form";
import { resetPasswordApi } from "../../api/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../schemas/auth.validation";
import { dismissToast, showError, showSuccess } from "../../utils/toast";

const ResetPasswordPage = () => {

    const [searchParams] = useSearchParams();
  
  const navigate = useNavigate()

  const id = searchParams.get("id");
  const token = searchParams.get("token");


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({resolver: zodResolver(resetPasswordSchema)});

 
  
  if(!id || !token){
    return <Navigate to={"/login"} replace />
  }

  /// reset password
  const handleResetFormSubmit = async (data) => {
    try {
      const res = await resetPasswordApi( {newPassword: data.password,}, id,token);
    //   console.log(res);
      reset();
      dismissToast()
      showSuccess(res?.message || "Password Reset succesfull")
    } catch (error) {
        dismissToast()
        showError(error?.response?.data?.message || "Something went wrong.")
      console.error(error?.response?.data?.message || error.message );
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Reset Password</h1>

        <p className="text-center mt-2 text-muted-foreground">
          Create a new password for your account.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(handleResetFormSubmit)}
        >
          <PasswordInput
            label="New Password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Confirm Password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button className="w-full cursor-pointer" onClick={()=>navigate("/login")} type="submit" >Update Password</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
