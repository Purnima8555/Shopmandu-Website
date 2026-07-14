import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import useShopStore from "../../../store/shop";
import TabRander from "../components/TabRander";
import useOrderStore from "../../../store/orderStore";

const VendorDashboard = () => {
  const getMyshop = useShopStore((state) => state.getMyshop);
  const getMyKycStatus = useShopStore((state) => state.getMyKycStatus);
  const getProductsSummary = useShopStore((state) => state.getProductsSummary);
  // const getAllMyProducts = useShopStore((state)=> state.getAllMyProducts)
  const { loading } = useShopStore();

  const { getVendorSalesSummary } = useOrderStore();

  useEffect(() => {
    getVendorSalesSummary();
  }, []);

  useEffect(() => {
    getMyshop();
    getMyKycStatus();
    getProductsSummary();
    // getAllMyProducts();
  }, [getMyshop, loading, getMyKycStatus, getProductsSummary]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [currentTab, setCurrentTab] = useState("kyc-verification");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingProduct, setEditingProduct] = useState(undefined);

  const handleAddProductHeaderClick = () => {
    setEditingProduct(undefined);
    setCurrentTab("add-product");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] antialiased flex">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className={`flex-1 min-w-0 flex flex-col ${isCollapsed ? "pl-20" : "pl-64"} `}
        id="main-content-scroll-layer transition-all duration-400"
      >
        {/* Sticky Top Header Navigation */}
        <Header
          onAddProductClick={handleAddProductHeaderClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNavigateToTab={setCurrentTab}
        />

        {/* Dynamic page content container */}
        <main
          className={`px-6 pt-4 md:px-8 md:pt-6 flex-1 w-full mx-auto pb-20 `}
        >
          <TabRander currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
