
import Drawer from "../../../components/ui/Drawer";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import ButtonRounded from "../../../components/ui/ButtonRounded";

const ProductDrawer = ({ product, onClose }) => {
  if (!product) return null;

  const statusTone = {
    ACTIVE: "success",
    INACTIVE: "neutral",
    DRAFT: "warning",
    OUT_OF_STOCK: "danger",
    DISABLED: "danger",
  }[product.productStatus?.toUpperCase()] || "neutral";

  return (
    <Drawer
      isOpen={!!product}
      onClose={onClose}
      title="Product Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">

        {/* Product Information */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Product Information
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Product Name</p>
              <p>{product.name}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Brand</p>
              <p>{product.brand || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Slug</p>
              <p className="font-mono break-all">
                {product.slug}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge tone={statusTone}>
                {product.productStatus}
              </StatusBadge>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Pricing
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Original Price</p>
              <p>Rs. {product.price}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Price after Discount</p>
              <p>
                {product.discountPrice
                  ? `Rs. ${product.discountPrice}`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Discount</p>
              <p>
                {product.discountPercent
                  ? `${product.discountPercent}%`
                  : "0%"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Stock</p>
              <p>{product.stock}</p>
            </div>
          </div>
        </section>

        {/* Description */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Description
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Short Description</p>
              <p>{product.shortDescription || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Full Description</p>
              <p>{product.description || "—"}</p>
            </div>
          </div>
        </section>

        {/* Variants */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Variants
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Colors</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {product.colors?.length ? (
                  product.colors.map((color) => (
                    <span
                      key={color}
                      className="rounded-full bg-surface px-3 py-1 text-xs"
                    >
                      {color}
                    </span>
                  ))
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Sizes</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {product.sizes?.length ? (
                  product.sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-full bg-surface px-3 py-1 text-xs"
                    >
                      {size}
                    </span>
                  ))
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Images */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Images
          </h3>

          {product.images?.length ? (
            <div className="space-y-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <span>Image {index + 1}</span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(image, "_blank")}
                  >
                    View Image
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No images uploaded.
            </p>
          )}
        </section>

        {/* Statistics */}
        <section>
          <h3 className="mb-3 text-sm font-semibold">
            Statistics
          </h3>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <p>{product.rating}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Reviews</p>
              <p>{product.totalReviews}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Sold</p>
              <p>{product.totalSold}</p>
            </div>
          </div>
        </section>

        {/* Metadata */}
        <section className="border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p>
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Updated</p>
              <p>
                {product.updatedAt
                  ? new Date(product.updatedAt).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </section>

      </div>
    </Drawer>
  );
};

export default ProductDrawer;