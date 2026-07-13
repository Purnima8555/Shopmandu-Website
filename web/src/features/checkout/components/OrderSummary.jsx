import Button from "../../../components/ui/Button";

export const OrderSummary = ({ items, subtotal, discount, onPlaceOrder, disabled }) => {
  const total = subtotal - discount;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between py-3 border-t border-border text-sm mt-4">
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
        <span className="text-foreground font-semibold text-lg">${total.toFixed(2)}</span>
      </div>

      <Button className="w-full mt-5 cursor-pointer" onClick={onPlaceOrder} disabled={disabled}>
        Place Order
      </Button>
    </div>
  );
};
