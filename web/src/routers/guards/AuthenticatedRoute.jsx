

import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Loader from "../../components/common/Loader";

export default function AuthenticatedRoute() {
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated ); 
  const authChecked = useAuthStore((state) => state.authChecked);

  const location = useLocation();
  //// wait until getMe() finishes
  if (!authChecked) {
    return <Loader fullScreen={true} />;
  }
  
  //// user is not logged in
  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location }} replace/>
    );
  }

  // User is authenticated
  return <Outlet />;
}