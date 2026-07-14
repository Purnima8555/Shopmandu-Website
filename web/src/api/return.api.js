import api from "./axios";


//// Get all vendor order requests
export const getVendorRequestsApi = async (params = {}) => {
  const response = await api.get("/api/vendor", {
    params,
  });

  return response.data;
};

//// Approve request
export const approveRequestApi = async (requestId) => {
  const response = await api.patch(
    `/api/${requestId}/approve`
  );

  return response.data;
};

//// Reject request
export const rejectRequestApi = async (requestId) => {
  const response = await api.patch(
    `/api/${requestId}/reject`
  );

  return response.data;
};

//// Refund request
export const refundRequestApi = async (requestId) => {
  const response = await api.patch(
    `/api/${requestId}/refund`
  );

  return response.data;
};
