import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useLocation } from "react-router-dom";

export default function MainLayout() {
  const { pathname } = useLocation();

  const hideFooterRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/forgot-password/sent",];
  const hideFooter = hideFooterRoutes.includes(pathname);
  // console.log(pathname)
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
