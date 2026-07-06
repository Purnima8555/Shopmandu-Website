import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import useAdminStore from "../../store/adminStore";
import StatusBadge from "../../components/ui/StatusBadge";
import CreateCategoryModal from "../Admin/components/CreateCategoryModal";
import Button from "../../components/ui/Button";
import ButtonRounded from "../../components/ui/ButtonRounded";

const STATUS_STYLE = {
  true: {
    tone: "success",
    label: "Active",
  },
  false: {
    tone: "neutral",
    label: "Inactive",
  },
};

const CategoriesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    categories,
    loading,
    getAllCategories,
    deleteCategory,
  } = useAdminStore();

  useEffect(() => {
    getAllCategories();
  }, []);

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Categories
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage product categories across the marketplace.
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          icon={Plus}
          iconPosition="left"
        >
          Add Category
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">
            Total Categories
          </p>

          <p className="mt-2 font-mono text-2xl font-semibold">
            {categories.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">
            Active Categories
          </p>

          <p className="mt-2 font-mono text-2xl font-semibold">
            {activeCategories}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Header */}
        <div className="grid grid-cols-[1.2fr_1.2fr_2fr_1fr_1fr_auto] gap-2 px-5 py-3 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span>Category</span>
          <span>Slug</span>
          <span>Description</span>
          <span>Products</span>
          <span>Status</span>
          <span className="text-right">
            Actions
          </span>
        </div>

        {/* Rows */}
        {categories.map((category) => {
          const status =
            STATUS_STYLE[category.isActive];

          return (
            <div
              key={category._id}
              className="grid grid-cols-[1.2fr_1.2fr_2fr_1fr_1fr_auto] items-center gap-2 border-t border-border px-5 py-4 text-sm hover:bg-surface transition"
            >
              {/* Category */}
              <div>
                <p className="font-medium">
                  {category.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {new Date(
                    category.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              {/* Slug */}
              <span className="font-mono text-xs text-muted-foreground">
                {category.slug}
              </span>

              {/* Description */}
              <span className="truncate text-muted-foreground">
                {category.description || "-"}
              </span>

              {/* Products */}
              <span className="font-mono">
                {category.productCount ?? 0}
              </span>

              {/* Status */}
              <StatusBadge tone={status.tone}>
                {status.label}
              </StatusBadge>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <ButtonRounded
                  variant="outline"
                  size="default"
                  icon={Pencil}
                  title="Edit"
                />

                <ButtonRounded
                  variant="outline"
                  size="default"
                  icon={Trash2}
                  title="Delete"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    deleteCategory(category._id)
                  }
                />
              </div>
            </div>
          );
        })}

        {!loading && categories.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No categories found.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateCategoryModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;