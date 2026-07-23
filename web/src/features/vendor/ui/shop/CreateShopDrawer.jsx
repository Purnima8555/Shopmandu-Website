import Drawer from "../../../../components/ui/Drawer";

import KycStatusGate from "../vendorKyc/KycStatusGate";
import CreateShopForm from "./CreateShopForm";
import useVendorStore from "../../store/vendor.store";

const KYC_STATUS = Object.freeze({
  APPROVED: "APPROVE",
  PENDING: "PENDING",
  REJECTED: "REJECT",
  NOT_SUBMITTED: null,
});

const CreateShopDrawer = ({ isOpen, onClose }) => {
  const { vendorKycStatus } = useVendorStore();

  const kycStatus = vendorKycStatus?.kycStatus ?? KYC_STATUS.NOT_SUBMITTED;

  const isApproved = kycStatus === KYC_STATUS.APPROVED;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isApproved ? "Create Your Shop" : "Shop Creation Restricted"}
      maxWidth="max-w-2xl"
    >
      {isApproved ? (
        <CreateShopForm onSuccess={onClose} />
      ) : (
        <KycStatusGate kycStatus={kycStatus} />
      )}
    </Drawer>
  );
};

export default CreateShopDrawer;
