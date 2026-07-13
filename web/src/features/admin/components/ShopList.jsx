import { Power, ExternalLink } from "lucide-react";
import StatusBadge from "../../../components/ui/StatusBadge";
import ButtonRounded from "../../../components/ui/ButtonRounded";
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

export default function ShopList({ shops, onView }) {
  const { updateShopStatus } = useShopStore();

  const handleBanUnban = async (shop) => {
    const newStatus = shop.ShopStatus === "BANNED" ? "ACTIVE" : "BANNED";

    const res = await sendApiRequest(() =>
      updateShopStatus(shop._id, newStatus)
    );

    if (res) {
      dismissToast();
      showSuccess(
        newStatus === "BANNED"
          ? "Shop has been banned successfully."
          : "Shop has been unbanned successfully."
      );
    }
  };

  return (
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
            const status =
              STATUS_STYLE[shop.ShopStatus] || {
                tone: "neutral",
                label: shop.ShopStatus || "Unknown",
              };

            return (
              <tr key={shop._id} className="border-t border-border">
                {/* Logo + Shop Name */}
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

                {/* Business Email */}
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {shop.businessEmail}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge tone={status.tone}>
                    {status.label}
                  </StatusBadge>
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

                    {/* Ban / Unban - Same properties as View button */}
                    <ButtonRounded
                      variant="ghost"
                      size="sm"
                      icon={Power}
                      title={shop.ShopStatus === "BANNED" ? "Unban Shop" : "Ban Shop"}
                      className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                      onClick={() => handleBanUnban(shop)}
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
  );
}