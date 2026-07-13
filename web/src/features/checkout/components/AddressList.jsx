import { FiPlus } from "react-icons/fi";
import { AddressCard } from "./AddressCard";

export const AddressList = ({ addresses, selectedId, onSelect, onEdit, onAddNew }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-foreground mb-4">Delivery Address</h2>

    {addresses.length === 0 ? (
      <p className="text-sm text-muted-foreground">You don't have any saved addresses yet.</p>
    ) : (
      <div className="space-y-3">
        {addresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            selected={address._id === selectedId}
            onSelect={onSelect}
            onEdit={onEdit}
          />
        ))}
      </div>
    )}

    <button
      type="button"
      onClick={onAddNew}
      className="w-full mt-3 rounded-xl border border-dashed border-border p-4 flex items-center justify-center gap-2 text-sm text-primary hover:bg-surface cursor-pointer"
    >
      <FiPlus size={14} />
      Add New Address
    </button>
  </div>
);
