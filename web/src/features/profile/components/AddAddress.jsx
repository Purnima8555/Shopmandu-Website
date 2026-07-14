import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Home,
    Building2,
    Receipt,
    Store,
    PackageCheck,
    MoreHorizontal,
    MapPin,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

import { addAddressSchema } from "../../../schemas/address.validation";
import useAddressStore from "../../../store/addressStore";

import sendApiRequest from "../../../utils/sendApiRequest";
import { showSuccess } from "../../../utils/toast";


const addressTypes = [
    { value: "HOME", label: "Home", icon: Home },
    { value: "OFFICE", label: "Office", icon: Building2 },
    { value: "BILLING", label: "Billing", icon: Receipt },
    { value: "SHOP", label: "Shop", icon: Store },
    { value: "PICKUP", label: "Pickup point", icon: PackageCheck },
    { value: "OTHER", label: "Other", icon: MoreHorizontal },
];

export default function AddAddress({
    address,
    onClose,
}) {

    const addAddress = useAddressStore((state) => state.addAddress);
    const updateAddress = useAddressStore((state) => state.updateAddress);
    const loading = useAddressStore((state) => state.loading);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(addAddressSchema),
        defaultValues: {
            addressType: "HOME",
            location: "",
            city: "",
            state: "",
            mobile: "",
            pincode: "",
            landmark: "",
            isDefault: false,
        },
    });

    useEffect(() => {
        if (address) {
            reset({
                addressType: address.addressType,
                location: address.location,
                city: address.city,
                state: address.state,
                mobile: address.mobile,
                pincode: address.pincode || "",
                landmark: address.landmark || "",
                isDefault: address.isDefault,
            });
        } else {
            reset({
                addressType: "HOME",
                location: "",
                city: "",
                state: "",
                mobile: "",
                pincode: "",
                landmark: "",
                isDefault: false,
            });
        }
    }, [address, reset]);

    const onSubmit = async (data) => {

        const res = address
            ? await sendApiRequest(() =>
                updateAddress(address._id, data)
            )
            : await sendApiRequest(() =>
                addAddress(data)
            );

        if (!res) return;

        showSuccess(
            address
                ? "Address updated."
                : "Address saved."
        );

        onClose();
    };

    return (
        <Modal
            title={address ? "Edit address" : "Add new address"}
            onClose={onClose}
            maxWidth="max-w-2xl"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
            >

                {/* Address type — chip selector */}

                <div>
                    <span className="mb-3 block text-xs font-medium tracking-wide uppercase text-[#6B6A63]">
                        Address type
                    </span>

                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                        {addressTypes.map(({ value, label, icon: Icon }) => (
                            <label
                                key={value}
                                className="relative cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    value={value}
                                    className="peer sr-only"
                                    {...register("addressType")}
                                />
                                <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#E7E3D8] bg-white px-2 py-3 text-center transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/10">
                                    <Icon
                                        size={17}
                                        className="text-[#6B6A63] peer-checked:text-primary"
                                        strokeWidth={2}
                                    />
                                    <span className="text-[11px] font-medium leading-tight text-[#23241F]">
                                        {label}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>

                    {errors.addressType && (
                        <p className="mt-2 text-sm text-[#B3543E]">
                            {errors.addressType.message}
                        </p>
                    )}
                </div>

                {/* Address */}

                <div>
                    <span className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase text-[#6B6A63]">
                        <MapPin size={13} /> Address
                    </span>

                    <div className="space-y-4">
                        <Input
                            label="Location"
                            placeholder="House number, street, area"
                            {...register("location")}
                            error={errors.location?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="City"
                                {...register("city")}
                                error={errors.city?.message}
                            />

                            <Input
                                label="State"
                                {...register("state")}
                                error={errors.state?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Pincode"
                                {...register("pincode")}
                                error={errors.pincode?.message}
                            />

                            <Input
                                label="Landmark (optional)"
                                {...register("landmark")}
                                error={errors.landmark?.message}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact */}

                <div>
                    <span className="mb-3 block text-xs font-medium tracking-wide uppercase text-[#6B6A63]">
                        Contact
                    </span>

                    <Input
                        label="Mobile number"
                        {...register("mobile")}
                        error={errors.mobile?.message}
                    />
                </div>

                {/* Default toggle */}

                <label className="flex items-center justify-between rounded-xl border border-[#E7E3D8] bg-[#FCFBF9] px-4 py-3.5 cursor-pointer">
                    <span>
                        <span className="block text-sm font-medium text-[#23241F]">
                            Set as default address
                        </span>
                        <span className="block text-xs text-[#6B6A63]">
                            Used automatically at checkout
                        </span>
                    </span>

                    <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            {...register("isDefault")}
                        />
                        <span className="absolute inset-0 rounded-full bg-[#E7E3D8] transition-colors peer-checked:bg-primary" />
                        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                    </span>
                </label>

                {/* Actions */}

                <div className="flex justify-end gap-3 border-t border-[#E7E3D8] pt-6">

                    <Button
                        variant="outline"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? address
                                ? "Updating..."
                                : "Saving..."
                            : address
                                ? "Update address"
                                : "Save address"}
                    </Button>

                </div>

            </form>
        </Modal>
    );
}