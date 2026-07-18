

/// get my shop

import api from "./axios";


// router.post("/shop/create", auth, roleBasedAuth(Roles.VENDOR_ROLE), 
//     upload.fields([
//       {name: 'logo', maxCount: 1},
//       {name: 'banner', maxCount: 1}
//     ]),
//     schemaValidator(shopSchema),
//     createShop
// )

export const createShop = async (shopData) => {
//     const formData = objectToFormData(shopData);

    const response = await api.post("/api/shop/create", shopData);

    return response.data;
};


export const getMyShop = async () => {

 

        const response = await api.get(`/api/vendor/my-shop`);
        return response?.data


}
/// update shop logo


/// update shop banner
export const uploadShopBanner = async (banner) => {
    
        const res = await api.patch(`/api/shop/banner-update`, banner)

        return res?.data
 
}

/// update shop banner
export const uploadShopLogo = async (logo) => {
  
        const res = await api.patch(`/api/shop/logo-update`, logo)

        return res?.data

}

/// get kyc status
export const getKycStatus = async () => {



        const response = await api.get(`/api/vendor/kyc/status`);
        return response

  
}


//// go online and selling product
export const changeMyShopStatus = async (status) => {
  

        const changeShopStatus = await api.patch("/api/shop/status-update", status)
        return changeShopStatus.data

   
}
/// update shop information
export const updateShopInfo = async (shopData) => {
   
        console.log(shopData)
        const updatedShop = await api.put("/api/shop/update", shopData)
        return updatedShop.data
 
}



/// vendor change shop status

/// get shop by slug
export const searchShopsApi = async (params) => {
        const res = await api.get("/api/shops/search", {
        params,
        });

        return res.data;
};

// admin Update shop status
export const updateShopStatusApi = async (shopId, data) => {
        const res = await api.patch(`/api/admin/shops/${shopId}/status`, data);

        return res.data;
};

/// get shop by slug (public shop details page)
export const getShopBySlugApi = async (slug) => {
        const res = await api.get(`/api/shop/${slug}`);
        return res.data;
};

/// get products belonging to a shop (public shop details page)
export const getProductsByShopApi = async (shopId, params = {}) => {
        console.log(params)
        const res = await api.get(`/api/shop/products/${shopId}`, {
                params,
        });
        return res.data;
};
