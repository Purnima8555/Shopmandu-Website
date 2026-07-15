import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  ShoppingBag,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { dismissToast, showSuccess } from "../../utils/toast";

const UserAccountMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isVendor = user?.roles?.includes("VENDOR");
  const isAdmin = user?.roles?.includes("ADMIN");

  const menuItemClass =
    "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-all";

  const vendorClass = `${menuItemClass} text-primary bg-primary/5 font-medium mt-1`;

  const adminClass = `${menuItemClass} text-[#ff9900] bg-orange-50 font-medium mt-1`;

  const handleLogout = async () => {
    try {
      await onLogout();
      dismissToast();
      showSuccess("Logout Successful!");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full border border-border hover:border-primary overflow-hidden transition"
      >
        {user?.avatar && !imageError ? (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <User size={18} className="text-gray-500" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-border mb-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.userName}
            </p>
            {/* <p className="text-xs text-gray-500 truncate">{user?.email}</p> */}
          </div>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={menuItemClass}
          >
            <User className="w-4 h-4" />
            <span>Manage My Account</span>
          </Link>

          <Link
            to="/my-orders"
            onClick={() => setIsOpen(false)}
            className={menuItemClass}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders</span>
          </Link>

          {isVendor && (
            <Link
              to="/vendor/dashboard"
              onClick={() => setIsOpen(false)}
              className={vendorClass}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Vendor Dashboard</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className={adminClass}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <div className="border-t border-border my-1" />

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccountMenu;
