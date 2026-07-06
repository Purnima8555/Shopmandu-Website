
import Drawer from "../../../components/ui/Drawer";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";

const VendorDrawer = ({ vendor, onClose }) => {
  if (!vendor) return null;

  const kycTone = {
    APPROVE: "success",
    APPROVED: "success",
    APPROVEDD: "success",
    PENDING: "warning",
    REJECT: "danger",
    REJECTED: "danger",
  }[vendor.kycStatus?.toUpperCase()] || "neutral";

  const accountTone = {
    ACTIVE: "success",
    PENDING: "warning",
    SUSPENDED: "danger",
    DEACTIVATED: "neutral",
  }[vendor.accountStatus?.toUpperCase()] || "neutral";

  const frontImage =
    vendor.frontSideImage?.secure_url || vendor.frontSideImage?.url;

  const backImage =
    vendor.backSideImage?.secure_url || vendor.backSideImage?.url;

  return (
    <Drawer
      isOpen={!!vendor}
      onClose={onClose}
      title="Vendor Details"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Vendor Information */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Vendor Information
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p>{vendor.fullName || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Joined Date</p>
              <p>
                {vendor.createdAt
                  ? new Date(vendor.createdAt).toLocaleDateString()
                  : vendor.joined || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Business Email</p>
              <p>{vendor.businessEmail || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Business Phone</p>
              <p>{vendor.businessMobile || "—"}</p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">Status</h3>

          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={kycTone}>
              KYC: {vendor.kycStatus || "Unknown"}
            </StatusBadge>

            {vendor.accountStatus && (
              <StatusBadge tone={accountTone}>
                {vendor.accountStatus}
              </StatusBadge>
            )}
          </div>

          {vendor.rejectionReason && (
            <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-xs font-medium text-destructive">
                Rejection Reason
              </p>
              <p className="mt-1 text-sm">
                {vendor.rejectionReason}
              </p>
            </div>
          )}
        </section>

        {/* Bank Details */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">Bank Details</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Bank</p>
              <p>{vendor.bankDetails?.bankName || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Branch</p>
              <p>{vendor.bankDetails?.branchName || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Account Holder</p>
              <p>
                {vendor.bankDetails?.accountHolderName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Account Number</p>
              <p className="font-mono">
                {vendor.bankDetails?.accountNumber || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Identity */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">Identity Information</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Citizenship No.</p>
              <p>{vendor.citizenship?.number || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p>
                {vendor.citizenship?.dateOfBirth
                  ? new Date(vendor.citizenship.dateOfBirth).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">National ID</p>
              <p>{vendor.nidNumber || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">PAN Number</p>
              <p>{vendor.panNumber || "—"}</p>
            </div>
          </div>
        </section>

        {/* Uploaded Documents */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">Uploaded Documents</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <span>Front Citizenship</span>
              {frontImage ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(frontImage, "_blank")}
                >
                  View Image
                </Button>
              ) : (
                <span className="text-muted-foreground">Not available</span>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <span>Back Citizenship</span>
              {backImage ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(backImage, "_blank")}
                >
                  View Image
                </Button>
              ) : (
                <span className="text-muted-foreground">Not available</span>
              )}
            </div>
          </div>
        </section>

        {/* Metadata */}
        <section className="border-t border-border pt-4">
          <div className="text-sm">
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p>
              {vendor.updatedAt
                ? new Date(vendor.updatedAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </section>
      </div>
    </Drawer>
  );
};

export default VendorDrawer;