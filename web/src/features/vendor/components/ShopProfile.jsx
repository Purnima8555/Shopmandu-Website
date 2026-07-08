import { useRef, useState, useEffect } from "react";
import useShopStore from "../../../store/shop";
import { Save, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { dismissToast, showSuccess } from "../../../utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shopSchema } from "../../../schemas/shop.validation";
import { getFormDetails } from "../util/shopProfile.helper";
import sendApiRequest from "../../../utils/sendApiRequest";

const ShopProfile = () => {
  const {
    shop,
    updateShopLogo,
    updateShopBanner,
    updateShopInfo,
    updateShopStatus,
  } = useShopStore();

  const bannerRef = useRef(null);
  const logoRef = useRef(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUploading, setIsUploading] = useState({
    logo: false,
    banner: false,
    info: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: getFormDetails(shop),
  });

  useEffect(() => {
    if (shop?._id) {
      // Only reset if we actually have shop data
      const filteredData = getFormDetails(shop);
      reset(filteredData);
    }
  }, [shop?._id, reset, shop]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const submitLogo = async () => {
    if (!selectedLogo) return;
    setIsUploading((prev) => ({ ...prev, logo: true }));
    const formData = new FormData();
    formData.append("logo", selectedLogo);

    const res = await sendApiRequest(() => updateShopLogo(formData));

    setIsUploading((prev) => ({ ...prev, logo: false }));
    if (!res) return;
    dismissToast()
    showSuccess("Logo updated!");
    setSelectedLogo(null);
    setLogoPreview(null);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const submitBanner = async () => {
    if (!selectedBanner) return;
    setIsUploading((prev) => ({ ...prev, banner: true }));

    const formData = new FormData();
    formData.append("banner", selectedBanner);
    const res = await sendApiRequest(() => updateShopBanner(formData));
    setIsUploading((prev) => ({ ...prev, banner: false }));
    if (!res) return;
    dismissToast()
    showSuccess("Banner updated!");
    setSelectedBanner(null);
    setBannerPreview(null);
  };

  // --- STATUS UPDATE (FIXED TOGGLE) ---
  const handleToggleStatus = async () => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);

    // We expect "ACTIVE" or "CLOSED"
    const newStatus = shop.ShopStatus === "ACTIVE" ? "CLOSED" : "ACTIVE";
    const res =  await sendApiRequest(()=>updateShopStatus({ status: newStatus }));
       setIsUpdatingStatus(false);
       if (!res) return;
       dismissToast()
      showSuccess(`Store is now ${newStatus}`);
    
  };

  const onInfoSubmit = async (data) => {
    setIsUploading((prev) => ({ ...prev, info: true }));
      const res = await updateShopInfo(data);
      setIsUploading((prev) => ({ ...prev, info: false }));
      if(!res) return;
      if (res?.data) {
        reset(getFormDetails(res.data)); // Keep form clean after update
      }
      dismissToast()
      showSuccess("Shop details updated!");
   
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animation-fade-in animation-delay-200 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Shop Profile
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Configure your public storefront banner, logo, and details.
        </p>
      </div>

      {/* Banner & Logo section (FormData) */}
      <div className="bg-white rounded-2xl border border-[#DBE4EC] overflow-hidden shadow-sm">
        <div className="relative h-72 bg-slate-100 group">
          <img
            src={
              bannerPreview || shop?.banner || "https://placehold.co/1200x400"
            }
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => bannerRef.current.click()}
              className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold"
            >
              <ImageIcon className="w-4 h-4" /> Change Banner
            </button>
            {selectedBanner && (
              <button
                onClick={submitBanner}
                disabled={isUploading.banner}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                {isUploading.banner ? (
                  <Loader2 className="w-4 h-4 animate-spin-smooth" />
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
          <input
            type="file"
            hidden
            ref={bannerRef}
            onChange={handleBannerChange}
            accept="image/*"
          />
        </div>

        <div className="px-6 pb-6 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-end gap-4 -mt-10 relative z-10">
            <div className="relative w-24 h-24 rounded-2xl bg-white p-1 border border-[#DBE4EC] shadow-md group overflow-hidden">
              <img
                src={logoPreview || shop?.logo}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => logoRef.current.click()}
                  className="bg-white p-1.5 rounded-lg"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              <input
                type="file"
                hidden
                ref={logoRef}
                onChange={handleLogoChange}
                accept="image/*"
              />
            </div>
            <div className="mb-2">
              <h3 className="font-bold text-lg text-[#1F2937]">
                {shop?.shopName}
              </h3>
              {selectedLogo && (
                <button
                  onClick={submitLogo}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  {isUploading.logo ? "Updating..." : "[ Apply New Logo ]"}
                </button>
              )}
            </div>
          </div>

          {/* Toggle Status - Corrected Logic */}
          <div className="flex items-center gap-4 rounded-xl border border-[#DBE4EC] bg-[#F1F5F9] p-4">
            <div>
              <span className="block text-[10px] font-bold uppercase text-[#64748B]">
                Status
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${shop?.ShopStatus === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                />
                <span
                  className={`text-sm font-bold ${shop?.ShopStatus === "ACTIVE" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {shop?.ShopStatus}
                </span>
              </div>
            </div>
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={handleToggleStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                shop?.ShopStatus === "ACTIVE" ? "bg-[#6A89A7]" : "bg-[#CBD5E1]"
              } ${isUpdatingStatus ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  shop?.ShopStatus === "ACTIVE"
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Info Form - Corrected Validation path */}
      <form
        onSubmit={handleSubmit(onInfoSubmit)}
        className="bg-white p-6 rounded-2xl border border-[#DBE4EC] shadow-sm space-y-8"
      >
        <div className="border-b border-slate-50 pb-4">
          <h3 className="font-bold text-lg text-[#1F2937]">
            Business Information
          </h3>
          <p className="text-xs text-[#64748B]">
            Updating these details will update your public storefront
            information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Shop Name"
            {...register("shopName")}
            error={errors.shopName?.message}
          />
          <Input
            label="Support Email"
            {...register("businessEmail")}
            error={errors.businessEmail?.message}
          />
          <Input
            label="Business Mobile"
            {...register("businessMobile")}
            error={errors.businessMobile?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              label="Opens At"
              {...register("openingHour.open")}
            />
            <Input
              type="time"
              label="Closes At"
              {...register("openingHour.close")}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Address"
              {...register("shopAddress.location")}
              error={errors.shopAddress?.location?.message}
            />
          </div>

          <Input label="City" {...register("shopAddress.city")} />
          <Input label="Province/State" {...register("shopAddress.state")} />
          <Input label="Postal Code" {...register("shopAddress.pincode")} />
          <Input label="Landmark" {...register("shopAddress.landmark")} />

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Shop Description
            </label>
            <textarea
              {...register("discription")}
              rows={4}
              placeholder="Tell your customers about your shop..."
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all outline-none ${
                errors.discription
                  ? "border-red-500"
                  : "border-[#DBE4EC] focus:border-[#6A89A7]"
              }`}
            />
            {errors.discription && (
              <span className="text-[10px] text-red-500">
                {errors.discription.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            disabled={isUploading.info}
            icon={Save}
            type="submit"
            className="cursor-pointer min-w-[150px]"
          >
            {isUploading.info ? "Processing..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShopProfile;
