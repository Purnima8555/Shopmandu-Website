import { useMemo, useState } from "react";
import { Upload, ImageIcon, X, Minus, Plus, Info } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";


const RETURN_REASONS = [
    { value: "DEFECTIVE", label: "Defective product" },
    { value: "WRONG_ITEM", label: "Wrong item" },
    { value: "SIZE_ISSUE", label: "Size issue" },
    { value: "NOT_AS_DESCRIBED", label: "Not as described" },
    { value: "CHANGE_OF_MIND", label: "Changed my mind" },
    { value: "OTHER", label: "Other" },
];

export default function ReturnForm({
    order,
    orderItems,
    onSubmit,
    loading,
    onClose,
}) {

    const products = useMemo(() => {
        return orderItems.flatMap((vendorGroup) =>
            vendorGroup.products.map((product) => ({
                orderItemId: vendorGroup._id,
                vendorId: vendorGroup.vendorId._id,

                productId: product.productId._id,
                productName: product.productName,
                productImage: product.productImage,

                quantityBought: product.quantity,
                price: product.price,

                hasReturnRequest: product.hasReturnRequest,
                returnRequest: product.returnRequest,
            }))
        );
    }, [orderItems]);

    const [selectedProductId, setSelectedProductId] = useState("");

    const hasAvailableProducts = products.some(
        (product) => !product.hasReturnRequest
    );

    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState("CHANGE_OF_MIND");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    const selectedProduct = products.find(
        (p) => p.productId === selectedProductId
    );

    const handleImages = (e) => {
    const files = Array.from(e.target.files);

    const updatedImages = [...images, ...files];
    if (updatedImages.length > 4) {
        alert("Maximum 4 images.");
        return;
    }
    setImages(updatedImages);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!selectedProduct) {
            alert("Select a product.");
            return;
        }

        if (selectedProduct.hasReturnRequest) {
            alert("A return request has already been submitted for this product.");
            return;
        }

        const formData = new FormData();

        formData.append("orderId", order._id);
        formData.append("orderItemId", selectedProduct.orderItemId);
        formData.append("productId", selectedProduct.productId);
        formData.append("quantity", quantity);
        formData.append("reason", reason);
        formData.append("description", description);
        images.forEach((file) => formData.append("images", file));
        onSubmit(formData);
    };

    return (
        <Modal
            title="Request a return"
            onClose={onClose}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-7">

                {!hasAvailableProducts && (
                    <div className="flex items-center gap-3 rounded-xl border border-[#EFE1BE] bg-[#FBF6EA] px-4 py-3.5">
                        <Info size={16} className="shrink-0 text-[#B7893F]" />
                        <p className="text-sm text-[#6B6A63]">
                            A return request has already been submitted for
                            every product in this order.
                        </p>
                    </div>
                )}

                {/* Product */}

                <div>
                    <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-[#6B6A63]">
                        Select product
                    </span>

                    <div className="space-y-2.5">
                        {products.map((product) => {
                            const selected = product.productId === selectedProductId;
                            const disabled = product.hasReturnRequest;

                            return (
                                <label
                                    key={product.productId}
                                    className={`relative flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                                        disabled
                                            ? "cursor-not-allowed border-[#E7E3D8] opacity-50"
                                            : "cursor-pointer border-[#E7E3D8] hover:border-[#C9C4B4]"
                                        } ${selected
                                            ? "border-primary bg-primary/10"
                                            : "bg-card"}`}
                                            >
                                    <input
                                        type="radio"
                                        name="returnProduct"
                                        className="sr-only"
                                        checked={selected}
                                        disabled={disabled}
                                        onChange={() => {
                                            setSelectedProductId(product.productId);
                                            setQuantity(1);
                                        }}
                                    />

                                    <img
                                        src={product.productImage}
                                        alt={product.productName}
                                        className="h-16 w-16 shrink-0 rounded-xl border border-[#E7E3D8] object-cover"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <h4 className="truncate text-sm font-medium text-[#23241F]">
                                            {product.productName}
                                        </h4>
                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                            <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                                                Purchased {product.quantityBought}
                                            </span>
                                            <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-xs text-[#6B6A63]">
                                                Rs. {product.price}
                                            </span>
                                            {disabled && (
                                                <span className="rounded-full bg-[#F7EFDF] px-2 py-0.5 text-xs font-medium text-[#B7893F]">
                                                    Return requested
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                            selected
                                                ? "border-primary bg-primary"
                                                : "border-border"
                                                }`}
                                            >
                                        {selected && (
                                            <span className="h-2 w-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Quantity */}

                {selectedProduct && (
                    <div>
                        <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-[#6B6A63]">
                            Quantity to return
                        </span>

                        <div className="inline-flex items-center gap-4 rounded-xl border border-[#E7E3D8] px-4 py-2.5">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-[#23241F] transition-colors hover:bg-[#F1F0EC] disabled:opacity-30"
                            >
                                <Minus size={14} />
                            </button>

                            <span className="w-5 text-center text-sm font-semibold tabular-nums text-[#23241F]">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) =>
                                        Math.min(selectedProduct.quantityBought, q + 1)
                                    )
                                }
                                disabled={quantity >= selectedProduct.quantityBought}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-[#23241F] transition-colors hover:bg-[#F1F0EC] disabled:opacity-30"
                            >
                                <Plus size={14} />
                            </button>

                            <span className="text-xs text-[#6B6A63]">
                                of {selectedProduct.quantityBought} purchased
                            </span>
                        </div>
                    </div>
                )}

                {/* Reason */}

                <div>
                    <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-[#6B6A63]">
                        Reason (Choose one)
                    </span>

                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {RETURN_REASONS.map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setReason(r.value)}
                                className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                                    reason === r.value
                                        ? "border-primary bg-primary/10 text-gray"
                                        : "border-[#E7E3D8] text-[#23241F] hover:border-[#C9C4B4]"
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}

                <div>
                    <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-[#6B6A63]">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        className="w-full rounded-xl border border-[#E7E3D8] p-3.5 text-sm text-[#23241F] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="Tell us more about the issue..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Images */}

                <div>
                    <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-[#6B6A63]">
                        Photos (optional)
                    </span>

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#D8D4C8] bg-[#FCFBF9] p-6 text-sm text-[#6B6A63] transition-colors hover:border-primary hover:text-primary">
                        <Upload size={17} />
                        <span>Choose up to 4 images</span>

                        <input
                            hidden
                            multiple
                            type="file"
                            accept="image/*"
                            onChange={handleImages}
                        />
                    </label>

                    {images.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-full bg-[#F1F0EC] py-1.5 pl-3 pr-2 text-xs text-[#23241F]"
                                >
                                    <ImageIcon size={13} className="text-[#6B6A63]" />
                                    <span className="max-w-[140px] truncate">{image.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="flex h-4 w-4 items-center justify-center rounded-full text-[#6B6A63] hover:bg-[#E7E3D8] hover:text-[#23241F]"
                                    >
                                        <X size={11} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-[#E7E3D8] pt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        iconPosition="left"
                        onClick={handleSubmit}
                        disabled={!hasAvailableProducts || loading}
                    >
                        {loading ? "Submitting Request..." : "Submit Request"}
                    </Button>
                </div>

            </div>
        </Modal>
    );
}