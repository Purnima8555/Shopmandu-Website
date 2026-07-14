import Drawer from "../../../components/ui/Drawer";

const ProductView = ({ open, onClose, product }) => {
  if (!product) return null;

  const info = [
    ["Brand", product.brand],
    ["Category", product.categoryId?.name],
    ["Price", `Rs. ${product.price}`],
    ["Discount Price", `Rs. ${product.discountPrice}`],
    ["Discount", `${product.discountPercent}%`],
    ["Stock", product.stock],
    ["Reserved", product.inReserve],
    ["Sold", product.totalSold],
    ["Rating", product.rating],
    ["Reviews", product.totalReviews],
    ["Weight", product.productWeight?.$numberDecimal + " kg"],
    ["Volume", product.boxVolume?.$numberDecimal + " ml"],
    ["Status", product.productStatus],
    ["Flash Sale", product.flashSales ? "Yes" : "No"],
    ["Created", new Date(product.createdAt).toLocaleDateString()],
    ["Updated", new Date(product.updatedAt).toLocaleDateString()],
  ];

  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      title="Product Details"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">

        {/* Images */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-semibold">
              {product.name}
            </h2>

            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
              {product.productStatus}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
          {info.map(([label, value]) => (
            <div key={label}>
              <p className="text-gray-500">{label}</p>
              <p className="font-medium">
                {value || "-"}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">
            Description
          </h3>

          <p className="text-sm text-gray-600 leading-7">
            {product.description || "-"}
          </p>
        </div>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">
              Sizes
            </h3>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">
              Colors
            </h3>

            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ProductView;