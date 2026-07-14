

export const KycStatusTag = ({ kycStatus }) => {
  const baseClass =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium";

  const dotClass =
    "w-1.5 h-1.5 rounded-full";

  const statusConfig = {
    APPROVE: {
      label: "Approved",
      badge: "bg-emerald-100 text-emerald-800",
      dot: "bg-emerald-500 animate-pulse",
    },
    PENDING: {
      label: "Pending",
      badge: "bg-amber-100 text-amber-800",
      dot: "bg-amber-500 animate-pulse",
    },
    REJECT: {
      label: "Rejected",
      badge: "bg-red-100 text-red-800",
      dot: "bg-red-500",
    },
    DEFAULT: {
      label: "Unknown",
      badge: "bg-slate-100 text-slate-700",
      dot: "bg-slate-500",
    },
  };

  const status = statusConfig[kycStatus] || statusConfig.DEFAULT;

  return (
    <span className={`${baseClass} ${status.badge}`}>
      <span className={`${dotClass} ${status.dot}`}></span>
      {status.label} 
    </span>
  );
};