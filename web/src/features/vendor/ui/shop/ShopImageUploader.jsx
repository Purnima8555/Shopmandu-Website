

import { useRef } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";

const ShopImageUploader = ({
  logoPreview,
  bannerPreview,
  onLogoChange,
  onBannerChange,
}) => {
  const bannerRef = useRef(null);
  const logoRef   = useRef(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) onLogoChange(file);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) onBannerChange(file);
  };

  return (
    <div
      className="rounded-2xl border border-[#DBE4EC] overflow-hidden"
      style={{ backgroundColor: "var(--color-card, #fff)" }}
    >
      {/* Banner */}
      <div className="relative h-44 bg-slate-100 group cursor-pointer">
        {bannerPreview ? (
          <img
            src={bannerPreview}
            alt="Banner preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#94A3B8]">
            <ImageIcon className="w-7 h-7" />
            <span className="text-xs font-medium">Click to upload banner</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all
                     flex items-center justify-center"
          onClick={() => bannerRef.current.click()}
        >
          <span className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold">
            <ImageIcon className="w-4 h-4" />
            {bannerPreview ? "Change Banner" : "Upload Banner"}
          </span>
        </div>

        <input
          type="file"
          hidden
          ref={bannerRef}
          onChange={handleBannerChange}
          accept="image/*"
        />
      </div>

      {/* Logo + labels row */}
      <div className="px-5 pb-5 relative flex items-end gap-4 -mt-8">
        {/* Logo bubble */}
        <div
          className="relative w-20 h-20 rounded-2xl bg-white p-1 border border-[#DBE4EC]
                     shadow-md group overflow-hidden shrink-0 z-10 cursor-pointer"
          onClick={() => logoRef.current.click()}
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo preview"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#94A3B8]" />
            </div>
          )}

          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                       transition-all flex items-center justify-center rounded-2xl"
          >
            <Upload className="w-4 h-4 text-white" />
          </div>

          <input
            type="file"
            hidden
            ref={logoRef}
            onChange={handleLogoChange}
            accept="image/*"
          />
        </div>

        <div className="mb-1 pt-8">
          <p className="text-xs font-semibold text-text-primary">Shop Logo</p>
          <p className="text-[10px] text-[#94A3B8] mt-0.5">
            Click the logo or banner to upload
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopImageUploader;
