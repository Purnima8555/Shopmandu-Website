import { Link, useLocation } from "react-router-dom";
import Button from "../../components/ui/Button";

const ForgotPasswordSentPage = () => {
  const { state } = useLocation();

    const email = state?.email;

  /// email not provide then return with message
  if (!email) {
    return (
      <div className="min-h-[88vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Email information not available
          </h1>

          <Link to="/forgot-password">
            <Button className="mt-4">Back</Button>
          </Link>
        </div>
      </div>
    );
  }
//// masked for email ham*****12@gmail.com;
const maskedEmail = email
  ? email.replace( /^(.{3})(.*)(.{2})(@.*)$/, (_, start, middle, lastTwo, domain) =>
        start + "*".repeat(middle.length) + lastTwo + domain): null;

  // console.log(`${emailPre}${star}${emailPost}`)
  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-lg">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-3xl font-bold">Check Your Email</h1>
        {maskedEmail && (
          <p className="mt-2 font-medium text-primary">
            {maskedEmail}
          </p>
        )}
        <p className="mt-3 text-muted-foreground">
          If an account exists with this email, we've sent instructions to reset
          your password Link.
        </p>

        <Link to="/login">
          <Button className="w-full mt-6">Back to Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordSentPage;
