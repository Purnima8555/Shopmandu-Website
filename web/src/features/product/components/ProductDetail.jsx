

import { useEffect, useState } from "react";
import { IoIosHeartEmpty, IoMdAdd, IoMdRemove } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import { FiRotateCcw, FiPlay, FiSearch } from "react-icons/fi"; // Added FiSearch for the message
import { FaStar, FaRegStar, FaLongArrowAltRight } from "react-icons/fa";
import Button from "../../../components/ui/Button";
import ButtonRounded from "../../../components/ui/ButtonRounded";
import { useParams } from "react-router-dom";
import useProductStore from "../../../store/productStore";

export const ProductDetail = () => {
  const { slug } = useParams();
  const { productDetail, getProductDetail, loading } = useProductStore();

  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Zoom State
  const [zoomStyle, setZoomStyle] = useState({
    display: "none",
    backgroundPosition: "0% 0%",
    backgroundSize: "200%",
  });

  // 1. Fetch Product Data on Slug change
  useEffect(() => {
    if (slug) {
      getProductDetail(slug);
    }
  }, [slug, getProductDetail]);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [slug]);

  // 2. Initialize Selection States when productDetail is loaded
  useEffect(() => {
    if (productDetail) {
      if (productDetail.sizes?.length > 0) setSelectedSize(productDetail.sizes[0]);
      if (productDetail.colors?.length > 0) setSelectedColor(productDetail.colors[0]);
      setCurrentImgIndex(0);
    }
  }, [productDetail]);

  // --- START LOADING AND MISSING DATA LOGIC ---
  
  // Show Spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Beautiful empty message when productDetail is not found
  if (!productDetail._id) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-50 p-6 rounded-full">
              <FiSearch className="text-6xl text-gray-200" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Sorry, we couldn't find the product details you're looking for. It might have been moved or is currently unavailable.
          </p>
          <a href="/" className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-sm hover:bg-opacity-90 transition-all">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  // --- END LOADING AND MISSING DATA LOGIC ---

  // Helper for Rating Stars
  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      return index < Math.floor(productDetail.rating) ? (
        <FaStar key={index} />
      ) : (
        <FaRegStar key={index} className="text-gray-300" />
      );
    });
  };

  // Precision Zoom logic using current images from data
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${productDetail.images[currentImgIndex]})`,
      backgroundSize: "200%",
    });
  };

  return (
    <section className="bg-white min-h-screen py-10 px-4 md:px-10 lg:px-20 text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* LEFT SIDE: Image gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {productDetail.images?.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setCurrentImgIndex(i)}
                  className={`min-w-[80px] w-20 h-20 bg-surface rounded-sm flex items-center justify-center p-2 border transition-all ${
                    currentImgIndex === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={productDetail.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* MAIN IMAGE WITH ZOOM */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({ ...zoomStyle, display: "none" })}
              className="relative flex-1 bg-surface rounded-sm border border-border aspect-square overflow-hidden cursor-crosshair flex items-center justify-center p-8"
            >
              <img
                src={productDetail.images?.[currentImgIndex]}
                alt={productDetail.name}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                  zoomStyle.display === "block" ? "opacity-0" : "opacity-100"
                }`}
              />
              <div className="absolute inset-0 pointer-events-none" style={zoomStyle} />
            </div>
          </div>

          {/* RIGHT SIDE: Information */}
          <div className="flex flex-col pt-1">
            <h1 className="text-2xl font-semibold mb-3">{productDetail.name}</h1>

            <div className="flex items-center gap-3 text-sm mb-4">
              <div className="flex text-[#FFAD33] gap-0.5">{renderStars()}</div>
              <span className="text-gray-400 border-r border-gray-300 pr-3 font-normal">
                ({productDetail.totalReviews} Reviews)
              </span>
              <span className={productDetail.stock > 0 ? "text-[#00FF66] font-medium" : "text-danger font-medium"}>
                {productDetail.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-2xl font-normal text-black tracking-tight">
                Rs. {productDetail.discountPrice}
              </div>
              {productDetail.price > productDetail.discountPrice && (
                <div className="text-xl text-gray-400 line-through">
                  Rs. {productDetail.price}
                </div>
              )}
            </div>

            <p className="text-[13px] leading-relaxed text-gray-800 mb-8 border-b border-gray-300 pb-8 ">
              {productDetail.shortDescription || productDetail.description?.substring(0, 150) + "..."}
            </p>

            <div className="space-y-6">
              {/* Dynamic Colors mapping */}
              {productDetail.colors?.length > 0 && (
                <div className="flex items-center gap-6">
                  <span className="text-lg font-normal w-16">Colors:</span>
                  <div className="flex gap-3">
                    {productDetail.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        title={c}
                        className={`w-5 h-5 rounded-full ring-offset-1 ring-1 transition-all flex items-center justify-center border border-gray-200 ${
                          selectedColor === c ? "ring-black scale-110" : "ring-transparent opacity-60"
                        }`}
                        style={{ backgroundColor: c.toLowerCase() }} // Note: This works if string is "Black", "Blue" etc
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Sizes mapping */}
              {productDetail.sizes?.length > 0 && (
                <div className="flex items-center gap-6">
                  <span className="text-lg font-normal w-16">Size:</span>
                  <div className="flex gap-2.5">
                    {productDetail.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[40px] px-2 h-8 rounded-sm border text-xs font-medium transition-all ${
                          selectedSize === s ? "bg-primary text-white border-primary/20" : "border-gray-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Rows */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex h-11 border border-gray-400 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 flex items-center justify-center border-r border-gray-400 hover:bg-gray-100"
                  >
                    <IoMdRemove />
                  </button>
                  <div className="w-16 flex items-center justify-center font-bold">{quantity}</div>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 flex items-center justify-center border-l border-gray-400 hover:bg-[#db4444] hover:text-white"
                  >
                    <IoMdAdd />
                  </button>
                </div>

                <Button className="h-11 px-10 bg-primary hover:opacity-90 rounded-sm font-medium">
                  Buy Now
                </Button>

                <ButtonRounded
                  variant="secondary"
                  icon={IoIosHeartEmpty}
                  className="rounded-sm cursor-pointer h-11 w-11"
                />
              </div>

              {/* Delivery info (Fixed labels) */}
              <div className="border border-gray-400 rounded-sm mt-8 divide-y divide-gray-400 overflow-hidden max-w-md">
                <div className="flex items-center p-4 gap-4">
                  <TbTruckDelivery className="text-3xl" />
                  <div>
                    <p className="text-sm font-bold">Free Delivery</p>
                    <p className="text-[11px] underline">Enter your zip for Delivery Availability</p>
                  </div>
                </div>
                <div className="flex items-center p-4 gap-4">
                  <FiRotateCcw className="text-2xl ml-1" />
                  <div>
                    <p className="text-sm font-bold">Return Delivery</p>
                    <p className="text-[11px]">
                      Free 30 Days Returns. <span className="underline cursor-pointer">Details</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Switching */}
        <div className="mt-20">
          <div className="flex gap-10 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide pb-px">
            {["Description", "Additional Info", "Reviews", "Video"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t.toLowerCase())}
                className={`pb-4 text-xl font-medium relative transition-all ${
                  activeTab === t.toLowerCase()
                    ? "text-black underline underline-offset-[16px] decoration-2"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pb-10 max-w-6xl">
            {activeTab === "description" && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold mb-4">Product Details</h3>
                <p className="text-sm text-gray-500 leading-relaxed  mb-10 whitespace-pre-wrap">
                  {productDetail.description}
                </p>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold mb-5">Product Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex gap-4 items-start">
                        <FaLongArrowAltRight className="mt-1 text-sm text-primary" />
                        <p className="text-[13px] text-gray-500">Weight: {productDetail.productWeight?.$numberDecimal} kg</p>
                     </div>
                     <div className="flex gap-4 items-start">
                        <FaLongArrowAltRight className="mt-1 text-sm text-gray-900" />
                        <p className="text-[13px] text-gray-500">Stock Availability: {productDetail.stock} units</p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "additional info" && (
              <div className="py-6 space-y-4">
                 <p className="text-sm text-gray-600 font-medium">Box Volume: {productDetail.boxVolume?.$numberDecimal} mm³</p>
                 {/* <p className="text-sm text-gray-600 font-medium">SKU ID: {productDetail._id}</p> */}
                 <p className="text-sm text-gray-500  italic">No other specific technical details provided for this listing.</p>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div className="text-center py-20 bg-surface rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Customer Feedback ({productDetail.totalReviews})</p>
                <div className="flex justify-center text-highlight mb-4">{renderStars()}</div>
                <p className="text-xs text-gray-400">Total Reviews will be loaded after verified purchase.</p>
              </div>
            )}

            {activeTab === "video" && (
              <div className="aspect-video w-full max-w-4xl bg-gray-100 rounded flex flex-col items-center justify-center group cursor-pointer shadow-inner relative overflow-hidden">
                {productDetail.videos?.length > 0 ? (
                    <video className="w-full h-full object-cover" controls src={productDetail.videos[0]} />
                ) : (
                    <>
                        <FiPlay className="text-5xl text-gray-300 group-hover:text-primary transition-colors mb-2" />
                        <span className="text-xs font-medium text-gray-400">Video Content is not available for this product</span>
                    </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
