

export const getFormDetails = (shopData) => {
  if (!shopData) return {};
  return {
    shopName: shopData.shopName || "",
    businessEmail: shopData.businessEmail || "",
    businessMobile: shopData.businessMobile || "",
    discription: shopData.discription || "",
    openingHour: {
      open: shopData.openingHour?.open || "09:00",
      close: shopData.openingHour?.close || "21:00",
    },
    shopAddress: {
      location: shopData.shopAddress?.location || "",
      city: shopData.shopAddress?.city || "",
      state: shopData.shopAddress?.state || "",
      pincode: shopData.shopAddress?.pincode || "",
      landmark: shopData.shopAddress?.landmark || "",
      mobile: shopData.shopAddress?.mobile || "",
    },
  };
};
