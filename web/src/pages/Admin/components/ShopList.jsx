
import { Power, ExternalLink } from "lucide-react";
import StatusBadge from "../../../components/ui/StatusBadge";
import ButtonRounded from "../../../components/ui/ButtonRounded";

const STATUS_STYLE = {
  active: { tone: "success", label: "Active" },
  disabled: { tone: "danger", label: "Disabled" },
  pending: { tone: "warning", label: "Pending Setup" },
};

export default function ShopList({ shops, onView }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_2fr_2fr_1fr_auto] gap-4 px-6 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>Logo</span>
        <span>Shop ID</span>
        <span>Business Email</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Table Rows */}
      {shops.map((shop) => {
        const status =
          STATUS_STYLE[shop.status] || {
            tone: "neutral",
            label: shop.status || "Unknown",
          };

        return (
          <div
            key={shop.id ?? shop.shopName}
            className="grid grid-cols-[2fr_2fr_2fr_1fr_auto] items-center gap-4 border-t border-border px-6 py-4 transition hover:bg-surface"
          >
            {/* Logo + Shop Name */}
            <div className="flex items-center gap-3">
              {shop.logo ? (
                <img
                  src={shop.logo}
                  alt={shop.shopName}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${shop.gradient} text-xs font-bold text-white`}
                >
                  {shop.initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-medium">{shop.shopName}</p>
              </div>
            </div>

            {/* Shop ID */}
            <p className="truncate font-mono text-xs text-muted-foreground">
              {shop.slugs}
            </p>

            {/* Business Email */}
            <p className="truncate text-sm text-muted-foreground">
              {shop.businessEmail}
            </p>

            {/* Status */}
            <div className="inline-block">
              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <ButtonRounded
                variant="ghost"
                size="sm"
                icon={ExternalLink}
                onClick={() => onView && onView(shop)}
                title="View Details"
              />

              <ButtonRounded
                variant="ghost"
                size="sm"
                icon={Power}
                title={shop.status === "disabled" ? "Activate" : "Deactivate"}
                className={`${
                  shop.status === "disabled"
                    ? "text-success hover:bg-success/10"
                    : "text-destructive hover:bg-destructive/10"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}