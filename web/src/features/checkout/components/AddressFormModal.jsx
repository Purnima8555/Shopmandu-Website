import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { addAddressApi, updateAddressApi } from "../../../api/address.api";

const ADDRESS_TYPES = ["HOME", "OFFICE", "BILLING", "SHOP", "PICKUP", "OTHER"];

const emptyForm = {
  addressType: "HOME",
  location: "",
  city: "",
  state: "",
  mobile: "",
  pincode: "",
  landmark: "",
  isDefault: false,
};

// address: pass an existing address object to edit, or null/undefined to add a new one
export const AddressFormModal = ({ isOpen, onClose, onSaved, address }) => {
  const isEditMode = Boolean(address?._id);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // reset the form whenever the modal opens (either fresh or with an address to edit)
  useEffect(() => {
    if (!isOpen) return;
    if (address) {
      setForm({
        addressType: address.addressType || "HOME",
        location: address.location || "",
        city: address.city || "",
        state: address.state || "",
        mobile: address.mobile || "",
        pincode: address.pincode || "",
        landmark: address.landmark || "",
        isDefault: address.isDefault || false,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [isOpen, address]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // basic client-side guard mirroring address.schema.js minimums
    if (form.location.trim().length < 3) return setError("Location must be at least 3 characters.");
    if (form.city.trim().length < 3) return setError("City must be at least 3 characters.");
    if (form.state.trim().length < 3) return setError("State must be at least 3 characters.");
    if (form.mobile.trim().length < 8) return setError("Mobile number must be at least 8 digits.");

    const payload = {
      addressType: form.addressType,
      location: form.location.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      mobile: form.mobile.trim(),
      isDefault: form.isDefault,
    };
    if (form.pincode.trim()) payload.pincode = form.pincode.trim();
    if (form.landmark.trim()) payload.landmark = form.landmark.trim();

    setSaving(true);
    try {
      const res = isEditMode
        ? await updateAddressApi(address._id, payload)
        : await addAddressApi(payload);

      onSaved?.(res?.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-lg p-6 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <FiX size={18} />
        </button>

        <h2 className="text-lg font-semibold text-foreground mb-4">
          {isEditMode ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Address Type</label>
            <select
              value={form.addressType}
              onChange={handleChange("addressType")}
              className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm"
            >
              {ADDRESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="text"
            placeholder="Location (e.g. Baudha)"
            value={form.location}
            onChange={handleChange("location")}
          />
          <Input type="text" placeholder="City" value={form.city} onChange={handleChange("city")} />
          <Input type="text" placeholder="State / Province" value={form.state} onChange={handleChange("state")} />
          <Input
            type="text"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange("mobile")}
          />
          <Input
            type="text"
            placeholder="Pincode (optional)"
            value={form.pincode}
            onChange={handleChange("pincode")}
          />
          <Input
            type="text"
            placeholder="Landmark (optional)"
            value={form.landmark}
            onChange={handleChange("landmark")}
          />

          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={handleChange("isDefault")}
              className="accent-primary"
            />
            Set as default address
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="w-full cursor-pointer" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="w-full cursor-pointer" disabled={saving}>
              {saving ? "Saving..." : isEditMode ? "Save Changes" : "Add Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
