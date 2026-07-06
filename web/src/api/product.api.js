

/// get all product 

import api from "./axios";

export const getAllProductsApi = async (params) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/api/products/public?${queryParams}`);
   
    // console.log("Response: ",response)
    return  response?.data
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/// all flash sale products
export const getFlashSaleProductsApi = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    // console.log(queryParams);
    const response = await api.get(`/api/products/flash-sale?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};