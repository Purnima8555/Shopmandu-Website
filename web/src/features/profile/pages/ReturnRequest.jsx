import { useEffect, useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    Package,
    CheckCircle2,
    Circle,
    AlertTriangle,
} from "lucide-react";

import StatusBadge from "../../../components/ui/StatusBadge";
import useReturnStore from "../store/return.store";
import { filters, STATUS_CONFIG_RETURN, TIMELINE_STEPS } from "../data";
import { formatDate, prettyReason, prettyStatus, timelineIndex } from "../utils/profileHelpar";


function DetailField({ label, children }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6A63]">
                {label}
            </p>
            <div className="mt-1 text-[#23241F]">{children}</div>
        </div>
    );
}

function ReturnTimeline({ status }) {
    if (status === "REJECTED") {
        return (
            <div>
                <h4 className="mb-4 text-sm font-semibold text-[#23241F]">
                    Return progress
                </h4>
                <div className="flex items-center gap-3 rounded-2xl border border-[#EFD9D2] bg-[#FBF3F0] px-5 py-4">
                    <AlertTriangle size={18} className="shrink-0 text-[#B3543E]" />
                    <p className="text-sm text-[#6B6A63]">
                        This request was reviewed and{" "}
                        <span className="font-medium text-[#B3543E]">rejected</span>
                        . Reach out to support if you think this needs another look.
                    </p>
                </div>
            </div>
        );
    }

    const current = timelineIndex(status);

    return (
        <div>
            <h4 className="mb-5 text-sm font-semibold text-[#23241F]">
                Return progress
            </h4>

            <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                    const done = i < current;
                    const active = i === current;
                    const isLast = i === TIMELINE_STEPS.length - 1;

                    return (
                        <div key={step.key} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                {done || active ? (
                                    <CheckCircle2
                                        size={18}
                                        className={done || active ? "text-primary" : "text-[#D8D4C8]"}
                                    />
                                ) : (
                                    <Circle size={18} className="text-[#D8D4C8]" />
                                )}
                                {!isLast && (
                                    <div
                                        className={`my-1 w-0.5 flex-1 ${
                                            done ? "bg-primary" : "bg-[#E7E3D8]"
                                        }`}
                                        style={{ minHeight: "20px" }}
                                    />
                                )}
                            </div>
                            <span
                                className={`pb-6 text-sm ${
                                    done || active
                                        ? "font-medium text-[#23241F]"
                                        : "text-[#6B6A63]"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ReturnRequest() {

    const {
        returns,
        loading,
        getCustomerReturnRequests,
    } = useReturnStore();

    const [expandedId, setExpandedId] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {
        getCustomerReturnRequests(
            selectedStatus
                ? { status: selectedStatus } : {}
        );
    }, [selectedStatus, getCustomerReturnRequests]); /// getCustomerReturnRequests

    const toggleCard = (id) => {
        setExpandedId((prev) =>
            prev === id ? null : id
        );
    };

    return (
        <div className="space-y-8">
            {/* Heading */}
            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Returns
                </p>
                <h2 className="text-2xl font-semibold text-[#23241F]">
                    My return requests
                </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setSelectedStatus(filter.value)}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-300
                            
                        ${
                            selectedStatus === filter.value
                                ? "bg-primary text-white"
                                : "border border-[#E7E3D8] bg-white text-[#6B6A63] hover:border-primary hover:text-primary"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="space-y-5">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-36 animate-pulse rounded-2xl bg-[#F1F0EC]"
                        />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && returns.length === 0 && (
                <div className="rounded-3xl border border-dashed border-[#E7E3D8] bg-white py-20">
                    <Package
                        size={52}
                        className="mx-auto text-[#6B6A63]"
                    />
                    <h3 className="mt-6 text-center text-xl font-semibold text-[#23241F]">
                        No return requests
                    </h3>
                    <p className="mt-2 text-center text-sm text-[#6B6A63]">
                        Your return requests will appear here.
                    </p>
                </div>
            )}

            {/* Cards */}
            {!loading && returns.length > 0 && (
                <div className="space-y-5">
                    {returns.map((request) => {
                        const expanded =
                            expandedId === request._id;

                        const status = STATUS_CONFIG_RETURN[request.status] || {
                            label: prettyStatus(request.status),
                            tone: "neutral",
                        };

                        return (
                            <div
                                key={request._id}
                                className="overflow-hidden rounded-3xl border border-[#E7E3D8] bg-white shadow-sm transition-all duration-300"
                            >
                                {/* Header */}
                                <div
                                    onClick={() =>
                                        toggleCard(request._id)
                                    }
                                    className="cursor-pointer p-6 transition-colors hover:bg-[#FCFBF9]"
                                >
                                    <div className="flex flex-col gap-6 md:flex-row">

                                        {/* Product Image */}
                                        <img
                                            src={request.productId.images[0]}
                                            alt={request.productId.name}
                                            className="h-28 w-28 rounded-2xl border border-[#E7E3D8] object-cover"
                                        />

                                        {/* Product */}
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-[#23241F]">
                                                        {request.productId.name}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-[#6B6A63]">
                                                        Order #{" "}
                                                        {request.orderId.orderNumber}
                                                    </p>

                                                    <p className="mt-1 text-sm text-[#6B6A63]">
                                                        Requested on{" "}
                                                        {formatDate(request.createdAt)}
                                                    </p>
                                                </div>
                                                <StatusBadge tone={status.tone}>
                                                    {status.label}
                                                </StatusBadge>
                                            </div>

                                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-[#6B6A63]">
                                                        Refund amount
                                                    </p>
                                                    <h3 className="text-xl font-bold text-primary">
                                                        Rs. {request.refundAmount}
                                                    </h3>
                                                </div>

                                                <button className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary">
                                                    {expanded ? "Hide details" : "View details"}
                                                    {expanded ? (
                                                        <ChevronUp size={18} />
                                                    ) : (
                                                        <ChevronDown size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* EXPANDED CONTENT */}
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        expanded
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="border-t border-[#E7E3D8] p-6">
                                            {/* Details */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-5">
                                                    <DetailField label="Quantity">
                                                        {request.quantity}
                                                    </DetailField>
                                                    <DetailField label="Return reason">
                                                        {prettyReason(request.reason)}
                                                    </DetailField>
                                                    <DetailField label="Description">
                                                        {request.description ||
                                                            "No description provided."}
                                                    </DetailField>
                                                </div>
                                                <div className="space-y-5">
                                                    <DetailField label="Unit price">
                                                        <span className="font-medium">
                                                            Rs. {request.unitPrice}
                                                        </span>
                                                    </DetailField>
                                                    <DetailField label="Refund amount">
                                                        <span className="text-lg font-bold text-primary">
                                                            Rs. {request.refundAmount}
                                                        </span>
                                                    </DetailField>
                                                    <DetailField label="Order status">
                                                        {prettyStatus(request.orderId.orderStatus)}
                                                    </DetailField>
                                                </div>
                                            </div>

                                            {/* Uploaded Images */}
                                            {request.images?.length > 0 && (
                                                <div className="mt-8">
                                                    <h4 className="mb-3 text-sm font-semibold text-[#23241F]">
                                                        Evidence images
                                                    </h4>
                                                    <div className="flex flex-wrap gap-3">
                                                        {request.images.map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt="Evidence"
                                                                className="h-24 w-24 rounded-xl border border-[#E7E3D8] object-cover transition hover:scale-105"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Timeline */}
                                            <div className="mt-10">
                                                <ReturnTimeline status={request.status} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}