import { Routes, Route } from "react-router-dom";

import MainLayout from "../AppLayout/AppLayout";
import AdminLayout from "../AppLayout/AdminLayout";

//// public Pages
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";

// auth Pages
import LoginPage from "../pages/loginPages/LoginPage";
import RegisterPage from "../pages/loginPages/RegisterPage";
import ForgotPasswordPage from "../pages/loginPages/ForgotPasswordPage";
import ForgotPasswordSentPage from "../pages/loginPages/ForgetPasswordSentPage";
import ResetPasswordPage from "../pages/loginPages/ResetPasswordPage";
import VerifyEmailPage from "../pages/loginPages/VerifyEmailPage";

/// guards
import AuthenticatedRoute from "./guards/AuthenticatedRoute";
import RoleProtectedRoute from "./guards/RoleProtectedRoute";
import Roles from "../constants/Rolebase";
import CartPage from "../pages/CartPage";
import VendorDashboardPage from "../pages/VendorDashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";

// admin
import AdminDashboardPage from "../pages/Admin/Overview";
import CategoriesPage from "../pages/Admin/Category";
import CouponsPage from "../pages/Admin/Coupons";
import PayoutsPage from "../pages/Admin/Payout";
import OrdersPage from "../pages/Admin/Orders";
import ProductsPage from "../pages/Admin/Products";
import ShopsPage from "../pages/Admin/Shops";
import VendorsPage from "../pages/Admin/Vendors";
import UsersPage from "../pages/Admin/Users";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/*  public  */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />

        {/*  Auth pages  */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="forgot-password/sent" element={<ForgotPasswordSentPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />

        {/*  Unauthorized landing page  */}
        <Route path="403" element={<UnauthorizedPage />} />

        {/*  any authenticated user  */}
        <Route element={<AuthenticatedRoute />}>
          <Route path="cart" element={<CartPage />} />
          {/* USER only route, nested one level deeper for the role check */}
          <Route element={<RoleProtectedRoute roles={[Roles.USER_ROLE]} />}>
            <Route path="user/dashboard" element={<div>User dashboard</div>} />

            
          </Route>
        </Route>

        {/*  vendor only  */}
        <Route element={<AuthenticatedRoute />}>
          
          <Route element={<RoleProtectedRoute roles={[Roles.VENDOR_ROLE]} />}>
            
            <Route path="vendor/dashboard" element={<VendorDashboardPage />} />
          </Route>
        </Route>

        {/*  404 Page Not Found  */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

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
            <Route path="admin/users" element={<UsersPage/>} >
            </Route>
          </Route>
        </Route>
      </Route>

    </Routes>
  );
}