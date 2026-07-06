
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import { Percent, DollarSign } from "lucide-react";

const CreateCouponModal = ({ onClose }) => {
  const handleSubmit = () => {
    console.log("Coupon created!");
    // TODO: Add form handling + API call later
    onClose();
  };

  return (
    <Modal
      title="Create Coupon"
      submitText="Create Coupon"
      onClose={onClose}
      onSubmit={handleSubmit}
      maxWidth="max-w-lg"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Coupon Code"
            placeholder="SAVE10"
            className="font-mono uppercase"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Discount Type
          </label>
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2 text-sm text-primary">
              <Percent className="h-4 w-4" />
              Percentage
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Fixed Amount
            </button>
          </div>
        </div>

        <Input
          label="Discount Value"
          placeholder="20"
        />

        <Input
          label="Minimum Order Amount"
          placeholder="1000"
        />

        <Input
          label="Usage Limit"
          placeholder="Unlimited"
        />

        <Input
          label="Per User Limit"
          placeholder="1"
        />

        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Expiry Date
          </label>
          <input
            type="date"
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateCouponModal;