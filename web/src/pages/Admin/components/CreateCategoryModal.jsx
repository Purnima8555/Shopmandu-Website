
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";

const CreateCategoryModal = ({ onClose }) => {
  const handleSubmit = () => {
    console.log("Category created!");
    // TODO: Add form handling later
    onClose();
  };

  return (
    <Modal
      title="Create Category"
      submitText="Create Category"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="space-y-5">
        <Input
          label="Category Name"
          placeholder="Electronics"
        />

        <Input
          label="Slug"
          placeholder="electronics"
        />

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Category description..."
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div>
            <p className="text-sm font-medium">Active Category</p>
            <p className="text-xs text-muted-foreground">
              Inactive categories won't accept new products.
            </p>
          </div>
          <input type="checkbox" defaultChecked className="h-5 w-5 accent-primary" />
        </div>
      </div>
    </Modal>
  );
};

export default CreateCategoryModal;