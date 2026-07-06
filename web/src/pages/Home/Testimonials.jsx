import { FiRefreshCcw, FiShield } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCustomerServiceLine } from "react-icons/ri";
import TestimonialCard from "../../components/ui/TestimonialCard";

const Testimonials = () => {
  return (
    <section>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TestimonialCard icon={TbTruckDelivery} bacgroundColor="bg-blue-300" title="Free Shipping" slog="Free shipping on all orders over $100." />
        <TestimonialCard icon={FiRefreshCcw} bacgroundColor="bg-green-300" title="Return Policy" slog="You can return a product within 30 days." />
        <TestimonialCard icon={FiShield} bacgroundColor="bg-red-300" title="Secure Payment" slog="100% secure payment with trusted gateways." />
        <TestimonialCard icon={RiCustomerServiceLine} bacgroundColor="bg-purple-300" title="Customer Support" slog="Our customer Support is 24/7." />
      </div>
    </section>
  );
};
export default Testimonials;