import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import Button from "../ui/Button";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import NavLinks from "../ui/NavLinks";
import { navLinks } from "../data/navigation";
import useAuthStore from "../../store/authStore";
import { PiShoppingCartSimple } from "react-icons/pi";
import { IoIosHeartEmpty } from "react-icons/io";
import UserAccountMenu from "../ui/UserAccountMenu";
// import Loader from "../common/Loader";

const Navbar = () => {
  const navigate = useNavigate();
  const openLogin = () => navigate("/login");

  const [mobileMenue, setMobileMenue] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();

  // console.log(user);
  // const { loading } = useAuthStore();

  return (
    <header className=" sticky top-0 z-50 bg-[var(--glass-bg  backdrop-blur-md  border-b border-border shadow-xs relative ">
      <nav className="container mx-auto px-6 h-18 flex items-center justify-between">
        {/* logo */}
        <div className="shrink-0">
          <NavLink to="/">
            <h1 className="lg:text-3xl md:text-2xl text-xl font-bold tracking-tight text-foreground">
              Shop
              <span className="text-primary">mandu</span>
            </h1>
          </NavLink>
        </div>

        {/* nav links */}
        <ul className="hidden lg:flex items-center gap-6">
          <NavLinks />
        </ul>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          {/* search */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search products..."
              className="w-70 h-11.5 pl-5 pr-14 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground outline-none shadow-xs transition-all focus:border-primary focus:ring-4 focus:ring-primary-light"
            />

            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer">
              <CiSearch size={22} />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden">
            {!showMobileSearch ? (
              <button
                onClick={() => setShowMobileSearch(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition cursor-pointer"
              >
                <CiSearch size={24} />
              </button>
            ) : (
              <div className="fixed left-0 right-0 top-0 z-[60] bg-card border-b border-border p-4 shadow-lg animation-fade-in duration-300">
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    className="w-full h-11 pl-4 pr-20 rounded-xl border border-border bg-card outline-none focus:border-primary"
                  />

                  <button className="absolute right-12 top-1/2 -translate-y-1/2">
                    <CiSearch size={20} />
                  </button>

                  <button
                    onClick={() => setShowMobileSearch(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Login */}
          {!isAuthenticated && (
            <Button
              size="default"
              className="hidden lg:flex px-8 cursor-pointer"
              onClick={openLogin}
            >
              Login
            </Button>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              {/* Wishlist Link */}
              <Link
                to="/"
                className="p-1 rounded-full hover:bg-surface transition"
              >
                <IoIosHeartEmpty size={20} />
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                className="relative p-1 rounded-full hover:bg-surface transition"
              >
                <PiShoppingCartSimple size={20} />

                {/* Cart Count */}
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  2
                </span>
              </Link>

              <UserAccountMenu
                user={user}
                onLogout={async () => {
                  await logout();
                }}
              />
            </div>
          )}

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenue(!mobileMenue)}
            className="lg:hidden flex items-center justify-center cursor-pointer"
          >
            {mobileMenue ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* mobile menue */}
      {mobileMenue && (
        <div className="w-full bg-card border-t border-border shadow-md lg:hidden absolute top-18 animation-fade-in">
          <ul className="flex flex-col py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  onClick={() => setMobileMenue(!mobileMenue)}
                  className={({ isActive }) =>
                    `block px-6 py-3 font-medium transition-all duration-200 ${
                      isActive
                        ? "text-primary bg-primary-light"
                        : "text-muted-foreground hover:text-primary hover:bg-surface"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="px-6 pt-4 pb-4">
            {!isAuthenticated && (
              <Button
                size="default"
                className="w-full cursor-pointer"
                onClick={() => {
                  setMobileMenue(false);
                  openLogin();
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
