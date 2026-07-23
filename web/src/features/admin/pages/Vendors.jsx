import {
  Eye,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";

import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";

import VendorDrawer from "../components/VendorDrawer";
import { KYC_STYLE } from "../data";
import AdminPagination from "../components/AdminPagination";
import useManageVendorStore from "../store/adminManageVendor.store";

const VendorsPage = () => {
  const {
    allVendors,
    allVendorsMetadata,
    getAllVendors,
    getVendorById,
    selectedVendor,
    kycDetail,
  } = useManageVendorStore();

  const [kycFilter, setKycFilter] = useState("All");
  const [imageError, setImageError] = useState({});
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchVendors = async () => {
      await getAllVendors({
        page,
        limit,
        search,
        kycStatus: kycFilter === "All" ? "All" : kycFilter.toUpperCase(),
      });
    };

    fetchVendors();
  }, [page, limit, search, kycFilter, getAllVendors]);

  const handleViewVendor = async (vendorId) => {
    try {
      await getVendorById(vendorId);
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(allVendors);

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
              {allVendorsMetadata?.totalResults || 0}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Pending KYC
            </p>
            <p className="mt-2 font-mono text-3xl font-medium">
              {
                allVendors?.filter(
                  (v) => v.kycStatus?.toLowerCase() === "pending",
                ).length
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            {["All", "Approve", "Pending", "Reject"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setKycFilter(filter);
                  setPage(1);
                }}
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
          </div>
        </div>

        <AdminPagination
          metadata={allVendorsMetadata}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          refreshData={() =>
            getAllVendors({
              page,
              limit,
              ...(search.trim() && { search }),
              ...(kycFilter !== "All" && {
                kycStatus: kycFilter.toUpperCase(),
              }),
            })
          }
        />
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
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {allVendors?.map((vendor) => {
              const kycStatus = vendor.kycStatus?.toLowerCase() || "pending";

              const kyc = KYC_STYLE[kycStatus] || KYC_STYLE.pending;

              return (
                <tr key={vendor._id} className="border-t border-border">
                  {/* Vendor Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                        {vendor.avatar && !imageError[vendor._id] ? (
                          <img
                            src={vendor.avatar}
                            alt={vendor.userName}
                            className="h-full w-full object-cover"
                            onError={() =>
                              setImageError((prev) => ({
                                ...prev,
                                [vendor._id]: true,
                              }))
                            }
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center font-mono text-[14px] font-semibold text-muted-foreground">
                            {vendor.userName?.substring(0, 2).toUpperCase() ||
                              "??"}
                          </span>
                        )}
                      </div>

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

            {allVendors?.length === 0 && (
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
          useManageVendorStore.setState({
            selectedVendor: null,
          })
        }
      />
    </div>
  );
};

export default VendorsPage;
