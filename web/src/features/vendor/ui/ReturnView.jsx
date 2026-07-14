import {
    Calendar,
    Package,
    User,
    ClipboardList,
    ImageIcon,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";
import StatusBadge from "../../../components/ui/StatusBadge";

const reasonLabels = {
    DEFECTIVE: "Defective",
    WRONG_ITEM: "Wrong item",
    SIZE_ISSUE: "Size issue",
    NOT_AS_DESCRIBED: "Not as described",
    CHANGE_OF_MIND: "Change of mind",
    OTHER: "Other",
};

const statusTones = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "danger",
    REFUNDED: "info",
};

function InfoCard({ icon: Icon, title, children }) {
    return (
        <div className="rounded-2xl border border-[#E7E3D8] p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#23241F]">
                <Icon size={16} className="text-primary" />
                {title}
            </h3>
            {children}
        </div>
    );
}

const ReturnView = ({
    request,
    onClose,
}) => {

    if (!request) return null;

    const statusTone = statusTones[request.status] || "neutral";

    return (

        <Modal
            title="Return request"
            onClose={onClose}
            maxWidth="max-w-4xl"
        >

            <div className="space-y-6">

                {/* Header: requested date + status */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-[#6B6A63]">
                        <Calendar size={14} />
                        Requested {new Date(request.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>

                    <StatusBadge tone={statusTone}>
                        {request.status}
                    </StatusBadge>
                </div>

                {/* Product */}
                <InfoCard icon={Package} title="Product">
                    <div className="flex gap-5">
                        {request.productId?.images?.[0] ? (
                            <img
                                src={request.productId.images[0]}
                                alt={request.productId.name}
                                className="h-28 w-28 shrink-0 rounded-xl border border-[#E7E3D8] object-cover"
                            />
                        ) : (
                            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-[#E7E3D8] bg-[#F1F0EC] text-[#6B6A63]">
                                <Package size={28} />
                            </div>
                        )}

                        <div className="flex-1">
                            <h4 className="mb-3 text-base font-semibold text-[#23241F]">
                                {request.productId?.name || "Product"}
                            </h4>

                            <div className="grid grid-cols-3 gap-3 rounded-xl bg-[#FCFBF9] p-3.5">
                                <div>
                                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6B6A63]">
                                        Quantity
                                    </p>
                                    <p className="text-sm font-medium text-[#23241F]">
                                        {request.quantity}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6B6A63]">
                                        Unit price
                                    </p>
                                    <p className="text-sm font-medium text-[#23241F]">
                                        Rs. {request.unitPrice}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6B6A63]">
                                        Refund
                                    </p>
                                    <p className="text-sm font-semibold text-primary">
                                        Rs. {request.refundAmount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </InfoCard>

                {/* Customer + Timeline */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InfoCard icon={User} title="Customer">
                        <p className="text-sm text-[#23241F]">
                            {request.customerId?.userName || "—"}
                        </p>
                    </InfoCard>

                    <InfoCard icon={Calendar} title="Timeline">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#6B6A63]">Created</span>
                                <span className="text-[#23241F]">
                                    {new Date(request.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6B6A63]">Updated</span>
                                <span className="text-[#23241F]">
                                    {new Date(request.updatedAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </InfoCard>
                </div>

                {/* Reason */}
                <InfoCard icon={ClipboardList} title="Return reason">
                    <span className="mb-3 inline-block rounded-full bg-[#F7EFDF] px-3 py-1 text-xs font-medium text-[#B7893F]">
                        {reasonLabels[request.reason] || request.reason}
                    </span>
                    <p className="text-sm leading-relaxed text-[#6B6A63]">
                        {request.description || "No description provided."}
                    </p>
                </InfoCard>

                {/* Images */}
                <InfoCard icon={ImageIcon} title="Evidence">
                    {request.images?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {request.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt=""
                                    className="aspect-square rounded-xl border border-[#E7E3D8] object-cover transition hover:scale-105"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[#6B6A63]">
                            No evidence images were provided.
                        </p>
                    )}
                </InfoCard>
            </div>
        </Modal>
    );
};

export default ReturnView;