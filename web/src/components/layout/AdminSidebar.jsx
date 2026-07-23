import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { ADMIN_NAV } from "../data/adminNavigation";

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();

  // Desktop collapse only
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Backdrop  */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/*  Sidebar  */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen
          border-r border-border
          bg-card
          transition-all duration-300 ease-in-out

          md:relative md:flex md:translate-x-0

          ${
            collapsed
              ? "md:w-20"
              : "md:w-64"
          }

          w-64
          flex flex-col

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/*  Mobile Close Button  */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-4 top-5 rounded-lg p-2 hover:bg-muted md:hidden"
        >
          <X size={20} />
        </button>

        {/*  Desktop Collapse  */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={
            collapsed
              ? "Expand Sidebar"
              : "Collapse Sidebar"
          }
          className="absolute -right-3 top-9 z-20 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:text-primary md:flex"
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>

        {/*  Logo  */}
        <div
          onClick={() => {
            navigate("/");
            setMobileOpen(false);
          }}
          className={`flex cursor-pointer items-center py-5 ${
            collapsed
              ? "justify-center px-2"
              : "px-6"
          }`}
        >
          {collapsed ? (
            <span className="text-2xl font-bold text-primary">
              S
            </span>
          ) : (
            <h1 className="whitespace-nowrap text-2xl font-bold tracking-tight">
              Shop
              <span className="text-primary">
                mandu
              </span>
            </h1>
          )}
        </div>

        {/*  Navigation  */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
          {ADMIN_NAV.map((section, index) => (
            <div
              key={index}
              className={
                section.title
                  ? "mt-4 first:mt-0"
                  : ""
              }
            >
              {section.title &&
                (collapsed ? (
                  <div className="mx-2 my-2 border-t border-border" />
                ) : (
                  <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </p>
                ))}

              <div className="space-y-0.2">
                {section.items.map(
                  ({
                    label,
                    icon: Icon,
                    path,
                  }) => (
                    <div
                      key={label}
                      className="group relative!"
                    >
                      <NavLink
                        to={path}
                        onClick={() =>
                          setMobileOpen(false)
                        }
                        className={({
                          isActive,
                        }) =>
                          `relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all ${
                            collapsed
                              ? "justify-center px-0"
                              : "px-4"
                          } ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-surface hover:text-foreground"
                          }`
                        }
                      >
                        {({
                          isActive,
                        }) => (
                          <>
                            {isActive && (
                              <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                            )}

                            <Icon
                              className="h-4 w-4 shrink-0"
                              strokeWidth={2.5}
                            />

                            {!collapsed && (
                              <span className="whitespace-nowrap">
                                {label}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>

                      {/* Tooltip */}
                      {collapsed && (
                       <span className="pointer-events-none absolute left-full top-1/2 z-9999 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          {label}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}