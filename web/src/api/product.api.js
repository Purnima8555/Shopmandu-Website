

/// get all product 

import api from "./axios";

export const getAllProductsApi = async (params) => {

    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/api/products/public?${queryParams}`);
   
    // console.log("Response: ",response)
    return  response?.data

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

    console.log(url)
 
    const productData = await api.get(url);
    console.log(productData)
    return productData?.data?.data;          // returns { metadata, data }
  
};


//// get all categoryes

export const getAllProductCategories = async () =>{
    const categories = await api.get("/api/category")
    return categories?.data?.categories


}

//// create product 

export const createProduct = async (formData) => {

    const response = await api.post("/api/product/create", formData);
    console.log("response:", response.data);
    return response.data;

};