import api from "./axios"; // adjust path to your actual api folder

/// NOTE: base path assumed as "/api/address" to match the cart/coupon
/// pattern. Adjust if your app.js mounts address.route.js differently.

/// get all saved addresses for the logged-in user
export const getAddressesApi = async () => {
  const res = await api.get("/api/address");
  return res.data;
};

/// get a single address by id
export const getAddressByIdApi = async (id) => {
  const res = await api.get(`/api/address/${id}`);
  return res.data;
};

/// add a new address
/// data: { addressType, location, city, state, mobile, pincode?, landmark?, isDefault? }
export const addAddressApi = async (data) => {
  const res = await api.post("/api/address/add", data);
  return res.data;
};

/// update an existing address
export const updateAddressApi = async (id, data) => {
  const res = await api.put(`/api/address/update/${id}`, data);
  return res.data;
};

/// delete an address
export const deleteAddressApi = async (id) => {
  const res = await api.delete(`/api/address/delete/${id}`);
  return res.data;
};
