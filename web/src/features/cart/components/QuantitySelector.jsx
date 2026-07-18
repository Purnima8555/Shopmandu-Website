import { FiMinus, FiPlus } from "react-icons/fi";

export const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => (
  <div className="inline-flex items-center gap-2 border border-border rounded-lg px-2 py-1">
    <button
      type="button"
      onClick={onDecrease}
      disabled={quantity <= 1}
      className="w-6 h-6 flex items-center justify-center rounded-md text-foreground disabled:opacity-40 cursor-pointer hover:bg-surface"
      aria-label="Decrease quantity"
    >
      <FiMinus size={12} />
    </button>

    <span className="w-5 text-center text-sm">{quantity}</span>

    <button
      type="button"
      onClick={onIncrease}
      className="w-6 h-6 flex items-center justify-center rounded-md text-foreground cursor-pointer hover:bg-surface"
      aria-label="Increase quantity"
    >
      <FiPlus size={12} />
    </button>
  </div>
);