import { FiX } from "react-icons/fi";
import { QuantitySelector } from "./QuantitySelector";

export const CartItemRow = ({ item, onIncrease, onDecrease, onRemove }) => (
  <div className="py-5 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center">
    {/* Product */}
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-card border border-border flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onRemove(item.productId, item.color, item.size)}
          aria-label={`Remove ${item.name}`}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center cursor-pointer"
        >
          <FiX size={12} />
        </button>
      </div>
      <div>
        <p className="font-medium text-foreground">{item.name}</p>
        {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
        {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
      </div>
    </div>

    {/* Price */}
    <div className="flex items-center justify-between md:block">
      <span className="text-sm text-muted-foreground md:hidden">Price</span>
      <span className="text-foreground">${item.price.toFixed(2)}</span>
    </div>

    {/* Quantity */}
    <div className="flex items-center justify-between md:block">
      <span className="text-sm text-muted-foreground md:hidden">Quantity</span>
      <QuantitySelector
        quantity={item.quantity}
        onDecrease={() => onDecrease(item.productId, item.color, item.size)}
        onIncrease={() => onIncrease(item.productId, item.color, item.size)}
      />
    </div>

    {/* Total */}
    <div className="flex items-center justify-between md:justify-end">
      <span className="text-sm text-muted-foreground md:hidden">Total</span>
      <span className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  </div>
);
