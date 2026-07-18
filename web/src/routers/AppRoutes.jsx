import { Routes, Route } from "react-router-dom";

import MainLayout from "../AppLayout/AppLayout";
import AdminLayout from "../AppLayout/AdminLayout";

//// public Pages
import HomePage from "../pages/Homepage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import ProductListPage from "../pages/ProductListPage";

/// guards
import AuthenticatedRoute from "./guards/AuthenticatedRoute";
import RoleProtectedRoute from "./guards/RoleProtectedRoute";
import Roles from "../constants/Rolebase";
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";
import CheckoutPage from "../pages/CheckoutPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import VendorDashboard from "../features/vendor/pages/VendorDashboard";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ForgotPasswordSentPage from "../features/auth/pages/ForgotPasswordSentPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

// admin
import AdminDashboardPage from "../features/admin/pages/Overview";
import CategoriesPage from "../features/admin/pages/Category";
import CouponsPage from "../features/admin/pages/Coupons";
import PayoutsPage from "../features/admin/pages/Payout";
import OrdersPage from "../features/admin/pages/Orders";
import ProductsPage from "../features/admin/pages/Products";
import ShopsPage from "../features/admin/pages/Shops";
import VendorsPage from "../features/admin/pages/Vendors";
import UsersPage from "../features/admin/pages/Users";
import { ProductDetail } from "../features/product/components/ProductDetail";
import ProfilePage from "../features/profile/pages/MyProfile";
import Settings from "../features/admin/pages/Settings";
import OrderSuccess from "../features/order/components/orderSuccess";
import PaymentPage from "../features/payment/components/PaymentPage";
import PaymentSuccess from "../features/payment/components/PaymentSuccess";
import PaymentFail from "../features/payment/components/PaymentFail";
import BuyProduct from "../pages/BuyProduct";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/*  public  */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:slug" element={<ProductDetail />} />

        {/*  Auth pages  */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="forgot-password/sent"
          element={<ForgotPasswordSentPage />}
        />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />

        {/*  Unauthorized landing page  */}
        <Route path="403" element={<UnauthorizedPage />} />

        {/*  any authenticated user  */}
        <Route element={<AuthenticatedRoute />}>
          {/* USER only route, nested one level deeper for the role check */}
          <Route element={<RoleProtectedRoute roles={[Roles.USER_ROLE]} />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success/:orderId" element={<OrderSuccess />} />
            <Route path="payment/:orderId" element={<PaymentPage />} />
            <Route path="payment/success/:order" element={<PaymentSuccess />} />
            <Route path="payment/failed/:order" element={<PaymentFail />} />
            <Route path="buy-product" element={<BuyProduct />} />

          </Route>
        </Route>
      </Route>

      {/*  vendor only  */}
      <Route element={<AuthenticatedRoute />}>
        <Route element={<RoleProtectedRoute roles={[Roles.VENDOR_ROLE]} />}>
          <Route path="vendor/dashboard" element={<VendorDashboard />} />
        </Route>
      </Route>

      {/*  404 Page Not Found  */}
      <Route path="*" element={<NotFoundPage />} />

      {/*  admin only  */}
      <Route element={<AuthenticatedRoute />}>
        <Route element={<RoleProtectedRoute roles={[Roles.ADMIN_ROLE]} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="admin/vendors" element={<VendorsPage />} />
            <Route path="admin/shops" element={<ShopsPage />} />
            <Route path="admin/categories" element={<CategoriesPage />} />
            <Route path="admin/products" element={<ProductsPage />} />
            <Route path="admin/orders" element={<OrdersPage />} />
            <Route path="admin/payouts" element={<PayoutsPage />} />
            <Route path="admin/coupons" element={<CouponsPage />} />
            <Route path="admin/users" element={<UsersPage />} />
            <Route path="admin/settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
