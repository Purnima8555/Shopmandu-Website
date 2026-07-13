import { CartItemRow } from "./CartItemRow";

export const CartItemList = ({ items, onIncrease, onDecrease, onRemove }) => (
  <div>
    {/* Table header — desktop only */}
    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 pb-3 mb-2 border-b border-border text-sm font-semibold text-foreground">
      <span>Product</span>
      <span>Price</span>
      <span>Quantity</span>
      <span className="text-right">Total</span>
    </div>

    <div className="divide-y divide-border">
      {items.map((item) => (
        <CartItemRow key={item.key} item={item} onIncrease={onIncrease} onDecrease={onDecrease} onRemove={onRemove} />
      ))}
    </div>
  </div>
);
