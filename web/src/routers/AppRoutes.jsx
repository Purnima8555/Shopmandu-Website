import { Routes, Route } from "react-router-dom";

import MainLayout from "../AppLayout/AppLayout";

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
import AdminDashboardPage from "../pages/AdminDashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";

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

        {/*  admin only can access this   */}
        <Route element={<AuthenticatedRoute />}>
          
          <Route element={<RoleProtectedRoute roles={[Roles.ADMIN_ROLE]} />}>
            
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        {/*  404 Page Not Found  */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}