// pages/VendorsPage.jsx
import { Eye, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";
import useVendorStore from "../../../store/vendorStore";
import VendorDrawer from "../components/VendorDrawer";

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
  const { vendors, getAllVendors, getVendorById, selectedVendor, kycDetail } =
    useVendorStore();

  const [kycFilter, setKycFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

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

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return vendors.filter((vendor) => {
      const kycStatus = vendor.kycStatus?.toLowerCase() || "pending";
      const accountStatus = vendor.accountStatus?.toLowerCase() || "active";

      const kycMatch =
        kycFilter === "All" || KYC_STYLE[kycStatus]?.label === kycFilter;

      const statusMatch =
        statusFilter === "All" ||
        STATUS_STYLE[accountStatus]?.label === statusFilter;

      const matchesSearch =
        !keyword ||
        vendor.userName?.toLowerCase().includes(keyword) ||
        vendor.email?.toLowerCase().includes(keyword);

      return kycMatch && statusMatch && matchesSearch;
    });
  }, [vendors, kycFilter, statusFilter, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Vendors</h1>
        <p className="mt-1 text-muted-foreground">
          Manage vendor accounts and review KYC verification requests.
        </p>
      </div>

      {/* KPI Cards - Simplified */}
      <div className="w-full lg:w-1/2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Total Vendors
            </p>
            <p className="mt-2 font-mono text-3xl font-medium">
              {vendors.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Pending KYC
            </p>
            <p className="mt-2 font-mono text-3xl font-medium">
              {
                vendors.filter((v) => v.kycStatus?.toLowerCase() === "pending")
                  .length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            {["All", "Approved", "Pending", "Rejected"].map((filter) => (
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

            {["All", "Active", "Deactivated"].map((filter) => (
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

        {/* Actual Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                KYC Status
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Account Status
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((vendor) => {
              const kycStatus = vendor.kycStatus?.toLowerCase() || "pending";
              const accountStatus =
                vendor.accountStatus?.toLowerCase() || "active";

              const kyc = KYC_STYLE[kycStatus] || KYC_STYLE.pending;
              const status = STATUS_STYLE[accountStatus] || STATUS_STYLE.active;

              return (
                <tr key={vendor._id} className="border-t border-border">
                  {/* Vendor Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-semibold text-muted-foreground">
                        {vendor.userName?.substring(0, 2).toUpperCase() || "??"}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {vendor.userName}
                        </p>

                        <p className="truncate text-[11px] text-muted-foreground">
                          {vendor.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* KYC Status */}
                  <td className="px-6 py-4">
                    <StatusBadge tone={kyc.tone}>{kyc.label}</StatusBadge>
                  </td>

                  {/* Account Status */}
                  <td className="px-6 py-4">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-muted-foreground">
                    {vendor.createdAt
                      ? new Date(vendor.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <ButtonRounded
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      title="View Details"
                      className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                      onClick={() => handleViewVendor(vendor._id)}
                    />
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="py-12 text-center text-muted-foreground"
                >
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vendor Drawer */}
      <VendorDrawer
        vendor={selectedVendor}
        kycDetail={kycDetail}
        onClose={() =>
          useVendorStore.setState({
            selectedVendor: null,
          })
        }
      />
    </div>
  );
};

export default VendorsPage;
