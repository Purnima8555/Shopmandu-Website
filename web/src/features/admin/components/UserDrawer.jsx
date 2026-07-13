import { User } from "lucide-react";

import Drawer from "../../../components/ui/Drawer";
import StatusBadge from "../../../components/ui/StatusBadge";

const UserDrawer = ({ user, onClose }) => {
    if (!user) return null;

    const roleTone = {
        ADMIN: "info",
        VENDOR: "warning",
        CUSTOMER: "success",
    };

    const verifyTone = user.isVerify ? "success" : "neutral";

    return (
        <Drawer
        isOpen={!!user}
        onClose={onClose}
        title="User Details"
        maxWidth="max-w-lg"
        >
        <div className="space-y-6">
            {/* ================= PROFILE ================= */}
            <section className="flex flex-col items-center border-b border-border pb-6">
            {user.avatar ? (
                <img
                src={user.avatar}
                alt={user.userName}
                className="h-24 w-24 rounded-full border border-border object-cover shadow-sm"
                />
            ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-muted">
                <User size={42} className="text-muted-foreground" />
                </div>
            )}

            <h2 className="mt-3 text-l font-semibold">{user.userName}</h2>
            </section>

            {/* ================= USER INFORMATION ================= */}
            <section>
            <h3 className="mb-2 text-sm font-semibold">User Information</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                <p className="text-xs text-muted-foreground">Username</p>

                <p>{user.userName || "—"}</p>
                </div>

                <div>
                <p className="text-xs text-muted-foreground">Mobile</p>

                <p>{user.mobile || "—"}</p>
                </div>

                <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Email</p>

                <p className="break-all">{user.email || "—"}</p>
                </div>
            </div>
            </section>

            {/* ================= ACCOUNT STATUS ================= */}
            <section>
            <h3 className="mb-2 text-sm font-semibold">Account Status</h3>

            <div className="flex flex-wrap gap-3">
                {(user.roles || []).map((role) => (
                <StatusBadge key={role} tone={roleTone[role] || "neutral"}>
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                </StatusBadge>
                ))}

                <StatusBadge tone={verifyTone}>
                {user.isVerify ? "Verified" : "Unverified"}
                </StatusBadge>
            </div>
            </section>

            {/* ================= METADATA ================= */}
            <section>
            <h3 className="mb-2 text-sm font-semibold">Metadata</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                <p className="text-xs text-muted-foreground">Created</p>

                <p>
                    {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "—"}
                </p>
                </div>

                <div>
                <p className="text-xs text-muted-foreground">Updated</p>

                <p>
                    {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : "—"}
                </p>
                </div>
            </div>
            </section>

            {/* ================= SYSTEM INFORMATION ================= */}
            <section className="border-t border-border pt-4">
            <h3 className="mb-3 text-sm font-semibold">System Information</h3>

            <div>
                <p className="text-xs text-muted-foreground">User ID</p>

                <p className="mt-1 break-all rounded-lg bg-surface px-3 py-2 font-mono text-xs">
                {user._id}
                </p>
            </div>
            </section>
        </div>
        </Drawer>
    );
};

export default UserDrawer;
