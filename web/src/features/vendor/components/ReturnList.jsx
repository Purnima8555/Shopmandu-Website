import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, DollarSign, XCircle } from "lucide-react";

import SummaryCard from "../ui/SummaryCard";
import SearchInput from "../../../components/ui/SearchInput";
import Selecter from "../../../components/ui/Selecter";
import VendorPagination from "../ui/VendorPagination";
import ReturnTable from "../ui/return/ReturnTable";
import ReturnView from "../ui/return/ReturnView";

import { RETURN_FILTERS } from "../data";
import useVendorReturnManage from "../store/vendroManageReturn.store";

export const ReturnList = () => {
  const {
    returns,
    metadata,
    loading,
    selectedReturn,
    setSelectedReturn,
    getVendorReturnRequests,
  } = useVendorReturnManage();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSearchChange = useCallback((value) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const handleFilterChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  const fetchReturns = useCallback(() => {
    getVendorReturnRequests({
      page,
      limit,
      search: searchInput,
      status: selectedStatus,
    });
  }, [page, limit, searchInput, selectedStatus, getVendorReturnRequests]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReturns();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchReturns]);

  const summary = useMemo(
    () => ({
      pending: returns.filter((r) => r.status === "PENDING").length,
      approved: returns.filter((r) => r.status === "APPROVED").length,
      rejected: returns.filter((r) => r.status === "REJECTED").length,
      refunded: returns.filter((r) => r.status === "REFUNDED").length,
    }),
    [returns],
  );

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Return Requests
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Review disputes, approve returns and process customer refunds.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <SummaryCard
          title="Pending Review"
          summary={summary.pending}
          icon={Clock}
          iconBackground="bg-amber-50"
          iconColor="text-amber-500"
          valueColor="text-amber-500"
        />

        <SummaryCard
          title="Approved"
          summary={summary.approved}
          icon={CheckCircle}
          iconBackground="bg-blue-50"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />

        <SummaryCard
          title="Rejected"
          summary={summary.rejected}
          icon={XCircle}
          iconBackground="bg-red-50"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />

        <SummaryCard
          title="Refunded"
          summary={summary.refunded}
          icon={DollarSign}
          iconBackground="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />
      </div>

      {/* Search + Filter + Pagination */}
      <div className="bg-bg-card rounded-[14px] border border-border shadow-sm p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-10">
            <SearchInput
              iconPosition="right"
              placeholder="Search order number, customer..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Selecter value={selectedStatus} onChange={handleFilterChange}>
              {RETURN_FILTERS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Selecter>
          </div>
        </div>

        <VendorPagination

          metadata={metadata}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          refreshData={fetchReturns}
        />
      </div>

      {/* Return Table */}
      <ReturnTable
        returns={returns}
        loading={loading}
        onView={setSelectedReturn}
      />

      {/* View Modal */}
      <ReturnView
        request={selectedReturn}
        onClose={() => setSelectedReturn(null)}
      />
    </div>
  );
};

export default ReturnList;
