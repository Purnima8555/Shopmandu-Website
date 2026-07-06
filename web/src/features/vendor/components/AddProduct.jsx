import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Important
import {
  ArrowLeft,
  Save,
  Sparkles,
  Package,
  Truck,
  Layers,
  Image as ImageIcon,
  X,
  UploadCloud,
} from "lucide-react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Selecter from "../../../components/ui/Selecter";
import useProductStore from "../../../store/productStore";
import useShopStore from "../../../store/shop";
import { dismissToast,  showSuccess } from "../../../utils/toast";
import Loader from "../../../components/common/Loader";
import { productSchema } from "../../../schemas/product.validation";
import sendApiRequest from "../../../utils/sendApiRequest";

const AddProduct = ({ onBack, editingProduct }) => {
  const { categories } = useProductStore();
  const { createNewProduct, loading } = useShopStore();
  const [previews, setPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const initialPreviews = editingProduct?.images || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productStatus: "ACTIVE",
      brand: "Apple",
      categoryId: "Select",
      price: 0,
      discountPercent: 0,
      stock: 0,
      productWeight: 0,
      boxVolume: 0,
      colors: [],
    },
  });

  useEffect(() => {
    if (!editingProduct) return;

    reset({
      ...editingProduct,
      categoryId: editingProduct.categoryId?._id ?? "",
      productWeight: parseFloat(
        editingProduct.productWeight?.$numberDecimal ?? 0,
      ),
      boxVolume: parseFloat(editingProduct.boxVolume?.$numberDecimal ?? 0),
    });
  }, [editingProduct, reset]);

  useEffect(() => {
    if (editingProduct) {
      setPreviews(editingProduct.images ?? []);
    }
  }, [editingProduct?.id]); // or editingProduct?._id

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    if (previews[index].startsWith("blob:"))
      URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Mapping clean data from Zod validation
    Object.keys(data).forEach((key) => {
      if (key !== "colors" && key !== "sizes") {
        formData.append(key, data[key]);
      }
    });

    const colorsArr =
      typeof data.colors === "string"
        ? data.colors.split(",").map((s) => s.trim())
        : [];
    const sizesArr =
      typeof data.sizes === "string"
        ? data.sizes.split(",").map((s) => s.trim())
        : [];

    formData.append("colors", JSON.stringify(colorsArr));
    formData.append("sizes", JSON.stringify(sizesArr));

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    const response = await sendApiRequest(() => createNewProduct(formData));
    if (!response) return;
    dismissToast()
    showSuccess(response?.message || "Success!");
    if (!editingProduct) {
      reset();
      setPreviews([]);
      setSelectedFiles([]);
    }
    setTimeout(() => onBack(), 2000);
  };

  return (
    <div className="space-y-8 animation-fade-in animation-delay-200 max-w-5xl mx-auto p-4 lg:p-0">
      {loading && <Loader fullScreen={true} />}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          type="button"
          className="p-2.5 hover:bg-white border border-transparent hover:border-[var(--color-border)] text-[var(--color-muted-foreground)] rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 italic">
            Zod validated high-converting listing builder.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-[var(--color-text-primary)] border-b border-[var(--color-surface)] pb-3 uppercase tracking-tight text-sm">
              Basic Information
            </h3>

            <div className="space-y-4">
              <Input
                label="Product Title / Name"
                placeholder="e.g. Razer BlackWidow V4 Pro"
                error={errors.name?.message}
                {...register("name")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Brand"
                  placeholder="Apple"
                  error={errors.brand?.message}
                  {...register("brand")}
                />

                <div className="space-y-1.5">
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Selecter
                        label="Category Name"
                        error={errors.categoryId?.message}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="Select">Select</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </Selecter>
                    )}
                  />
                </div>
              </div>

              <Input
                label="Short Description"
                error={errors.shortDescription?.message}
                {...register("shortDescription")}
              />
              <Input
                label="URL Slug"
                error={errors.slug?.message}
                {...register("slug")}
              />

              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-secondary-foreground)]">
                  Product Long Description
                </label>
                <textarea
                  {...register("description")}
                  rows={5}
                  className={`w-full rounded-xl border ${errors.description ? "border-red-500" : "border-[var(--color-border)]"} bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition-all focus:border-[var(--color-primary)]`}
                />
                {errors.description && (
                  <p className="text-[10px] text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-[var(--color-primary)]" />{" "}
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Price (RS.)"
                type="number"
                error={errors.price?.message}
                {...register("price")}
              />
              <Input
                label="Discount %"
                max={100}
                type="number"
                error={errors.discountPercent?.message}
                {...register("discountPercent")}
              />
              <Input
                label="Stock / Qty"
                min={1}
                type="number"
                error={errors.stock?.message}
                {...register("stock")}
              />
            </div>
          </div>

          <div className="bg-[var(--color-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />{" "}
              Product Media
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((src, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-[var(--color-border)]"
                >
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] cursor-pointer">
                <UploadCloud className="w-8 h-8 text-[var(--color-muted-foreground)] mb-1" />
                <span className="text-[10px] font-bold">Upload</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept=".jpg,.png,.webp,.avif"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="secondary" onClick={onBack} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              icon={Save}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-8"
            >
              {loading
                ? "Processing..."
                : editingProduct
                  ? "Update Listing"
                  : "Publish Listing"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 via-white border border-[var(--color-primary-light)] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />{" "}
              <h3 className="font-bold">AI Assistant</h3>
            </div>
            <button
              type="button"
              className="w-full cursor-pointer p-3 border border-[var(--color-border)] rounded-xl text-xs font-bold hover:bg-indigo-50 hover:border-indigo-400/80 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" /> Generate
              Description
            </button>
          </div>

          <div className="bg-[var(--color-card)] p-5 border border-[var(--color-border)] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest">
              <Truck className="w-4 h-4 inline mr-2" /> Logistics
            </h3>
            <Input
              label="Weight (KG)"
              type="number"
              size="sm"
              step="any"
              error={errors.productWeight?.message}
              {...register("productWeight")}
            />
            <Input
              label="Volume (cm³)"
              type="number"
              size="sm"
              error={errors.boxVolume?.message}
              {...register("boxVolume")}
            />
          </div>

          <div className="bg-[var(--color-card)] p-5 border border-[var(--color-border)] rounded-2xl">
            <h3 className="text-[10px] font-bold mb-3 uppercase">Status</h3>
            <Selecter
              error={errors.productStatus?.message}
              {...register("productStatus")}
            >
              <option value="ACTIVE">Active (Live)</option>
              <option value="INACTIVE">Draft</option>
            </Selecter>
          </div>

          <div className="bg-[var(--color-card)] p-5 border border-[var(--color-border)] rounded-2xl space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest">
              <Layers className="w-4 h-4 inline mr-2" /> Variations
            </h3>
            <Input
              label="Colors"
              placeholder="Black, Silver"
              size="sm"
              error={errors.colors?.message}
              {...register("colors")}
            />
            <Input
              label="Sizes"
              placeholder="Small, Large"
              size="sm"
              error={errors.sizes?.message}
              {...register("sizes")}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
