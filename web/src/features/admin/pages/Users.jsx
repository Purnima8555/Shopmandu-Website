import {
  Info,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import ButtonRounded from "../../../components/ui/ButtonRounded";
import StatusBadge from "../../../components/ui/StatusBadge";
import UserDrawer from "../components/UserDrawer";

import { ROLE_STYLE, VERIFY_STYLE } from "../data";
import AdminPagination from "../components/AdminPagination";
import useAdimManageUser from "../store/adimGetUser.store";

const UsersPage = () => {
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [imageError, setImageError] = useState({});
  const { users, metadata, getUsers } = useAdimManageUser();

  useEffect(() => {
    getUsers({
      page,
      limit,
      search,
      role: roleFilter === "All" ? "All" : roleFilter.toUpperCase(),
    });
  }, [page, limit, roleFilter, search, getUsers]);

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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            {["All", "Customer", "Vendor", "Admin"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setRoleFilter(filter);
                  setPage(1);
                }}
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

        <AdminPagination
          metadata={metadata}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          refreshData={() =>
            getUsers({
              page,
              limit,
              search,
              role: roleFilter === "All" ? "All" : roleFilter.toUpperCase(),
            })
          }
        />

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
            {users.map((user) => {
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
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                        {user.avatar && !imageError[user._id] ? (
                          <img
                            src={user.avatar}
                            alt={user.userName}
                            className="h-full w-full object-cover"
                            onError={() =>
                              setImageError((prev) => ({
                                ...prev,
                                [user._id]: true,
                              }))
                            }
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center font-mono text-[14px] font-semibold text-muted-foreground">
                            {user.userName?.substring(0, 2).toUpperCase() ||
                              "??"}
                          </span>
                        )}
                      </div>

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

        {users.length === 0 && (
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
