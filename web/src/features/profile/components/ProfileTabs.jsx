import React from "react";

// Import tab content components
import MyOrders from "../pages/MyOrders";
import MyAddresses from "../pages/MyAddresses";
import ReturnRequest from "../pages/ReturnRequest";
import Settings from "../pages/Settings";

const tabs = [
    { key: "orders", label: "Orders" },
    { key: "addresses", label: "Addresses" },
    { key: "returns", label: "Return Requests" },
    { key: "settings", label: "Settings" },
];

export default function ProfileTabs({
    activeTab,
    setActiveTab,
}) {
    return (
        <>
            {/* Tabs Navigation */}
            <div className="mb-8 flex items-center gap-1 overflow-x-auto border-b border-[#E7E3D8]">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative cursor-pointer whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? "text-[#23241F]"
                                : "text-[#6B6A63] hover:text-[#23241F]"
                        }`}
                    >
                        {tab.label}

                        {activeTab === tab.key && (
                            <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-primary transition-all duration-300" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "orders" && <MyOrders />}
            {activeTab === "addresses" && <MyAddresses />}
            {activeTab === "returns" && <ReturnRequest />}
            {activeTab === "settings" && <Settings />}
        </>
    );
}