import { NavLink } from "react-router-dom";
import { ADMIN_NAV } from "../data/adminNavigation";

export default function AdminSidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      {/* Logo */}
      <div className="px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Shop<span className="text-primary">mandu</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((section, index) => (
          <div
            key={index}
            className={section.title ? "mt-6 first:mt-0" : ""}
          >
            {section.title && (
              <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}

            <div className="space-y-0.5">
              {section.items.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={label}
                  to={path}
                  className={({ isActive }) =>
                    `relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}

                      <Icon className="h-4 w-4" strokeWidth={2.5} />

                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}