const paymentOptions = [
  { id: "cod", label: "Cash on Delivery" },
  { id: "online", label: "Online Payment" },
];

export const PaymentMethodSelector = ({ selected, onSelect }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mt-6">
    <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>

    <div className="space-y-2">
      {paymentOptions.map((option) => (
        <label
          key={option.id}
          className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
            selected === option.id ? "border-primary bg-primary-light" : "border-border hover:bg-surface"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={option.id}
            checked={selected === option.id}
            onChange={() => onSelect(option.id)}
            className="accent-primary"
          />
          <span className="text-sm text-foreground">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);