import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Popup from "../../components/ui/Popup";
import useAuthStore from "../../store/authStore";

const AdminHeader = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuthStore();

  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const dropdownRef = useRef(null);

  const initials =
    user?.userName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "A";

  const formattedRole = user?.role
    ? user.role.charAt(0).toUpperCase() +
      user.role.slice(1).toLowerCase()
    : "Platform Admin";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--glass-bg)] shadow-xs backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">

          {/* Left Side */}
          <div className="flex items-center gap-4">

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 transition hover:bg-surface md:hidden"
            >
              <Menu size={22} />
            </button>

            {/* Search */}
            <div className="relative hidden w-full max-w-md md:block">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Search vendors, orders, products..."
                className="h-11 w-80 rounded-xl border border-border bg-card pl-10 pr-4 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            <div className="hidden h-6 w-px bg-border md:block" />

            {/* Profile */}
            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                onClick={() =>
                  setShowProfileDropdown(
                    !showProfileDropdown
                  )
                }
                className="flex cursor-pointer items-center gap-3 rounded-xl p-1.5 pr-3 transition hover:bg-surface"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.userName}
                    className="h-9 w-9 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                    {initials}
                  </div>
                )}

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-tight">
                    {user?.userName || "Admin"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formattedRole}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    showProfileDropdown
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-card py-2 shadow-xl">

                  <div className="border-b border-border px-4 py-3 sm:hidden">
                    <p className="font-semibold">
                      {user?.userName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formattedRole}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/admin/settings");
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm transition hover:bg-surface"
                  >
                    <Settings size={17} />
                    Account Settings
                  </button>

                  <div className="my-2 border-t border-border" />

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowLogoutPopup(true);
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-danger transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="border-t border-border p-4 md:hidden">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search..."
              className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
            />
          </div>
        </div>
      </header>

      <Popup
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        title="Sign Out"
        showFooter
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmVariant="primary"
        onConfirm={handleLogout}
      >
        <p className="text-muted-foreground">
          Are you sure you want to sign out of your account?
        </p>
      </Popup>
    </>
  );
};

export default AdminHeader;