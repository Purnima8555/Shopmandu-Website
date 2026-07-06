import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Eye } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import ButtonRounded from "../../components/ui/ButtonRounded";
import UserDrawer from "../Admin/components/UserDrawer";
import Loader from "../../components/common/Loader";
import useAdminStore from "../../store/adminStore";

/* ==================== Badge Styles ==================== */

const ROLE_STYLE = {
    ADMIN: {
        tone: "info",
        label: "Admin",
    },

    VENDOR: {
        tone: "warning",
        label: "Vendor",
    },

    CUSTOMER: {
        tone: "success",
        label: "Customer",
    },
};

const VERIFY_STYLE = {
    true: {
        tone: "success",
        label: "Verified",
    },

    false: {
        tone: "neutral",
        label: "Unverified",
    },
};

/* ==================== Component ==================== */

const UsersPage = () => {
    const [roleFilter, setRoleFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const { users, loading, getUsers } = useAdminStore();

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filtered = users.filter((user) => {
        const matchesRole =
        roleFilter === "All" ||
        user.roles.includes(roleFilter.toUpperCase());

        const matchesSearch =
        user.userName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

        return matchesRole && matchesSearch;
    });

    if (loading) {
        return <Loader fullScreen text="Loading users..." />;
    }

    return (
        <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-semibold tracking-tight">
            Users
            </h1>

            <p className="mt-1 text-muted-foreground">
            View and manage all registered customers, vendors and administrators.
            </p>
        </div>

        {/* ====================== TABLE ====================== */}
        <div className="rounded-xl border border-border bg-card">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            {/* Search */}
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

            {/* Role Filters */}
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

            {/* ====================== TABLE HEADER ====================== */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 px-5 py-2.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            <span>User</span>
            <span>Role</span>
            <span>Verified</span>
            <span>Joined</span>
            <span className="text-right">Actions</span>
            </div>

            {/* ====================== TABLE ROWS ====================== */}
            {filtered.map((user) => {
            const role = ROLE_STYLE[user.roles[0]];
            const verify = VERIFY_STYLE[user.isVerify];

            return (
                <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="grid cursor-pointer grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-2 border-t border-border px-5 py-3.5 text-sm hover:bg-surface"
                >
                {/* User */}
                <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-semibold text-muted-foreground">
                    {user.userName.substring(0, 2).toUpperCase()}
                    </span>

                    <span className="min-w-0">
                    <p className="truncate font-medium">
                        {user.userName}
                    </p>

                    <p className="truncate text-[11px] text-muted-foreground">
                        {user.email}
                    </p>
                    </span>
                </span>

                {/* Role */}
                <span>
                    <StatusBadge tone={role.tone}>
                    {role.label}
                    </StatusBadge>
                </span>

                {/* Verification */}
                <span>
                    <StatusBadge tone={verify.tone}>
                    {verify.label}
                    </StatusBadge>
                </span>

                {/* Joined */}
                <span className="font-mono text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                </span>

                {/* Actions */}
                <span
                    className="flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ButtonRounded
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    title="View User"
                    onClick={() => setSelectedUser(user)}
                    />
                </span>
                </div>
            );
            })}

            {/* Empty State */}
            {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
                No users found.
            </div>
            )}
        </div>

        {/* ====================== USER DRAWER ====================== */}
        <UserDrawer
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
        />
        </div>
    );
};

export default UsersPage;