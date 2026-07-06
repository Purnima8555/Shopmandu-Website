import { Routes, Route } from "react-router-dom";

import MainLayout from "../AppLayout/AppLayout";

//// public Pages
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";



/// guards
import AuthenticatedRoute from "./guards/AuthenticatedRoute";
import RoleProtectedRoute from "./guards/RoleProtectedRoute";
import Roles from "../constants/Rolebase";
import CartPage from "../pages/CartPage";
// import AdminDashboardPage from "../pages/AdminDashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import VendorDashboard from "../features/vendor/pages/VendorDashboard";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage"
import ForgotPasswordSentPage from "../features/auth/pages/ForgotPasswordSentPage"
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage"

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


      </Route>

        {/*  vendor only  */}
        <Route element={<AuthenticatedRoute />}>
          
          <Route element={<RoleProtectedRoute roles={[Roles.VENDOR_ROLE]} />}>
            <Route path="vendor/dashboard" element={<VendorDashboard/>} />
          </Route>
        </Route>

        {/*  admin only can access this   */}
        <Route element={<AuthenticatedRoute />}>
          
          <Route element={<RoleProtectedRoute roles={[Roles.ADMIN_ROLE]} />}>
            
            {/* <Route path="admin/dashboard" element={<AdminDashboardPage />} /> */}
          </Route>
        </Route>

        {/*  404 Page Not Found  */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}