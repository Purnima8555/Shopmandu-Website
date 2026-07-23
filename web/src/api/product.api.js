

/// get all product 

import api from "./axios";

export const getAllProductsApi = async (params) => {

    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/api/products/public?${queryParams}`);

    // console.log("Response: ",response)
    return response?.data

}

/// all flash sale products
export const getFlashSaleProductsApi = async (params = {}) => {

    const queryParams = new URLSearchParams(params).toString();
    // console.log(queryParams);
    const response = await api.get(`/api/products/flash-sale?${queryParams}`);
    return response.data;

};

//// get product summary 

export const getProductsSummary = async () => {

    const summary = await api.get("/api/products/summary")
    // console.log(summary)
    return summary.data

}

/// get all my products

export const getAllMyProducts = async (params = {}) => {

    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
            ([, v]) => v !== "" && v !== "ALL" && v !== null && v !== undefined
        )
    );

    const query = new URLSearchParams(cleanParams).toString();
    const url = `/api/products${query ? `?${query}` : ""}`;

    // console.log(url)

    const productData = await api.get(url);
    // console.log(productData)
    return productData?.data?.data;          // returns { metadata, data }

};




//// create product 

export const createProduct = async (formData) => {

    const response = await api.post("/api/product/create", formData);
    // console.log("response:", response.data);
    return response.data;

};


// Get top products (Dashboard)
export const getTopProductsApi = async (params) => {
    const res = await api.get("/api/products/admintop", {
        params,
    });
    return res.data;
};

// Get product by ID
export const getProductByIdApi = async (productId) => {
    const res = await api.get(`/api/product/${productId}`);
    return res.data;
};

/// get product by slug

export const getProductBySlug = async (slug) => {

    // console.log("request Url is: ", `/api/product-slug/${slug}`)

    const res = await api.get(`/api/product-slug/${slug}`);
    return res.data

}

export const uploadProductVideoApi = async (productId, videoFile) => {
    const formData = new FormData();
    formData.append("video", videoFile);
    const res = await api.put(
        `/api/product/video/${productId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};


/// Update product information
export const updateProductInfoApi = async (productId, productData) => {
    const response = await api.put(`/api/product/${productId}`, productData);
    return response.data;
};

//// Add product images
export const addProductImagesApi = async (productId, formData) => {
    const response = await api.patch(
        `/api/product/images/${productId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

//// Delete product image
export const deleteProductImageApi = async (productId, imageUrl) => {
    const response = await api.patch(
        `/api/product/delete/image/${productId}`,
        { imageUrl }
    );

    return response.data;
};