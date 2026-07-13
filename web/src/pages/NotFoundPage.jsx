import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { GiAstronautHelmet } from "react-icons/gi";
import Button from "../components/ui/Button";

const NotFoundPage = () => {

  const navigate = useNavigate();

  const backToHome = () => navigate("/");
  const browseProduct = () => navigate("/products")
  

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-16 bg-background">
      <div className="max-w-2xl w-full text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-primary-light flex items-center justify-center">
          <GiAstronautHelmet size={42} className="text-primary" />
        </div>

        <h1 className="mt-8 text-8xl font-black text-primary leading-none">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-foreground">
          Oops! This page wandered off.
        </h2>

        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
          Let's get you back to discovering amazing products on ShopMandu.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="py-3 cursor-pointer" icon={FiArrowLeft} onClick={backToHome} >Back to Home</Button>
          <Button className="py-3 cursor-pointer border border-border bg-card font-medium hover:border-primary hover:text-primary transition-all " variant="ghost" onClick={browseProduct} >Browse Products</Button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;