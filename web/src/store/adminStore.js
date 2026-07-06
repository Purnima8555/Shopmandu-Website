import { create } from "zustand";
import { getAllUsersApi, getAllPaymentsApi, searchShopsApi, updateShopStatusApi, getAllOrdersApi, getOrderByIdApi, updateOrderStatusApi,
        getAdminSalesSummaryApi, getAllProductsApi, getProductByIdApi, getTopProductsApi, createCouponApi, getAllCouponsApi, getCouponByIdApi,
        updateCouponApi, deleteCouponApi,  createCategoryApi, getAllCategoriesApi, getCategoryByIdApi, updateCategoryApi, toggleCategoryStatusApi,
        deleteCategoryApi, getVendorKycListApi, getVendorKycByIdApi, approveVendorKycApi, rejectVendorKycApi, getVendorsApi, getAllVendorsApi,
        getVendorByIdApi, } from "../api/admin.api";

const useAdminStore = create((set) => ({
    loading: false,

    // Users
    users: [],

    // Get all users
    getUsers: async () => {
        try {
            set({ loading: true });

            const res = await getAllUsersApi();

            set({
                users: res.data,
            });

        return res;
            } catch (error) {
                throw error.response?.data || error;
            } finally {
        set({ loading: false });
        }
    },
    
    
    // Payments
    payments: [],

    // Get all payments
    getAllPayments: async (params) => {
        try {
            set({ loading: true });

            const res = await getAllPaymentsApi(params);

            set({
                payments: res.payments.data,
                paymentMetadata: res.payments.metadata,
            });

            return res;
            } catch (error) {
                throw error.response?.data || error;
            } finally {
                set({ loading: false });
        }
    },

    //shop
    shops: [],
    shopMetadata: null,

    // Get all shops
    getAllShops: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await searchShopsApi(params);
            console.log(res);

            set({
                shops: res.data || [],
                shopMetadata: res.metadata || null,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Update shop status
    updateShopStatus: async (shopId, status) => {
        try {
            set({ loading: true });

            const res = await updateShopStatusApi(shopId, { status });

            // Refresh list after update
            await useAdminStore.getState().getAllShops();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },


    // Orders
    orders: [],
    orderMetadata: null,
    selectedOrder: null,
    salesSummary: null,

    // Get all orders
    getAllOrders: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getAllOrdersApi(params);

            set({
                orders: res.data || [],
                orderMetadata: res.metadata || null,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        try {
            set({ loading: true });

            const res = await getOrderByIdApi(orderId);

            set({
                selectedOrder: {
                    ...res.data.order,
                    items: res.data.orderItems.flatMap((item) =>
                    item.products.map((product) => ({
                        productName: product.productId?.productName,
                        productImage: product.productId?.images?.[0],
                        quantity: product.quantity,
                        price: product.price,
                        total: product.quantity * product.price,
                        variant: product.variant,
                    })),
                    ),
                },
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        try {
            set({ loading: true });

            const res = await updateOrderStatusApi({
                orderId,
                status,
            });

            // Refresh orders after update
            await useAdminStore.getState().getAllOrders();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Get admin sales summary
    getAdminSalesSummary: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getAdminSalesSummaryApi(params);

            set({
                salesSummary: res.data,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },


    // Products
    products: [],
    productMetadata: null,
    selectedProduct: null,
    topProducts: [],

    // Get all products
    getAllProducts: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getAllProductsApi(params);

            set({
                products: res.data?.data || [],
                productMetadata: res.data?.metadata || null,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Get product by ID
    getProductById: async (productId) => {
        try {
            set({ loading: true });

            const res = await getProductByIdApi(productId);

            set({
                selectedProduct: res.data,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Get top products
    getTopProducts: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getTopProductsApi(params);

            set({
                topProducts: res.data || [],
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },


    // Coupons
    coupons: [],
    selectedCoupon: null,

    // Create coupon
    createCoupon: async (data) => {
        try {
            set({ loading: true });

            const res = await createCouponApi(data);

            await useAdminStore.getState().getAllCoupons();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Get all coupons
    getAllCoupons: async () => {
        try {
            set({ loading: true });

            const res = await getAllCouponsApi();

            set({
                coupons: res.data || [],
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Get coupon by ID
    getCouponById: async (couponId) => {
        try {
            set({ loading: true });

            const res = await getCouponByIdApi(couponId);

            set({
                selectedCoupon: res.data,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Update coupon
    updateCoupon: async (couponId, data) => {
        try {
            set({ loading: true });

            const res = await updateCouponApi(couponId, data);

            await useAdminStore.getState().getAllCoupons();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Delete coupon
    deleteCoupon: async (couponId) => {
        try {
            set({ loading: true });

            const res = await deleteCouponApi(couponId);

            await useAdminStore.getState().getAllCoupons();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },


    // Categories
    categories: [],
    categoryMetadata: null,
    selectedCategory: null,

    // Get all categories
    getAllCategories: async () => {
        try {
            set({ loading: true });

            const res = await getAllCategoriesApi();

            set({
                categories: res.categories.categories || [],
                categoryMetadata: {
                    total: res.categories.total,
                    page: res.categories.page,
                    totalPages: res.categories.totalPages,
                },
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Get category by ID
    getCategoryById: async (categoryId) => {
        try {
            set({ loading: true });

            const res = await getCategoryByIdApi(categoryId);

            set({
                selectedCategory: res.category,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Create category
    createCategory: async (data) => {
        try {
            set({ loading: true });

            const res = await createCategoryApi(data);

            await useAdminStore.getState().getAllCategories();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Update category
    updateCategory: async (categoryId, data) => {
        try {
            set({ loading: true });

            const res = await updateCategoryApi(categoryId, data);

            await useAdminStore.getState().getAllCategories();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Toggle category status
    toggleCategoryStatus: async (categoryId) => {
        try {
            set({ loading: true });

            const res = await toggleCategoryStatusApi(categoryId);

            await useAdminStore.getState().getAllCategories();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Delete category
    deleteCategory: async (categoryId) => {
        try {
            set({ loading: true });

            const res = await deleteCategoryApi(categoryId);

            await useAdminStore.getState().getAllCategories();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // vendor
    vendors: [],
    vendorMetadata: null,
    selectedVendor: null,

    kycList: [],
    kycMetadata: null,
    kycDetail: null,

    getVendors: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getVendorsApi(params);

            set({
                vendors: res.data?.data || res.data || [],
                vendorMetadata: res.data?.metadata || res.metadata || null,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },
    
    getAllVendors: async () => {
        try {
            set({ loading: true });

            const res = await getAllVendorsApi();

            set({
                vendors: res.vendors || res.data || [],
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },
    
    getVendorById: async (vendorId) => {
        try {
            set({ loading: true });

            const res = await getVendorByIdApi(vendorId);

            const { user, vendorKyc } = res.data;

            set({
                selectedVendor: {
                    ...vendorKyc,

                    email: user.email,
                    businessEmail: user.email,

                    mobile: user.mobile,
                    businessMobile: user.mobile,

                    createdAt: user.createdAt,
                    updatedAt: vendorKyc.updatedAt,

                    isVerify: user.isVerify,
                    roles: user.roles,
                },
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },
    
    getVendorKycList: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getVendorKycListApi(params);

            set({
                kycList: res.data?.data || res.data || [],
                kycMetadata: res.data?.metadata || res.metadata || null,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },
    
    getVendorKycById: async (kycId) => {
        try {
            set({ loading: true });

            const res = await getVendorKycByIdApi(kycId);

            set({
                kycDetail: res.data || res,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },
    
    approveVendorKyc: async (kycId) => {
        try {
            set({ loading: true });

            const res = await approveVendorKycApi(kycId);

            // refresh list
            await useAdminStore.getState().getVendorKycList();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },
    
    rejectVendorKyc: async (kycId, data) => {
        try {
            set({ loading: true });

            const res = await rejectVendorKycApi(kycId, data);

            await useAdminStore.getState().getVendorKycList();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

}));

export default useAdminStore;
