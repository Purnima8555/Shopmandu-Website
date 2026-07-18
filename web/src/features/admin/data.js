

export const STATUS_STYLE = {
  true: { tone: "success", label: "Active" },
  false: { tone: "neutral", label: "Inactive" },
};


export const COUPON_STATUS_STYLE = {
  active: { tone: "success", label: "Active" },
  inactive: { tone: "neutral", label: "Inactive" },
  expired: { tone: "danger", label: "Expired" },
};



//// orders 

export const ORDER_STYLE = {
  PENDING: { tone: "warning", label: "Pending" },
  PROCESSING: { tone: "warning", label: "Processing" },
  CONFIRMED: { tone: "info", label: "Confirmed" },
  OUT_FOR_DELIVERY: { tone: "info", label: "Out For Delivery" },
  DELIVERED: { tone: "success", label: "Delivered" },
  CANCELLED: { tone: "danger", label: "Cancelled" },
  RETURNED: { tone: "neutral", label: "Returned" },
};

export const PAYMENT_STYLE = {
  PAID: { tone: "success", label: "Paid" },
  PENDING: { tone: "warning", label: "Pending" },
  UNPAID: { tone: "neutral", label: "Unpaid" },
  REFUNDED: { tone: "danger", label: "Refunded" },
  FAILED: { tone: "danger", label: "Failed" },
  EXPIRED: { tone: "neutral", label: "Expired" },
};

export const STATUS_STYLES = {
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  danger: "bg-danger/10 text-danger border border-danger/20",
  info: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  primary: "bg-primary/10 text-primary border border-primary/20",
  neutral: "bg-muted text-muted-foreground border border-border",
};

export const ADMIN_STATUSES = [
  "PENDING",
  "PROCESSING",
  "CONFIRMED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export const TABS = ["All Orders", "Pending", "Processing", "Delivered", "Cancelled"];


//// overview 

export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];



/// payment 

export const PAYMENT_STATUS_STYLE = {
  PAID: { tone: "success", label: "Paid" },
  PENDING: { tone: "warning", label: "Pending" },
  FAILED: { tone: "danger", label: "Failed" },
  REFUNDED: { tone: "info", label: "Refunded" },
};

export const paymentStatusOption = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
  { label: "Paid", value: "PAID" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Expired", value: "EXPIRED" },
];

export const paymentMethodOption = [
  { label: "All Methods", value: "" },
  { label: "Online", value: "ONLINE" },
  { label: "Cash on Delivery", value: "CASH_ON_DELIVERY" },
];

export const gatewayOption = [
  { label: "All Gateways", value: "" },
  { label: "Khalti", value: "KHALTI" },
  { label: "Stripe", value: "STRIPE" },
];


/// product 

export const PRODUCT_STATUS_STYLE = {
  ACTIVE: { tone: "success", label: "Active" },
  INACTIVE: { tone: "neutral", label: "Inactive" },
  OUT_OF_STOCK: { tone: "warning", label: "Out of Stock" },
  DRAFT: { tone: "warning", label: "Draft" },
};


/// users

export const ROLE_STYLE = {
  ADMIN: { tone: "info", label: "Admin" },
  VENDOR: { tone: "warning", label: "Vendor" },
  CUSTOMER: { tone: "success", label: "Customer" },
};

export const VERIFY_STYLE = {
  true: { tone: "success", label: "Verified" },
  false: { tone: "neutral", label: "Unverified" },
};

/// vendor 

export const KYC_STYLE = {
  approve: { tone: "success", label: "Approved" },
  approved: { tone: "success", label: "Approved" },
  pending: { tone: "warning", label: "Pending" },
  reject: { tone: "danger", label: "Rejected" },
  rejected: { tone: "danger", label: "Rejected" },
};


export const ADMIN_EDITABLE_STATUSES = [
  "PROCESSING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const ADMIN_STATUS_TRANSITIONS = {
  PENDING: [],

  CONFIRMED: ["PROCESSING"],

  PROCESSING: ["OUT_FOR_DELIVERY", "DELIVERED"],

  OUT_FOR_DELIVERY: ["DELIVERED"],

  DELIVERED: [],

  CANCELLED: [],

  RETURNED: [],
};