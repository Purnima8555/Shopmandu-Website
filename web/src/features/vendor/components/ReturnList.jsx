

import { useCallback, useState } from "react";
import SummaryCard from "../ui/SummaryCard";
import { CheckCircle, Clock, DollarSign, XCircle } from "lucide-react";
import SearchInput from "../../../components/ui/SearchInput";
import Selecter from "../../../components/ui/Selecter";
import { filterOrders } from "../data";




export const ReturnList = () => {

      const [searchInput, setSearchInput] = useState("");
      const [selectedStatus, setSelectedStatus] = useState("");
    
      const handleSearchChange = useCallback((value) => {
        setSearchInput(value);
      }, []);
    
      const handleFilterChange = (e) => {
      setSelectedStatus(e.target.value);
      // your filtering logic...
    };

   return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Return Requests</h1>
        <p className="text-sm text-[#64748B] mt-1">Review disputes, process refunds, and optimize customer satisfaction metrics.</p>
      </div>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        <SummaryCard
          title="Pending review"
          summary={1}
          icon={Clock}
          iconBackground="bg-amber-50"
          iconColor="text-amber-500"
          valueColor="text-amber-500"
        />

        <SummaryCard
          title="Approved logs"
          summary={2}
          icon={CheckCircle}
          iconBackground="bg-blue-50"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />

        <SummaryCard
          title="Rejected disputes"
          summary={3}
          icon={XCircle}
          iconBackground="bg-red-50"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />

      
        <SummaryCard
          title="Refunded payouts"
          summary={1}
          icon={DollarSign}
          iconBackground="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />
      </div>

      <div className="bg-bg-card p-4 rounded-[14px] border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <SearchInput
          iconPosition="right"
          placeholder="Search orders Id, customer Name...."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <div className="w-full md:w-48">
          <Selecter
            className="min-w-10 px-0"
            value={selectedStatus}
            onChange={handleFilterChange}
          >
            {filterOrders.map((order) => (
              <option key={order.value} value={order.value}>
                {order.label}
              </option>
            ))}
          </Selecter>
        </div>

        
      </div>
    </div>
  );
}


