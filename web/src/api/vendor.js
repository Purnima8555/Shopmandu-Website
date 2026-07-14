import api from "./axios"



export const updateVendorName = async (param) => {
       // console.log(param)
       const updatedVendor = await api.patch("/api/vendor/update-name", param)
       // console.log(updatedVendor)
       return updatedVendor?.data
}


export const updateProfile = async (param) => {
       // console.log(param)
       const updatedVendor = await api.patch("/api/vendor/update-avatar", param)
       // console.log(updatedVendor)
       return updatedVendor?.data
}


// Get vendors (filtered, paginated)
export const getVendorsApi = async (params) => {
       const res = await api.get("/api/admin/vendors", {params});
       return res.data;
};

// Get all vendors
export const getAllVendorsApi = async (queryData = {}) => {
    const res = await api.get("/api/admin/vendors/all", {
        params: queryData,
    });

//     console.log(res.data)

    return res.data;
};

// Get vendor details
export const getVendorByIdApi = async (vendorId) => {
       const res = await api.get(`/api/admin/vendor/${vendorId}`);
       return res.data;
};


// Get KYC applications
export const getVendorKycListApi = async (params = {}) => {
       const res = await api.get("/api/admin/kyc/status-filter", {
              params,
       });

       return res.data;
};

// Get KYC details
export const getVendorKycByIdApi = async (kycId) => {
       const res = await api.get(`/api/admin/kyc/${kycId}`);
       return res.data;
};

// Approve KYC
export const approveVendorKycApi = async (kycId) => {
       const res = await api.put(`/api/admin/kyc/${kycId}/approve`);
       return res.data;
};

// Reject KYC
export const rejectVendorKycApi = async (kycId, data) => {
       const res = await api.put(`/api/admin/kyc/${kycId}/reject`, data);
       return res.data;
};


/// Get vendor KYC details
export const getVendorKycApi = async () => {
  const res = await api.get("/api/vendor/kyc");
  return res.data;
};

/// Get vendor KYC status
export const getVendorKycStatusApi = async () => {
  const res = await api.get("/api/vendor/kyc/status");
  return res.data;
};

/// Submit KYC
export const submitVendorKycApi = async (formData) => {
  const res = await api.post("/api/vendor/submit/kyc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/// Resubmit KYC
export const resubmitVendorKycApi = async (formData) => {
  const res = await api.put("/api/vendor/resubmit/kyc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
