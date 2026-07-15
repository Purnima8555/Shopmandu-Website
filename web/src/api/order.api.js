import api from "./axios"; // adjust path to your actual api folder

/// Base path "/api/order", verified against order.route.js.
/// NOTE: getOrderByIdApi below hits the admin single-order route
/// (GET /admin/:id) — this store is the admin order store. If you need
/// the user-facing order detail route (GET /detail/:orderId → getOrderDetail
/// controller), that's a separate endpoint not yet wired up here.
/// Vendor-only routes (item status, vendor sales summary/trend) are also
/// not included since this store has no vendor-facing usage yet.

/// ---- Storefront ----

/// place a new order from the cart
/// orderData: { products: [{ productId, quantity, color?, size? }], shippingAddress, couponCode?, paymentMethod }
export const placeOrderApi = async (orderData) => {
  const res = await api.post("/api/order/place", orderData);
  return res.data;
};

/// get logged-in user's order history
/// params (optional): { page, limit, orderStatus, paymentStatus, paymentMethod }
export const getOrderHistoryApi = async (params = {}) => {
  const res = await api.get("/api/order/history", { params });
  return res.data;
};

/// cancel an order (only works while order is still PENDING, per backend logic)
export const cancelOrderApi = async (orderId) => {
  const res = await api.patch(`/api/order/${orderId}/cancel`);
  return res.data;
};

/// download the invoice PDF for a completed order (GET /order/invoice/customer/:orderId,
/// backed by orderService.generateCustomerInvoice — returns a real PDF, not JSON)
export const getCustomerInvoiceApi = async (orderId) => {
  const res = await api.get(`/api/order/invoice/customer/${orderId}`, {
    responseType: "blob",
  });
  return res.data; // PDF blob
};

/// ---- Admin ----

/// get all orders (admin)
/// params (optional): { page, limit, orderStatus, paymentStatus, paymentMethod, search }
export const getAllOrdersApi = async (params = {}) => {
  const res = await api.get("/api/order/admin/orders", { params });
  return res.data;
};

/// get a single order by id (admin)
export const getOrderByIdApi = async (orderId) => {
  const res = await api.get(`/api/order/admin/${orderId}`);
  return res.data;
};

/// update order status (admin)
/// payload: { orderId, status }
export const updateOrderStatusApi = async ({ orderId, status }) => {
  const res = await api.patch("/api/order/admin/status", { orderId, status });
  return res.data;
};

/// get sales summary (admin dashboard)
/// params (optional): { startDate, endDate }
export const getAdminSalesSummaryApi = async (params = {}) => {
  const res = await api.get("/api/order/admin/sales-summary", { params });
  return res.data;
};

/// get sales trend over time (admin dashboard)
/// params (optional): { startDate, endDate, interval }
export const getAdminSalesTrendApi = async (params = {}) => {
  const res = await api.get("/api/order/admin/sales-trend", { params });
  return res.data;
};
