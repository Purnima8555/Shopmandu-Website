
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import { ExternalLink, Power } from "lucide-react";

const STATUS_STYLE = {
  active: { tone: "success", label: "Active" },
  disabled: { tone: "danger", label: "Disabled" },
  pending: { tone: "warning", label: "Pending setup" },
};

export default function ShopGrid({ shops, onView }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {shops.map((shop) => {
        const status = STATUS_STYLE[shop.status] || {
          tone: "neutral",
          label: shop.status || "Unknown",
        };

        return (
          <div
            key={shop.id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
          >
            {/* Top Section */}
            <div className="flex items-start justify-between">
              {shop.logo ? (
                <img
                  src={shop.logo}
                  alt={shop.shopName}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${shop.gradient} font-bold text-white`}
                >
                  {shop.initials}
                </div>
              )}

              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            </div>

            {/* Shop Info */}
            <div className="mt-5">
              <h3 className="text-lg font-semibold">{shop.shopName}</h3>
              <p className="mt-1 text-sm text-muted-foreground break-all">
                {shop.businessEmail}
              </p>

              <div className="mt-4 rounded-lg bg-surface p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Shop ID
                </p>
                <p className="mt-1 break-all font-mono text-xs text-foreground">
                  {shop.slugs}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2 border-t border-border pt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => onView && onView(shop)}
                icon={ExternalLink}
                iconPosition="left"
                iconsize={16}
              >
                View Details
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={`flex-1 text-sm font-medium transition ${
                  shop.status === "disabled" || shop.status === "deactivated"
                    ? "bg-success/10 text-success hover:bg-success/20 border-success/30"
                    : "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/30"
                }`}
                icon={Power}
                iconPosition="left"
                iconsize={16}
              >
                {shop.status === "disabled" || shop.status === "deactivated"
                  ? "Activate"
                  : "Deactivate"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}