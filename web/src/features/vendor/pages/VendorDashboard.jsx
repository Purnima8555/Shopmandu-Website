import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import TabRander from "../components/TabRander";
import useOrderStore from "../../order/store/order.store";
import useVendorProductManageStore from "../store/vendorManageProduct.store";
import useShopStore from "../../shop/store/shop.store";


const VendorDashboard = () => {
  const getMyshop = useShopStore((state) => state.getMyshop);
  const getMyKycStatus = useShopStore((state) => state.getMyKycStatus);
  const getProductsSummary = useVendorProductManageStore((state) => state.getProductsSummary);
  // const getAllMyProducts = useShopStore((state)=> state.getAllMyProducts)
  const { loading } = useShopStore();

  const { getVendorSalesSummary } = useOrderStore();

  useEffect(() => {
    getVendorSalesSummary();
  }, [getVendorSalesSummary]);

  useEffect(() => {
    getMyshop();
    getMyKycStatus();
    getProductsSummary();
    // getAllMyProducts();
  }, [getMyshop, loading, getMyKycStatus, getProductsSummary]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [currentTab, setCurrentTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // const [editingProduct, setEditingProduct] = useState(undefined);

  const handleAddProductHeaderClick = () => {
    // setEditingProduct(undefined);
    setCurrentTab("add-product");
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-primary antialiased flex">
      {/*  Left Sidebar Navigation */}
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
