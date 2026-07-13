import Button from "../../../components/ui/Button";

export const CartSummary = ({ subtotal, discount = 0, total, onCheckout }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-foreground mb-4">Cart Total</h2>

    <div className="flex justify-between py-3 border-b border-border text-sm">
      <span className="text-muted-foreground">Subtotal</span>
      <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
    </div>

    {discount > 0 && (
      <div className="flex justify-between py-3 border-b border-border text-sm">
        <span className="text-muted-foreground">Discount</span>
        <span className="text-primary font-medium">-${discount.toFixed(2)}</span>
      </div>
    )}

    <div className="flex justify-between py-3 border-b border-border text-sm">
      <span className="text-muted-foreground">Total</span>
      <span className="text-foreground font-semibold text-lg">${(total ?? subtotal).toFixed(2)}</span>
    </div>

    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      Shipping & taxes calculated at checkout
    </p>

    <Button className="w-full mt-5 cursor-pointer" onClick={onCheckout}>
      Proceed to Checkout
    </Button>
  </div>
);
