import api from "./axios";

// Get all addresses
export const getAddressesApi = async () => {
    const res = await api.get("/api/address");

    return res.data;
};

// Get address by id
export const getAddressByIdApi = async (addressId) => {
    const res = await api.get(`/api/address/${addressId}`);

    return res.data;
};

// Add address
export const addAddressApi = async (data) => {
    const res = await api.post("/api/address/add", data);

    return res.data;
};

// Update address
export const updateAddressApi = async (addressId, data) => {
    const res = await api.put(`/api/address/update/${addressId}`, data);

    return res.data;
};

// Delete address
export const deleteAddressApi = async (addressId) => {
    const res = await api.delete(`/api/address/delete/${addressId}`);

    return res.data;
};