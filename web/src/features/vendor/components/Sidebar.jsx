import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navItems } from "../data";
import { KycStatusTag } from "../ui/vendorKyc/KycStatusTag";

import useVendorStore from "../store/vendor.store";
import useShopStore from "../../shop/store/shop.store";


export default function Sidebar({
  currentTab,
  setCurrentTab,
  isCollapsed = false,
  setIsCollapsed,
}) {
  const [shopMenuOpen, setShopMenuOpen] = useState(true);
  const [productsMenuOpen, setProductsMenuOpen] = useState(true);
  const [ordersMenuOpen, setOrdersMenuOpen] = useState(true);
  const { shop } = useShopStore();
  const { vendorKycStatus, getVendorKycStatus } = useVendorStore();

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
  };

useEffect(() => {
  const fetchKycStatus = async () => {
    await getVendorKycStatus();
  };

  fetchKycStatus();
}, [getVendorKycStatus]);

  return (
    <aside
      id="sidebar-container"
      className={`fixed top-0 left-0 z-30 h-screen bg-white border-r border-[#DBE4EC] transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-[#DBE4EC] flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={shop.logo}
              alt="Vendor Logo"
              className="w-10 h-10 rounded-xl object-cover border border-[#DBE4EC]"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-sans font-semibold text-text-primary text-sm truncate leading-tight">
                {shop.shopName}
              </span>
              <div className="mt-1">
                {<KycStatusTag kycStatus={vendorKycStatus?.kycStatus} />}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <img
              src={shop.logo}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover border border-[#DBE4EC]"
            />
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin ">
        {navItems.map((item) => {
          if (item.isGroup) {
            const isShopGroup = item.id === "shop";
            const isProductsGroup = item.id === "products";
            // const isOrdersGroup = item.id === 'orders';
            const isOpen = isShopGroup
              ? shopMenuOpen
              : isProductsGroup
                ? productsMenuOpen
                : ordersMenuOpen;
            const setIsOpen = isShopGroup
              ? setShopMenuOpen
              : isProductsGroup
                ? setProductsMenuOpen
                : setOrdersMenuOpen;

            return (
              <div key={item.id} className="space-y-1">
                {!isCollapsed && (
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full relative text-left px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-between hover:text-text-primary transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] transition-all duration-300 ">
                      {" "}
                      {
                        <ChevronRight
                          size={20}
                          className={` ${isOpen ? " rotate-90 transition-all duration-300" : " rotate-0 transition-all duration-300"} `}
                        />
                      }{" "}
                    </span>
                  </button>
                )}

                {/* Sub items */}
                {(isOpen || isCollapsed) && (
                  <div className={`space-y-1 ${!isCollapsed ? "pl-2" : ""}`}>
                    {item.subItems?.map((sub) => {
                      const isSubActive = currentTab === sub.id;
                      const Icon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleTabClick(sub.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-all group  mb-1 ${
                            isSubActive
                              ? "bg-primary-light text-primary font-semibold"
                              : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
                          }`}
                          // title={isCollapsed ? sub.label : ''}
                        >
                          <Icon
                            className={`w-5 h-5 shrink-0 ${isSubActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"}`}
                          />
                          {!isCollapsed && (
                            <span className="truncate">{sub.label}</span>
                          )}
                          {isCollapsed && (
                            <span className="absolute left-15 ml-2 px-2 py-1 bg-text-primary text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              {sub.label}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-all group mb-1 ${
                  isActive
                    ? "bg-primary-light text-primary font-semibold"
                    : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
                }`}
                // title={isCollapsed ? item.label : ''}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"}`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isCollapsed && (
                  <span className="absolute  left-15 ml-2 px-2 py-1 bg-text-primary text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.label}
                  </span>
                )}
              </button>
            );
          }
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-4 border-t border-[#DBE4EC]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 hover:bg-bg-surface text-text-secondary hover:text-text-primary rounded-xl transition-all font-medium text-sm"
        >
          {isCollapsed ? (
            <>
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
