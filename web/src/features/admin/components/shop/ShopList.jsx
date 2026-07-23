import { useState } from "react";
import { Power, ExternalLink } from "lucide-react";
import StatusBadge from "../../../../components/ui/StatusBadge";
import ButtonRounded from "../../../../components/ui/ButtonRounded";
import sendApiRequest from "../../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../../utils/toast";
import ShopStatusPopup from "./ShopStatusPopup";

import { STATUS_STYLE } from "./data";
import useShopStore from "../../../shop/store/shop.store";

export default function ShopList({ shops, onView }) {
  const { updateShopStatus } = useShopStore();
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  // Open confirmation popup
  const handleOpenStatusPopup = (shop) => {
    setSelectedShop(shop);
    setShowStatusPopup(true);
  };
  // Confirm Ban / Unban
  const handleConfirmStatus = async () => {
    if (!selectedShop) return;
    const newStatus =
      selectedShop.ShopStatus === "BANNED" ? "ACTIVE" : "BANNED";
    const res = await sendApiRequest(() =>
      updateShopStatus(selectedShop._id, newStatus),
    );
    if (res) {
      dismissToast();
      showSuccess(
        newStatus === "BANNED"
          ? "Shop has been banned successfully."
          : "Shop has been unbanned successfully.",
      );
    }
    setShowStatusPopup(false);
    setSelectedShop(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Logo
              </th>

              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Shop Slug
              </th>

              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Business Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {shops.map((shop) => {
              const status = STATUS_STYLE[shop.ShopStatus] || {
                tone: "neutral",
                label: shop.ShopStatus || "Unknown",
              };

              return (
                <tr key={shop._id} className="border-t border-border">
                  {/* Logo */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {shop.logo ? (
                        <img
                          src={shop.logo}
                          alt={shop.shopName}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                          {shop.shopName?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-medium">{shop.shopName}</p>

                        {shop.shopAddress && (
                          <p className="truncate text-xs text-muted-foreground">
                            {shop.shopAddress.city}, {shop.shopAddress.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Shop Slug */}
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {shop.slugs}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {shop.businessEmail}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* View */}
                      <ButtonRounded
                        variant="ghost"
                        size="sm"
                        icon={ExternalLink}
                        title="View Details"
                        className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                        onClick={() => onView?.(shop)}
                      />
                      {/* Ban / Unban */}
                      <ButtonRounded
                        variant="ghost"
                        size="sm"
                        icon={Power}
                        title={
                          shop.ShopStatus === "BANNED"
                            ? "Unban Shop"
                            : "Ban Shop"
                        }
                        className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenStatusPopup(shop)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shops.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No shops found.
          </div>
        )}
      </div>
      {/* Confirmation Popup */}
      <ShopStatusPopup
        isOpen={showStatusPopup}
        selectedShop={selectedShop}
        onClose={() => {
          setShowStatusPopup(false);
          setSelectedShop(null);
        }}
        onConfirm={handleConfirmStatus}
      />
    </>
  );
}
