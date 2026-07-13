import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../../components/ui/Button";
import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";

import CreateCategoryModal from "../components/CreateCategoryModal";

import useCategoryStore from "../../../store/categoryStore";
import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";

const STATUS_STYLE = {
  true: { tone: "success", label: "Active" },
  false: { tone: "neutral", label: "Inactive" },
};

const CategoriesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { categories, loading, getAllCategories, deleteCategory } =
    useCategoryStore();

  useEffect(() => {
    sendApiRequest(() => getAllCategories());
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    const res = await sendApiRequest(() => deleteCategory(categoryId));

    if (res) {
      dismissToast();
      showSuccess("Category deleted successfully.");
    }
  };

  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => cat.isActive).length;
  const inactiveCategories = totalCategories - activeCategories;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-muted-foreground">
            Manage product categories across the marketplace.
          </p>
        </div>

        <Button onClick={handleCreate} icon={Plus} iconPosition="left">
          Add Category
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">
            Total Categories
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">
            {totalCategories}
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

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">
            Inactive Categories
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">
            {inactiveCategories}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Created At
              </th>
              <th className="px-6 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => {
              const status = STATUS_STYLE[category.isActive];

              return (
                <tr key={category._id} className="border-t border-border">
                  <td className="px-6 py-4">
                    <p className="font-medium">{category.name}</p>
                  </td>

                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {category.slug}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">
                    {category.description || "—"}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <ButtonRounded
                        variant="ghost"
                        size="sm"
                        icon={Pencil}
                        title="Edit"
                        className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(category)}
                      />

                      <ButtonRounded
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        title="Delete"
                        className="cursor-pointer border border-border text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(category._id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No categories found.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateCategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
