import { Info, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";
import UserDrawer from "../components/UserDrawer";

import useUserStore from "../../../store/userStore";
import sendApiRequest from "../../../utils/sendApiRequest";

/* ==================== Badge Styles ==================== */

const ROLE_STYLE = {
  ADMIN: { tone: "info", label: "Admin" },
  VENDOR: { tone: "warning", label: "Vendor" },
  CUSTOMER: { tone: "success", label: "Customer" },
};

const VERIFY_STYLE = {
  true: { tone: "success", label: "Verified" },
  false: { tone: "neutral", label: "Unverified" },
};

/* ==================== Component ==================== */

const UsersPage = () => {
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { users, getUsers } = useUserStore();

  useEffect(() => {
    sendApiRequest(() => getUsers());
  }, []);

  const filtered = users.filter((user) => {
    const matchesRole =
      roleFilter === "All" || user.roles.includes(roleFilter.toUpperCase());

    const matchesSearch =
      user.userName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage all registered customers, vendors and administrators.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            {["All", "Customer", "Vendor", "Admin"].map((filter) => (
              <button
                key={filter}
                onClick={() => setRoleFilter(filter)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  roleFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => {
              const role = ROLE_STYLE[user.roles?.[0]] || {
                tone: "neutral",
                label: user.roles?.[0] || "Unknown",
              };

              const verify = VERIFY_STYLE[user.isVerify];

              return (
                <tr key={user._id} className="border-t border-border">
                  {/* User Info */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-semibold text-muted-foreground">
                        {user.userName?.substring(0, 2).toUpperCase()}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.userName}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5">
                    <StatusBadge tone={role.tone}>{role.label}</StatusBadge>
                  </td>

                  {/* Verification */}
                  <td className="px-5 py-3.5">
                    <StatusBadge tone={verify.tone}>{verify.label}</StatusBadge>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions - Only this opens the drawer */}
                  <td className="px-5 py-3.5 text-right">
                    <ButtonRounded
                      variant="ghost"
                      size="sm"
                      icon={Info}
                      title="View User"
                      className="cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedUser(user)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No users found.
          </div>
        )}
      </div>

      <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default UsersPage;
