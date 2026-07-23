import Popup from "../../../../components/ui/Popup";

const ShopStatusPopup = ({ isOpen, selectedShop, onClose, onConfirm }) => {
  const isBanned = selectedShop?.ShopStatus === "BANNED";

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={isBanned ? "Unban Shop" : "Ban Shop"}
      showFooter
      confirmText={isBanned ? "Yes, Unban" : "Yes, Ban"}
      cancelText="Cancel"
      confirmVariant={isBanned ? "primary" : "destructive"}
      onConfirm={onConfirm}
    >
      <p>
        {isBanned
          ? "Are you sure you want to unban this shop?"
          : "Are you sure you want to ban this shop?"}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        {isBanned
          ? "The shop will be able to sell products again."
          : "The shop will no longer be able to operate until it is unbanned."}
      </p>
    </Popup>
  );
};
export default ShopStatusPopup;