import { FiMapPin, FiEdit2 } from "react-icons/fi";

const addressTypeLabel = {
  HOME: "Home",
  OFFICE: "Office",
  BILLING: "Billing",
  SHOP: "Shop",
  PICKUP: "Pickup",
  OTHER: "Other",
};

export const AddressCard = ({ address, selected, onSelect, onEdit }) => (
  <button
    type="button"
    onClick={() => onSelect(address._id)}
    className={`w-full text-left rounded-xl border p-4 flex items-start gap-3 cursor-pointer transition-colors ${
      selected ? "border-primary bg-primary-light" : "border-border bg-card hover:bg-surface"
    }`}
  >
    <span
      className={`mt-1 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
        selected ? "border-primary" : "border-border"
      }`}
    >
      {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
    </span>

    <div className="flex-1">
      <div className="flex items-center gap-2">
        <FiMapPin size={14} className="text-primary" />
        <p className="font-medium text-foreground">
          {addressTypeLabel[address.addressType] || address.addressType}
        </p>
        {address.isDefault && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary">Default</span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{address.mobile}</p>
      <p className="text-sm text-muted-foreground">
        {address.location}, {address.city}, {address.state}
        {address.pincode ? ` - ${address.pincode}` : ""}
      </p>
      {address.landmark && (
        <p className="text-sm text-muted-foreground">Landmark: {address.landmark}</p>
      )}
    </div>

    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(address._id);
      }}
      className="text-muted-foreground hover:text-primary cursor-pointer"
      aria-label={`Edit ${addressTypeLabel[address.addressType] || address.addressType} address`}
    >
      <FiEdit2 size={14} />
    </span>
  </button>
);