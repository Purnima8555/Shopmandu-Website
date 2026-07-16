import {
    Calendar,
    ClipboardList,
    ImageIcon,
    Package,
    User,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";

import useReturnStore from "../../../store/returnStore";
import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";

import {
    RETURN_STATUS,
    RETURN_STATUS_TRANSITIONS,
    STATUS_STYLES,
} from "../data";

const reasonLabels = {
    DEFECTIVE: "Defective",
    WRONG_ITEM: "Wrong item",
    SIZE_ISSUE: "Size issue",
    NOT_AS_DESCRIBED: "Not as described",
    CHANGE_OF_MIND: "Change of mind",
    OTHER: "Other",
};

function Field({ label, children }) {
    return (
        <div>
            <p className="mb-0.5 text-xs text-muted-foreground">
                {label}
            </p>

            <div className="text-sm text-foreground">
                {children}
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
                {title}
            </h3>

            {children}
        </section>
    );
}

const ReturnView = ({
    request,
    onClose,
}) => {
    const {
        approveReturnRequest,
        rejectReturnRequest,
        refundReturnRequest,
        getVendorReturnRequests,
    } = useReturnStore();

    if (!request) return null;

    const status =
        RETURN_STATUS[request.status] || {
            tone: "neutral",
            label: request.status,
        };

    const availableStatuses =
        RETURN_STATUS_TRANSITIONS[request.status] || [
            request.status,
        ];

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;

        if (newStatus === request.status) return;

        let res = null;

        if (newStatus === "APPROVED") {
            res = await sendApiRequest(() =>
                approveReturnRequest(request._id)
            );
        }

        if (newStatus === "REJECTED") {
            res = await sendApiRequest(() =>
                rejectReturnRequest(request._id)
            );
        }

        if (newStatus === "REFUNDED") {
            res = await sendApiRequest(() =>
                refundReturnRequest(request._id)
            );
        }

        if (res) {
            dismissToast();
            showSuccess("Return request updated successfully.");

            await getVendorReturnRequests();

            onClose();
        }
    };

    return (
        <Modal
            title="Return request"
            onClose={onClose}
            maxWidth="max-w-4xl"
        >
            <div className="space-y-6">

                {/* Return Information */}
                <Section title="Return information">

                    <div className="grid grid-cols-2 gap-4">

                        <Field label="Requested">
                            {new Date(
                                request.createdAt
                            ).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </Field>

                        <Field label="Status">
                            <div className="relative inline-block">
                                <select
                                    value={request.status}
                                    onChange={handleStatusChange}
                                    className={`inline-flex w-36 cursor-pointer items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium outline-none ${STATUS_STYLES[status.tone]}`}
                                >
                                    {availableStatuses.map((item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {RETURN_STATUS[item]?.label ??
                                                item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Field>

                    </div>

                </Section>

                {/* Product */}
                <Section title="Product">

                    <div className="flex gap-5">

                        {request.productId?.images?.[0] ? (
                            <img
                                src={request.productId.images[0]}
                                alt={request.productId.name}
                                className="h-28 w-28 shrink-0 rounded-xl border border-border object-cover"
                            />
                        ) : (
                            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-main">
                                <Package size={28} />
                            </div>
                        )}

                        <div className="flex-1">

                            <h4 className="mb-3 text-base font-semibold">
                                {request.productId?.name || "Product"}
                            </h4>

                            <div className="grid grid-cols-3 gap-3 rounded-xl bg-bg-main p-3">

                                <Field label="Quantity">
                                    {request.quantity}
                                </Field>

                                <Field label="Unit Price">
                                    Rs. {request.unitPrice}
                                </Field>

                                <Field label="Refund">
                                    <span className="font-semibold text-primary">
                                        Rs. {request.refundAmount}
                                    </span>
                                </Field>

                            </div>

                        </div>

                    </div>

                </Section>

                {/* Customer & Timeline */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    <Section title="Customer">

                        <Field label="Customer">
                            {request.customerId?.userName || "—"}
                        </Field>

                        <Field label="Email">
                            {request.customerId?.email || "—"}
                        </Field>

                    </Section>

                    <Section title="Timeline">

                        <Field label="Created">
                            {new Date(
                                request.createdAt
                            ).toLocaleString()}
                        </Field>

                        <Field label="Updated">
                            {new Date(
                                request.updatedAt
                            ).toLocaleString()}
                        </Field>

                    </Section>

                </div>
                                {/* Return Reason */}
                <Section title="Return reason">

                    <span className="mb-3 inline-block rounded-full bg-[#F7EFDF] px-3 py-1 text-xs font-medium text-[#B7893F]">
                        {reasonLabels[request.reason] || request.reason}
                    </span>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {request.description || "No description provided."}
                    </p>

                </Section>

                {/* Evidence */}
                <Section title="Evidence">

                    {request.images?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {request.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Evidence ${index + 1}`}
                                    className="aspect-square rounded-xl border border-border object-cover transition hover:scale-105"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No evidence images were provided.
                        </p>
                    )}

                </Section>

                {/* Metadata */}
                <Section title="Metadata">

                    <div className="grid grid-cols-2 gap-4">

                        <Field label="Request ID">
                            <span className="break-all font-mono">
                                {request._id}
                            </span>
                        </Field>

                        <Field label="Order Number">
                            <span className="break-all font-mono">
                                {request.orderId?.orderNumber || "—"}
                            </span>
                        </Field>

                    </div>

                </Section>

            </div>
        </Modal>
    );
};

export default ReturnView;