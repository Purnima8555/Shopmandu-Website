import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

import { createCategorySchema } from "../../../schemas/category.validation";
import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";
import useCategoryStore from "../../product/store/category.store";

const CreateCategoryModal = ({ category, onClose }) => {
  const {
    createCategory,
    updateCategory,
    loading,
  } = useCategoryStore();

  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
    },
  });

  const watchIsActive = watch("isActive");

  /* Populate form when editing */
  useEffect(() => {
    if (!category) {
      reset({
        name: "",
        slug: "",
        description: "",
        isActive: true,
      });
      return;
    }

    reset({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      isActive: category.isActive ?? true,
    });
  }, [category, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      name: data.name.trim(),
      slug: data.slug.trim().toLowerCase(),
      description: data.description?.trim() || "",
    };

    const res = isEdit
      ? await sendApiRequest(() => updateCategory(category._id, payload))
      : await sendApiRequest(() => createCategory(payload));

    if (!res) return;

    dismissToast();
    showSuccess(
      isEdit
        ? "Category updated successfully."
        : "Category created successfully."
    );

    reset();
    onClose();
  };

  return (
    <Modal
      title={isEdit ? "Edit Category" : "Create Category"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category Name */}
        <div>
          <label className="block text-sm font-medium">
            Category Name
          </label>

          <Input
            placeholder="Electronics"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-0.5 block text-sm font-medium">
            Slug {isEdit ? "(Read Only)" : "(Optional)"}
          </label>
          <Input
            placeholder="electronics"
            error={errors.slug?.message}
            {...register("slug")}
            disabled={isEdit}   // Make slug read-only when editing
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {isEdit
              ? "Slug cannot be changed after creation."
              : " "}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-0.5 block text-sm font-medium">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Category description..."
            {...register("description")}
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-border p-2">
          <div>
            <p className="text-sm font-medium">Active Category</p>
            <p className="text-xs text-muted-foreground">
              Inactive categories won't accept new products.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setValue("isActive", !watchIsActive)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              watchIsActive ? "bg-success" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                watchIsActive ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button type="submit" disabled={loading} className="flex-1">
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Category"
              : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCategoryModal;