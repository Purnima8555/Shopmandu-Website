import { useEffect, useState } from "react";
import StatusBadge from "../../components/ui/StatusBadge";
import { Search, SlidersHorizontal, Eye } from "lucide-react";
import VendorDrawer from "../Admin/components/VendorDrawer";
import ButtonRounded from "../../components/ui/ButtonRounded";
import useAdminStore from "../../store/adminStore";

const KYC_STYLE = {
  approve: { tone: "success", label: "Approved" },
  approved: { tone: "success", label: "Approved" },
  pending: { tone: "warning", label: "Pending" },
  reject: { tone: "danger", label: "Rejected" },
  rejected: { tone: "danger", label: "Rejected" },
};

const STATUS_STYLE = {
  active: { tone: "success", label: "Active" },
  pending: { tone: "warning", label: "Pending" },
  suspended: { tone: "danger", label: "Suspended" },
  deactivated: { tone: "neutral", label: "Deactivated" },
};

const VendorsPage = () => {
  const {
    vendors,
    getAllVendors,
    getVendorById,
    selectedVendor,
  } = useAdminStore();

  const [kycFilter, setKycFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getAllVendors();
  }, []);

  const handleViewVendor = async (vendorId) => {
    try {
      await getVendorById(vendorId);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = vendors.filter((vendor) => {
    const kycStatus =
      vendor.kycStatus?.toLowerCase() || "pending";

    const accountStatus =
      vendor.accountStatus?.toLowerCase() || "active";

    const kycMatch =
      kycFilter === "All" ||
      KYC_STYLE[kycStatus]?.label === kycFilter;

    const statusMatch =
      statusFilter === "All" ||
      STATUS_STYLE[accountStatus]?.label === statusFilter;

    return kycMatch && statusMatch;
  });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Vendors
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage vendor accounts and review KYC verification requests.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Vendors",
            value: vendors.length,
            delta: "",
          },
          {
            label: "Pending KYC",
            value: filtered.filter(
              (v) =>
                v.kycStatus?.toLowerCase() === "pending"
            ).length,
            delta: "",
          },
          {
            label: "Suspended",
            value: filtered.filter(
              (v) =>
                v.accountStatus?.toLowerCase() === "suspended"
            ).length,
            delta: "",
          },
          {
            label: "Verified",
            value: filtered.filter(
              (v) => v.isVerify
            ).length,
            delta: "",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {kpi.label}
            </p>

            <div className="mt-2.5 flex items-end justify-between">
              <p className="font-mono text-2xl font-semibold">
                {kpi.value}
              </p>

              <span className="text-sm font-medium text-muted-foreground">
                {kpi.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">

          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              placeholder="Search vendors..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            {[
              "All",
              "Approved",
              "Pending",
              "Rejected",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setKycFilter(filter)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  kycFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}

            <div className="mx-1 h-4 w-px bg-border" />

            {[
              "All",
              "Active",
              "Pending",
              "Suspended",
              "Deactivated",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === filter
                    ? "bg-foreground text-background"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 px-5 py-2.5 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span>Vendor</span>
          <span>KYC Status</span>
          <span>Account Status</span>
          <span>Joined</span>
          <span className="text-right">Actions</span>
        </div>
                    {/* Table Rows */}
        {filtered.map((vendor) => {
          const kycStatus =
            vendor.kycStatus?.toLowerCase() || "pending";

          const accountStatus =
            vendor.accountStatus?.toLowerCase() || "active";

          const kyc =
            KYC_STYLE[kycStatus] || KYC_STYLE.pending;

          const status =
            STATUS_STYLE[accountStatus] ||
            STATUS_STYLE.active;

          return (
            <div
              key={vendor._id}
              className="grid cursor-pointer grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-2 border-t border-border px-5 py-3.5 text-sm hover:bg-surface"
              onClick={() => handleViewVendor(vendor._id)}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-semibold text-muted-foreground">
                  {vendor.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>

                <span className="min-w-0">
                  <p className="truncate font-medium">
                    {vendor.fullName}
                  </p>

                  <p className="truncate text-[11px] text-muted-foreground">
                    {vendor.email}
                  </p>
                </span>
              </span>

              <span>
                <StatusBadge tone={kyc.tone}>
                  {kyc.label}
                </StatusBadge>
              </span>

              <span>
                <StatusBadge tone={status.tone}>
                  {status.label}
                </StatusBadge>
              </span>

              <span className="font-mono text-sm">
                {vendor.createdAt
                  ? new Date(
                      vendor.createdAt
                    ).toLocaleDateString()
                  : "-"}
              </span>

              <span
                className="flex justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <ButtonRounded
                  variant="ghost"
                  size="sm"
                  icon={Eye}
                  title="View Details"
                  onClick={() =>
                    handleViewVendor(vendor._id)
                  }
                />
              </span>
            </div>
          );
        })}
      </div>
              <VendorDrawer
        vendor={selectedVendor}
        onClose={() =>
          useAdminStore.setState({
            selectedVendor: null,
          })
        }
      />
    </div>
  );
};

export default VendorsPage;