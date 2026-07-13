import { LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";

import useShopStore from "../../../store/shop";
import sendApiRequest from "../../../utils/sendApiRequest";

import ShopGrid from "../components/ShopGrid";
import ShopList from "../components/ShopList";
import ViewShopModal from "../components/ShopViewModal";

export default function ShopsPage() {
  const [view, setView] = useState("grid");
  const [selectedShop, setSelectedShop] = useState(null);

  const { shops, loading, getAllShops } = useShopStore();

  useEffect(() => {
    sendApiRequest(() => getAllShops());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading shops...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Shops</h1>

          <p className="mt-1 text-muted-foreground">
            Every storefront on the marketplace, at a glance.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded-md p-2 ${
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            onClick={() => setView("list")}
            className={`rounded-md p-2 ${
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Shops */}
      {view === "grid" ? (
        <ShopGrid shops={shops} onView={setSelectedShop} />
      ) : (
        <ShopList shops={shops} onView={setSelectedShop} />
      )}

      {/* View Modal */}
      {selectedShop && (
        <ViewShopModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
        />
      )}
    </div>
  );
}
