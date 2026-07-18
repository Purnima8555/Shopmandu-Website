import { useEffect, useState } from "react";
import { MapPin, Plus, MoreHorizontal, Edit2, Trash2,} from "lucide-react";

import useAddressStore from "../../../store/addressStore";
import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";
import AddAddress from "../components/AddAddress";

import sendApiRequest from "../../../utils/sendApiRequest";
import { showSuccess } from "../../../utils/toast";

function SectionHeading({ eyebrow, title, action }) {
    return (
        <div className="flex items-end justify-between mb-5">
            <div>
                {eyebrow && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        {eyebrow}
                    </p>
                )}

                <h2 className="text-xl font-semibold text-[#23241F]">
                    {title}
                </h2>
            </div>

            {action}
        </div>
    );
}

function AddressCard({ address, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative rounded-2xl border border-[#E7E3D8] bg-white p-5">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF0EC] text-primary">
                        <MapPin size={15} />
                    </span>

                    <span className="text-sm font-semibold text-[#23241F]">
                        {address.addressType}
                    </span>

                    {address.isDefault && (
                        <StatusBadge tone="neutral">
                            Default
                        </StatusBadge>
                    )}
                </div>

                <button
                    type="button"
                    className="cursor-pointer rounded-lg p-1 text-[#6B6A63] transition-colors hover:bg-gray-100 hover:text-[#23241F]"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Dropdown */}
            {showMenu && (
                <div className="absolute right-4 top-14 z-10 w-40 rounded-xl border border-[#E7E3D8] bg-white py-1 shadow-lg">
                    <button
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#23241F] hover:bg-gray-50"
                        onClick={() => {
                            onEdit(address);
                            setShowMenu(false);
                        }}
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>

                    <button
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
                        onClick={() => {
                            onDelete(address);
                            setShowMenu(false);
                        }}
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            )}

            <p className="text-sm text-[#23241F]">
                {address.location}
            </p>

            <p className="text-sm text-[#6B6A63]">
                {address.city}, {address.state}
            </p>

            {(address.landmark || address.pincode) && (
                <p className="text-sm text-[#6B6A63]">
                    {address.landmark}
                    {address.landmark && address.pincode && ", "}
                    {address.pincode}
                </p>
            )}

            <p className="mt-2 text-sm font-medium text-[#23241F]">
                {address.mobile}
            </p>
        </div>
    );
}

export default function MyAddresses() {
    const [showAddAddress, setShowAddAddress] = useState(false);

    // Address being edited
    const [editingAddress, setEditingAddress] = useState(null);

    const {
        addresses,
        loading,
        getAddresses,
        deleteAddress,
    } = useAddressStore();

    useEffect(() => {
        getAddresses();
    }, []);

    // Open modal in edit mode
    const handleEdit = (address) => {
        setEditingAddress(address);
        setShowAddAddress(true);
    };

    // Delete
    const handleDelete = async (address) => {
        const confirmed = window.confirm(
            `Delete your ${address.addressType} address?`
        );

        if (!confirmed) return;

        const res = await sendApiRequest(() =>
            deleteAddress(address._id)
        );

        if (!res) return;

        showSuccess("Address deleted successfully.");
    };

    return (
        <>
            <div>
                <SectionHeading
                    eyebrow="Delivery"
                    title="Saved addresses"
                    action={
                        <Button
                            variant="primary"
                            icon={Plus}
                            iconPosition="left"
                            iconsize={15}
                            onClick={() => {
                                setEditingAddress(null);
                                setShowAddAddress(true);
                            }}
                        >
                            Add Address
                        </Button>
                    }
                />

                {loading ? (
                    <p className="text-sm text-gray-500">
                        Loading addresses...
                    </p>
                ) : addresses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#E7E3D8] bg-white p-10 text-center">
                        <MapPin
                            className="mx-auto mb-4 text-gray-400"
                            size={40}
                        />

                        <h3 className="mb-2 text-lg font-semibold text-[#23241F]">
                            No saved addresses
                        </h3>

                        <p className="mb-6 text-sm text-[#6B6A63]">
                            Add your first delivery address to make checkout
                            faster.
                        </p>

                        <Button
                            icon={Plus}
                            iconPosition="left"
                            onClick={() => {
                                setEditingAddress(null);
                                setShowAddAddress(true);
                            }}
                        >
                            Add Address
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {addresses.map((address) => (
                            <AddressCard
                                key={address._id}
                                address={address}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showAddAddress && (
                <AddAddress
                    address={editingAddress}
                    onClose={() => {
                        setShowAddAddress(false);
                        setEditingAddress(null);
                    }}
                />
            )}
        </>
    );
}