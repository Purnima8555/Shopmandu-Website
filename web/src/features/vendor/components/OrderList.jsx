import { AlertCircle, CheckCircle, Clock, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import SummaryCard from "../ui/SummaryCard";
import SearchInput from "../../../components/ui/SearchInput";
import Selecter from "../../../components/ui/Selecter";
import OrderTable from "../ui/order/OrderTable";
import VendorPagination from "../ui/vendorPagination";
import VendorOrderDrawer from "../components/OrderDrawer";

import { filterOrders } from "../data";
import useOrderStore from "../../order/store/order.store";

const OrderList = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // NEW
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    vendorSalesSummary,
    getVendorOrders,
    vendorOrders,
    vendorOrderMetadata,
  } = useOrderStore();

  useEffect(() => {
    getVendorOrders({
      page: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch,
      orderItemsStatus: selectedStatus,
    });
  }, [
    currentPage,
    rowsPerPage,
    debouncedSearch,
    selectedStatus,
    getVendorOrders,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFilterChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    const value = val?.target ? val.target.value : val;
    setSearchInput(value);
  };

  const fetchOrders = () => {
    getVendorOrders({
      page: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch,
      orderItemsStatus: selectedStatus,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Store Orders
        </h1>

        <p className="text-sm text-text-secondary mt-1">
          Fulfill incoming custom requests, trigger track codes, and oversee
          billing.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Pending Funds"
          summary={vendorSalesSummary?.pendingOrders ?? 0}
          icon={Clock}
          iconBackground="bg-bg-surface"
          iconColor="text-text-secondary"
          valueColor="text-text-primary"
        />

        <SummaryCard
          title="Processing Ready"
          summary={vendorSalesSummary?.processingOrders ?? 0}
          icon={ShoppingBag}
          iconBackground="bg-amber-50"
          iconColor="text-amber-600"
          valueColor="text-amber-600"
        />

        <SummaryCard
          title="Fully Delivered"
          summary={vendorSalesSummary?.deliveredOrders ?? 0}
          icon={CheckCircle}
          iconBackground="bg-emerald-50"
          iconColor="text-success"
          valueColor="text-success"
        />

        <SummaryCard
          title="Cancelled Logs"
          summary={vendorSalesSummary?.cancelledOrders ?? 0}
          icon={AlertCircle}
          iconBackground="bg-red-50"
          iconColor="text-danger"
          valueColor="text-danger"
        />
      </div>

      {/* Search + Filter + Pagination */}
      <div className="bg-bg-card rounded-[14px] border border-border shadow-sm p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-10">
            <SearchInput
              iconPosition="right"
              placeholder="Search order ID or product..."
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>

          <div className="md:col-span-2">
            <Selecter value={selectedStatus} onChange={handleFilterChange}>
              {filterOrders.map((order) => (
                <option key={order.value} value={order.value}>
                  {order.label}
                </option>
              ))}
            </Selecter>
          </div>
        </div>

        <VendorPagination
          metadata={vendorOrderMetadata}
          page={currentPage}
          setPage={setCurrentPage}
          limit={rowsPerPage}
          setLimit={setRowsPerPage}
          refreshData={fetchOrders}
        />
      </div>

      {/* Orders Table */}
      <OrderTable orders={vendorOrders} onView={setSelectedOrder} />

      {/* Drawer */}
      <VendorOrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        refreshOrders={fetchOrders}
      />
    </div>
  );
};

export default OrderList;
