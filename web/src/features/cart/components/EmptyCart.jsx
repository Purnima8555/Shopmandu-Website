import { FiShoppingBag } from "react-icons/fi";
import Button from "../../../components/ui/Button";

export const EmptyCart = ({ onBrowse }) => (
  <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 mx-auto rounded-full bg-primary-light flex items-center justify-center">
        <FiShoppingBag size={32} className="text-primary" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-foreground">Your cart is empty</h1>
      <p className="mt-2 text-muted-foreground">
        Looks like you haven't added anything yet. Start exploring our products.
      </p>
      <Button className="mt-6 cursor-pointer" onClick={onBrowse}>
        Browse Products
      </Button>
    </div>
  </div>
);