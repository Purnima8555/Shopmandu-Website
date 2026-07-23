

import { ShieldAlert, Clock, XCircle, ShieldCheck } from "lucide-react";


const STATUS_CONFIG = {
  //// kycStatus === null  →  vendor has never submitted KYC
  null: {
    Icon:        ShieldAlert,
    iconColor:   "text-amber-500",
    iconBg:      "bg-amber-50",
    borderColor: "border-amber-200",
    title:       "KYC Verification Required",
    description:
      "You must complete KYC verification before you can create a shop. Please submit your business documents to get started.",
    badge:       "Not Submitted",
    badgeBg:     "bg-amber-100 text-amber-700",
  },
  ///// kycStatus === "PENDING"
  PENDING: {
    Icon:        Clock,
    iconColor:   "text-blue-500",
    iconBg:      "bg-blue-50",
    borderColor: "border-blue-200",
    title:       "KYC Under Review",
    description:
      "Your KYC documents are currently being reviewed by our team. Shop creation will be available once your verification is approved.",
    badge:       "Pending Review",
    badgeBg:     "bg-blue-100 text-blue-700",
  },
  ///// kycStatus === "REJECT"
  REJECT: {
    Icon:        XCircle,
    iconColor:   "text-red-500",
    iconBg:      "bg-red-50",
    borderColor: "border-red-200",
    title:       "KYC Verification Rejected",
    description:
      "Your KYC submission was rejected. Please review the feedback, update your documents, and resubmit to proceed with shop creation.",
    badge:       "Rejected",
    badgeBg:     "bg-red-100 text-red-700",
  },
};

const KycStatusGate = ({ kycStatus }) => {

  const config = STATUS_CONFIG[String(kycStatus)];

  if (!config) return null;

  const { Icon, iconColor, iconBg, borderColor, title, description, badge, badgeBg } = config;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
      {/* Icon bubble */}
      <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>

      {/* Badge */}
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${badgeBg} mb-4`}>
        {badge}
      </span>

      {/* Text */}
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm leading-relaxed">{description}</p>

      {/* Divider card */}
      <div className={`mt-8 w-full max-w-sm rounded-xl border ${borderColor} bg-white p-4 text-left`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#6A89A7] mt-0.5 shrink-0" />
          <p className="text-xs text-text-secondary leading-relaxed">
            KYC verification protects our marketplace and ensures all vendors
            meet compliance requirements. This process typically takes{" "}
            <span className="font-semibold text-text-primary">1–2 business days</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KycStatusGate;
