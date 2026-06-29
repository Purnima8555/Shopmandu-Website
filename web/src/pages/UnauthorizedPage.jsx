
import { FiLock, FiArrowLeft } from "react-icons/fi";
import Button from "../components/ui/Button";

const UnauthorizedPage = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-16 bg-background">
      <div className="max-w-2xl w-full text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-primary-light flex items-center justify-center">
          <FiLock size={42} className="text-primary" />
        </div>

        <h1 className="mt-8 text-7xl font-black text-primary leading-none">
          403
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-foreground">
          Access Denied
        </h2>

        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Sorry, you don't have permission to access this page. If you believe this is a mistake, please sign in with the appropriate account or contact support.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button icon={FiArrowLeft} iconPosition="left" iconsize={18} >Back to Home</Button>
        </div>

      </div>
    </section>
  );
};

export default UnauthorizedPage;