import { useEffect, useState } from "react";

import {
  Banknote,
  Calendar,
  ChevronDown,
  FileText,
  IdCard,
  ImageOff,
  Mail,
} from "lucide-react";

import Button from "../../../components/ui/Button";
import Drawer from "../../../components/ui/Drawer";
import StatusBadge from "../../../components/ui/StatusBadge";

import useVendorStore from "../../../store/vendorStore";
import { dismissToast, showSuccess } from "../../../utils/toast";

// ---------------- Section Header ----------------
const SectionHeader = ({ icon: Icon, children }) => (
  <div className="mb-3 flex items-center gap-2">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <h3 className="text-sm font-semibold">{children}</h3>
  </div>
);

// ---------------- Field ----------------
const Field = ({ label, value, mono = false }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>

    <p className={mono ? "mt-0.5 font-mono text-sm" : "mt-0.5 text-sm"}>
      {value || "—"}
    </p>
  </div>
);

// ---------------- Avatar Initials ----------------
const getInitials = (name) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "?";

const VendorDrawer = ({ vendor, onClose, kycDetail }) => {
  if (!vendor) return null;

  const { approveVendorKyc, rejectVendorKyc, getVendorById, getAllVendors } =
    useVendorStore();

  // Dropdown value
  const [decision, setDecision] = useState("pending");
  // Reject textarea
  const [reason, setReason] = useState("");
  // Controls whether the reject textarea is visible
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (!vendor) return;

    const currentStatus = vendor.kycStatus?.toLowerCase() || " ";

    setDecision(currentStatus);
    setReason("");

    // Only open textarea when admin explicitly chooses Reject
    setShowRejectForm(false);
  }, [vendor]);

  // ---------------- Approve ----------------
  const handleApprove = async () => {
    try {
      await approveVendorKyc(vendor._id);
      await getVendorById(vendor.user_id);
      await getAllVendors();

      setDecision("approve");
      showSuccess("KYC Approved Successfully!!");

      setShowRejectForm(false);
    } catch (err) {
      console.error(err);

      dismissToast("Failed to approve KYC.");
    }
  };

  // ---------------- Reject ----------------
  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason.");

      return;
    }

    try {
      await rejectVendorKyc(vendor._id, {
        reason,
      });

      // Refresh vendor data
      await getVendorById(vendor.user_id);
      await getAllVendors();

      // Hide textarea
      setShowRejectForm(false);
      // Keep dropdown on rejected
      setDecision("reject");
      showSuccess("KYC Rejected!!");

      // Keep reason so it can be displayed
    } catch (err) {
      console.error(err);
      dismissToast("Failed to reject KYC.");
    }
  };

  // ---------------- Dropdown ----------------
  const handleDecisionChange = async (e) => {
    const value = e.target.value;

    setDecision(value);

    if (value === "approve") {
      await handleApprove();
      return;
    }

    if (value === "reject") {
      setShowRejectForm(true);
      return;
    }

    // Pending
    setShowRejectForm(false);
  };

  // ---------------- Status Badge ----------------
  const accountTone =
    {
      ACTIVE: "success",
      PENDING: "warning",
      SUSPENDED: "danger",
      DEACTIVATED: "neutral",
    }[vendor.accountStatus?.toUpperCase()] || "neutral";

  // ---------------- Images ----------------
  const frontImage = kycDetail?.frontSideImageURL;
  const backImage = kycDetail?.backSideImageURL;

  return (
    <Drawer
      isOpen={!!vendor}
      onClose={onClose}
      title="Vendor Details"
      maxWidth="max-w-5xl"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {/* ================= LEFT COLUMN ================= */}
          <div className="space-y-5">
            <section className="rounded-xl border border-border bg-card p-5">
              {/* Avatar + Status */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {getInitials(vendor.fullName)}
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  {vendor.fullName || "Unnamed Vendor"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {vendor.businessEmail || "No Email"}
                </p>

                {/* KYC Dropdown */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-sm font-medium">KYC:</span>

                  <div className="relative">
                    <select
                      value={decision}
                      onChange={handleDecisionChange}
                      className="appearance-none rounded-full border border-border bg-card py-1.5 pl-3 pr-9 text-sm outline-none transition focus:border-primary"
                    >
                      <option value="pending">Pending</option>

                      <option value="approve">Approve</option>

                      <option value="reject">Reject</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  {vendor.accountStatus && (
                    <StatusBadge tone={accountTone}>
                      {vendor.accountStatus}
                    </StatusBadge>
                  )}
                </div>
              </div>

              {/* ================= Reject Form ================= */}
              {showRejectForm && (
                <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <h4 className="text-sm font-semibold text-destructive">
                    Reason for rejection
                  </h4>

                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-destructive"
                  />

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowRejectForm(false);
                        setReason("");
                        setDecision(
                          vendor.kycStatus?.toLowerCase() || "pending",
                        );
                      }}
                    >
                      Cancel
                    </Button>

                    <Button className="flex-1" onClick={handleReject}>
                      Send
                    </Button>
                  </div>
                </div>
              )}

              {/* ================= Saved Rejection Message ================= */}
              {!showRejectForm &&
                vendor.rejectionReason &&
                vendor.kycStatus?.toUpperCase() !== "APPROVE" && (
                  <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <h4 className="text-sm font-semibold text-destructive">
                      Reason for rejection
                    </h4>

                    <p className="mt-3 whitespace-pre-wrap text-sm">
                      {vendor.rejectionReason}
                    </p>
                  </div>
                )}

              {/* ================= Identity Information ================= */}
              <div className="mt-6 border-t border-border pt-6">
                <SectionHeader icon={IdCard}>
                  Identity Information
                </SectionHeader>

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Citizenship No."
                    value={vendor.citizenship?.number}
                  />

                  <Field
                    label="Date of Birth"
                    value={
                      vendor.citizenship?.dateOfBirth
                        ? new Date(
                            vendor.citizenship.dateOfBirth,
                          ).toLocaleDateString()
                        : null
                    }
                  />

                  <Field label="National ID" value={vendor.nidNumber} />

                  <Field label="PAN Number" value={vendor.panNumber} />
                </div>
              </div>
            </section>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="col-span-2 space-y-6">
            {/* ================= Vendor Information ================= */}
            <section>
              <SectionHeader icon={Mail}>Vendor Information</SectionHeader>

              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
                <Field label="Full Name" value={vendor.fullName} />

                <Field
                  label="Joined Date"
                  value={
                    vendor.createdAt
                      ? new Date(vendor.createdAt).toLocaleDateString()
                      : "—"
                  }
                />

                <Field label="Business Email" value={vendor.businessEmail} />

                <Field label="Business Phone" value={vendor.businessMobile} />
              </div>
            </section>

            {/* ================= Bank Details ================= */}
            <section>
              <SectionHeader icon={Banknote}>Bank Details</SectionHeader>

              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
                <Field label="Bank" value={vendor.bankDetails?.bankName} />

                <Field label="Branch" value={vendor.bankDetails?.branchName} />

                <Field
                  label="Account Holder"
                  value={vendor.bankDetails?.accountHolderName}
                />

                <Field
                  label="Account Number"
                  value={vendor.bankDetails?.accountNumber}
                  mono
                />
              </div>
            </section>

            {/* ================= Uploaded Documents ================= */}

            <section>
              <SectionHeader icon={FileText}>Uploaded Documents</SectionHeader>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="grid grid-cols-2 gap-5">
                  {[
                    {
                      label: "Front Citizenship",
                      src: frontImage,
                    },

                    {
                      label: "Back Citizenship",
                      src: backImage,
                    },
                  ].map(({ label, src }) => (
                    <div
                      key={label}
                      className="overflow-hidden rounded-xl border border-border"
                    >
                      <div className="flex h-32 items-center justify-center bg-muted/40">
                        {src ? (
                          <img
                            src={src}
                            alt={label}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <ImageOff className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-border px-4 py-3">
                        <span className="text-sm font-medium">{label}</span>
                        {src ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(src, "_blank")}
                          >
                            View
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ================= Footer ================= */}
        <section className="flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Last updated{" "}
            {vendor.updatedAt
              ? new Date(vendor.updatedAt).toLocaleString()
              : "—"}
          </span>
        </section>
      </div>
    </Drawer>
  );
};

export default VendorDrawer;
