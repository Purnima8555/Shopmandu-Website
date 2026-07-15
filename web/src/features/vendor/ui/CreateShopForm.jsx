import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";

import useShopStore from "../../../store/shop";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { dismissToast, showSuccess } from "../../../utils/toast";
import sendApiRequest from "../../../utils/sendApiRequest";
import ShopImageUploader from "./ShopImageUploader";
import { shopSchema } from "../../../schemas/shop.validation";


const CreateShopForm = ({ onSuccess }) => {
  const { createShop } = useShopStore();


  const [selectedLogo,   setSelectedLogo]   = useState(null);
  const [logoPreview,    setLogoPreview]     = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerPreview,  setBannerPreview]   = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  //// form 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      shopName:      "",
      businessEmail: "",
      businessMobile:"",
      shopAddress: {
        location: "",
        city:     "",
        state:    "",
        mobile:   "",
        pincode:  "",
        landmark: "",
      },
      openingHour: { open: "", close: "" },
      description: "",
    },
  });

  //  Image handlers (mirrors handleLogoChange / handleBannerChange) 
  const handleLogoChange = (file) => {
    setSelectedLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (file) => {
    setSelectedBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  //  Submit 
  const onSubmit = async (data) => {
    // Build FormData — backend uses multer with upload.fields([logo, banner])
    const formData = new FormData();

    // Flat text fields
    formData.append("shopName",       data.shopName);
    formData.append("businessEmail",  data.businessEmail);
    formData.append("businessMobile", data.businessMobile);
    formData.append("description",    data.description);

    // Nested objects — backend expects nested field names
    formData.append("shopAddress[location]", data.shopAddress.location);
    formData.append("shopAddress[city]",     data.shopAddress.city);
    formData.append("shopAddress[state]",    data.shopAddress.state);
    formData.append("shopAddress[mobile]",   data.shopAddress.mobile);
    formData.append("shopAddress[pincode]",  data.shopAddress.pincode);
    formData.append("shopAddress[landmark]", data.shopAddress.landmark ?? "");

    formData.append("openingHour[open]",  data.openingHour.open);
    formData.append("openingHour[close]", data.openingHour.close);

    // Files
    if (selectedLogo)   formData.append("logo",   selectedLogo);
    if (selectedBanner) formData.append("banner", selectedBanner);

    setIsSubmitting(true);
    const res = await sendApiRequest(() => createShop(formData));
    setIsSubmitting(false);

    if (!res) return;

    dismissToast();
    showSuccess("Shop created successfully!");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
    
      <ShopImageUploader
        logoPreview={logoPreview}
        bannerPreview={bannerPreview}
        onLogoChange={handleLogoChange}
        onBannerChange={handleBannerChange}
      />

     
      <section>
        <div className="border-b border-slate-100 pb-3 mb-5">
          <h3 className="font-bold text-[#1F2937]">Business Information</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            These details appear on your public storefront.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

          {/* Opening hours */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              label="Opens At"
              {...register("openingHour.open")}
              error={errors.openingHour?.open?.message}
            />
            <Input
              type="time"
              label="Closes At"
              {...register("openingHour.close")}
              error={errors.openingHour?.close?.message}
            />
          </div>
        </div>
      </section>

      {/*  Address  */}
      <section>
        <div className="border-b border-slate-100 pb-3 mb-5">
          <h3 className="font-bold text-[#1F2937]">Shop Address</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Used for delivery and customer discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Street / Location"
              {...register("shopAddress.location")}
              error={errors.shopAddress?.location?.message}
            />
          </div>

          <Input
            label="City"
            {...register("shopAddress.city")}
            error={errors.shopAddress?.city?.message}
          />
          <Input
            label="Province / State"
            {...register("shopAddress.state")}
            error={errors.shopAddress?.state?.message}
          />
          <Input
            label="Postal Code"
            {...register("shopAddress.pincode")}
            error={errors.shopAddress?.pincode?.message}
          />
          <Input
            label="Address Mobile"
            {...register("shopAddress.mobile")}
            error={errors.shopAddress?.mobile?.message}
          />

          <div className="sm:col-span-2">
            <Input
              label="Landmark (optional)"
              {...register("shopAddress.landmark")}
            />
          </div>
        </div>
      </section>

      {/*  Description  */}
      <section>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Shop Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Tell your customers about your shop..."
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all outline-none resize-none ${
            errors.description
              ? "border-red-500"
              : "border-[#DBE4EC] focus:border-[#6A89A7]"
          }`}
        />
        {errors.description && (
          <span className="text-[10px] text-red-500 mt-1 block">
            {errors.description.message}
          </span>
        )}
      </section>

      {/*  Submit  */}
      <div className="flex justify-end pt-2 border-t border-slate-100">
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={Save}
          className="cursor-pointer min-w-[160px]"
        >
          {isSubmitting ? "Creating Shop..." : "Create Shop"}
        </Button>
      </div>
    </form>
  );
};

export default CreateShopForm;