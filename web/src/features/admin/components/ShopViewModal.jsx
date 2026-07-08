
import Modal from "../../../components/ui/Modal";
import StatusBadge from "../../../components/ui/StatusBadge";

const ViewShopModal = ({ shop, onClose }) => {
  if (!shop) return null;

  const statusStyle = {
    ACTIVE: { tone: "success", label: "Active" },
    active: { tone: "success", label: "Active" },
    DISABLED: { tone: "danger", label: "Disabled" },
    disabled: { tone: "danger", label: "Disabled" },
    PENDING: { tone: "warning", label: "Pending" },
    pending: { tone: "warning", label: "Pending" },
  }[shop.ShopStatus || shop.status] || { tone: "neutral", label: "Unknown" };

  return (
    <Modal
  title="Shop Details"
  onClose={onClose}
  maxWidth="max-w-2xl"
  showFooter={false}
>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {shop.logo ? (
            <img
              src={shop.logo}
              alt={shop.shopName}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${shop.gradient} text-2xl font-bold text-white`}
            >
              {shop.initials}
            </div>
          )}

          <div className="flex-1 pt-1">
            <h2 className="text-2xl font-semibold">{shop.shopName}</h2>
            <p className="text-muted-foreground">{shop.businessEmail}</p>
            <div className="mt-2">
              <StatusBadge tone={statusStyle.tone}>{statusStyle.label}</StatusBadge>
            </div>
          </div>
        </div>

        {/* Shop ID / Slug */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">SHOP ID / SLUG</p>
          <p className="font-mono text-sm break-all mt-1">{shop.slugs || shop._id}</p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">BUSINESS EMAIL</p>
            <p className="mt-1">{shop.businessEmail}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">BUSINESS MOBILE</p>
            <p className="mt-1">{shop.businessMobile || "—"}</p>
          </div>
        </div>

        {/* Address */}
        {shop.shopAddress && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">ADDRESS</p>
            <div className="rounded-lg border border-border bg-surface p-4 text-sm">
              <p>{shop.shopAddress.location}</p>
              <p>
                {shop.shopAddress.city}, {shop.shopAddress.state} - {shop.shopAddress.pincode}
              </p>
              {shop.shopAddress.landmark && <p className="text-muted-foreground">Landmark : {shop.shopAddress.landmark}</p>}
            </div>
          </div>
        )}

        {/* Opening Hours */}
        {shop.openingHour && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">OPENING HOURS</p>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Open:</span>{" "}
                <span className="font-medium">{shop.openingHour.open}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Close:</span>{" "}
                <span className="font-medium">{shop.openingHour.close}</span>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {shop.description && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">DESCRIPTION</p>
            <p className="text-sm leading-relaxed">{shop.description}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewShopModal;