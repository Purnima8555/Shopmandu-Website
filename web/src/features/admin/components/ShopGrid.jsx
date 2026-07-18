import { useState } from "react";
import { Power, ExternalLink } from "lucide-react";

import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import Popup from "../../../components/ui/Popup";

import useShopStore from "../../../store/shop";
import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";

const STATUS_STYLE = {
  ACTIVE: { tone: "success", label: "Active" },
  BANNED: { tone: "danger", label: "Banned" },
  PENDING: { tone: "warning", label: "Pending" },
  SUSPENDED: { tone: "warning", label: "Suspended" },
  CLOSED: { tone: "neutral", label: "Closed" },
  DEACTIVATED: { tone: "neutral", label: "Deactivated" },
};

export default function ShopGrid({ shops, onView }) {
  const { updateShopStatus } = useShopStore();

  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  // Open confirmation popup
  const handleOpenStatusPopup = (shop) => {
    setSelectedShop(shop);
    setShowStatusPopup(true);
  };

  // Confirm ban/unban
  const handleConfirmStatus = async () => {
    if (!selectedShop) return;

    const newStatus =
      selectedShop.ShopStatus === "BANNED"
        ? "ACTIVE"
        : "BANNED";

    const res = await sendApiRequest(() =>
      updateShopStatus(selectedShop._id, newStatus)
    );

    if (res) {
      dismissToast();

      showSuccess(
        newStatus === "BANNED"
          ? "Shop has been banned successfully."
          : "Shop has been unbanned successfully."
      );
    }

    setShowStatusPopup(false);
    setSelectedShop(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shops.map((shop) => {
          const status =
            STATUS_STYLE[shop.ShopStatus] || {
              tone: "neutral",
              label: shop.ShopStatus || "Unknown",
            };

          return (
            <div
              key={shop._id}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={shop.shopName}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
                    {shop.shopName?.charAt(0).toUpperCase()}
                  </div>
                )}

                <StatusBadge tone={status.tone}>
                  {status.label}
                </StatusBadge>
              </div>

              {/* Shop Information */}
              <div className="mt-5">
                <h3 className="text-lg font-semibold">
                  {shop.shopName}
                </h3>

                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {shop.businessEmail}
                </p>

                {shop.shopAddress && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {shop.shopAddress.city},{" "}
                    {shop.shopAddress.state}
                  </p>
                )}

                <div className="mt-4 rounded-lg bg-surface p-3">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Shop Slug
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-foreground">
                    {shop.slugs}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2 border-t border-border pt-4">
                {/* View */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  icon={ExternalLink}
                  iconPosition="left"
                  iconsize={16}
                  onClick={() => onView?.(shop)}
                >
                  View Details
                </Button>

                {/* Ban / Unban */}
                <Button
                  variant="outline"
                  size="sm"
                  icon={Power}
                  iconPosition="left"
                  iconsize={16}
                  className={`flex-1 text-sm font-medium transition ${
                    shop.ShopStatus === "BANNED"
                      ? "border-success/30 bg-success/10 text-success hover:bg-success/20"
                      : "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  }`}
                  onClick={() => handleOpenStatusPopup(shop)}
                >
                  {shop.ShopStatus === "BANNED"
                    ? "Unban"
                    : "Ban"}
                </Button>
              </div>
            </div>
          );
        })}

        {shops.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No shops found.
          </div>
        )}
      </div>

      {/* Confirmation Popup */}
      <Popup
        isOpen={showStatusPopup}
        onClose={() => {
          setShowStatusPopup(false);
          setSelectedShop(null);
        }}
        title={
          selectedShop?.ShopStatus === "BANNED"
            ? "Unban Shop"
            : "Ban Shop"
        }
        showFooter
        confirmText={
          selectedShop?.ShopStatus === "BANNED"
            ? "Yes, Unban"
            : "Yes, Ban"
        }
        cancelText="Cancel"
        onConfirm={handleConfirmStatus}
      >
        <p>
          {selectedShop?.ShopStatus === "BANNED"
            ? "Are you sure you want to unban this shop?"
            : "Are you sure you want to ban this shop?"}
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          {selectedShop?.ShopStatus === "BANNED"
            ? "The shop will be able to sell products again."
            : "The shop will no longer be able to operate until it is unbanned."}
        </p>
      </Popup>
    </>
  );
}