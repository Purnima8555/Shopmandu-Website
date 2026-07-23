import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../features/auth/store/auth.store";


export default function RoleProtectedRoute({ roles }) {
  const user = useAuthStore((state) => state.user);

  // Route doesn't require any specific role
  if (!roles || roles.length === 0) {
    return <Outlet />;
  }

  const userRoles = user?.roles ?? [];

  const hasRequiredRole = roles.some((role) =>
    userRoles.includes(role)
  );

  if (!hasRequiredRole) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}