import { Building2, Home, MoreHorizontal, PackageCheck, Receipt, Store } from "lucide-react";

export const STATUS = {
    DELIVERED: { label: "Delivered", tone: "success" },
    PROCESSING: { label: "Processing", tone: "warning" },
    PENDING: { label: "Pending", tone: "warning" },
    CONFIRMED: { label: "Confirmed", tone: "info" },
    OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "primary" },
    PARTIALLY_SHIPPED: { label: "Partially shipped", tone: "primary" },
    CANCELLED: { label: "Cancelled", tone: "danger" },
    FAILED: { label: "Failed", tone: "danger" },
};

export const RETURN_STATUS = {
    PENDING: {
        label: "Return Requested",
        tone: "warning",
    },
    APPROVED: {
        label: "Return Approved",
        tone: "success",
    },
    REJECTED: {
        label: "Return Rejected",
        tone: "danger",
    },
    REFUNDED: {
        label: "Refunded",
        tone: "primary",
    },
};

export const STEPS = [
    {
        key: "CONFIRMED",
        label: "Confirmed",
    },
    {
        key: "PROCESSING",
        label: "Processing",
    },
    {
        key: "OUT_FOR_DELIVERY",
        label: "Out for delivery",
    },
    {
        key: "DELIVERED",
        label: "Delivered",
    },
];

export const addressTypes = [
  { value: "HOME", label: "Home", icon: Home },
  { value: "OFFICE", label: "Office", icon: Building2 },
  { value: "BILLING", label: "Billing", icon: Receipt },
  { value: "SHOP", label: "Shop", icon: Store },
  { value: "PICKUP", label: "Pickup point", icon: PackageCheck },
  { value: "OTHER", label: "Other", icon: MoreHorizontal },
];

export const tabs = [
  { key: "orders", label: "Orders" },
  { key: "addresses", label: "Addresses" },
  { key: "returns", label: "Return Requests" },
  { key: "settings", label: "Settings" },
];

export const RETURN_REASONS = [
  { value: "DEFECTIVE", label: "Defective product" },
  { value: "WRONG_ITEM", label: "Wrong item" },
  { value: "SIZE_ISSUE", label: "Size issue" },
  { value: "NOT_AS_DESCRIBED", label: "Not as described" },
  { value: "CHANGE_OF_MIND", label: "Changed my mind" },
  { value: "OTHER", label: "Other" },
];


export const STATUS_CONFIG = {
    DELIVERED: { label: "Delivered", tone: "success" },
    PROCESSING: { label: "Processing", tone: "warning" },
    PENDING: { label: "Pending", tone: "warning" },
    CONFIRMED: { label: "Confirmed", tone: "info" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", tone: "primary" },
    PARTIALLY_SHIPPED: { label: "Partially Shipped", tone: "primary" },
    CANCELLED: { label: "Cancelled", tone: "danger" },
    FAILED: { label: "Failed", tone: "danger" },
    RETURN_REQUESTED: { label: "Return Requested", tone: "neutral" },
    RETURNED: { label: "Returned", tone: "neutral" },
};

export const filters = [
    { label: "All", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Refunded", value: "REFUNDED" },
];

export const STATUS_CONFIG_RETURN = {
    PENDING: { label: "Pending", tone: "warning" },
    APPROVED: { label: "Approved", tone: "success" },
    REJECTED: { label: "Rejected", tone: "danger" },
    REFUNDED: { label: "Refunded", tone: "info" },
};

export const TIMELINE_STEPS = [
    { key: "SUBMITTED", label: "Request submitted" },
    { key: "PENDING", label: "Under review" },
    { key: "APPROVED", label: "Approved" },
    { key: "REFUNDED", label: "Refund completed" },
];