import React, { useState } from "react";
import { Edit3, ChevronRight, Mail, Phone } from "lucide-react";

import ProfileTabs from "../components/ProfileTabs";
import Button from "../../../components/ui/Button";
import useAuthStore from "../../../store/authStore";

const displayFont = {
    fontFamily: "'Fraunces', Georgia, serif",
};

export default function ProfilePage() {
    // Active tab now lives here
    const [activeTab, setActiveTab] = useState("orders");

    const { user } = useAuthStore();

    const initials =
        user?.userName
            ?.split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase() || "U";

    return (
        <div className="min-h-screen font-sans text-[#23241F]">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-1.5 text-xs text-[#6B6A63]">
                    <span>Home</span>
                    <ChevronRight size={12} />
                    <span className="font-medium text-[#23241F]">
                        My account
                    </span>
                </nav>

                {/* Profile Header */}
                <div className="mb-6 rounded-3xl border border-[#E7E3D8] bg-white p-6 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">

                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-300 ring-1 ring-gray-300">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.userName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-primary-foreground">
                                        {initials}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="mb-1.5 flex flex-wrap items-center gap-3">
                                <h1
                                    className="text-2xl text-[#23241F] sm:text-[28px]"
                                    style={displayFont}
                                >
                                    {user?.userName || "Loading..."}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[#6B6A63]">
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail size={13} />
                                    {user?.email || "-"}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <Phone size={13} />
                                    {user?.mobile || "No phone"}
                                </span>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <div className="flex items-center gap-2.5 sm:self-start">
                            <Button
                                variant="primary"
                                size="default"
                                icon={Edit3}
                                iconPosition="left"
                                iconsize={14}
                                className="cursor-pointer"
                                onClick={() => setActiveTab("settings")}
                            >
                                Edit Profile
                            </Button>
                        </div>

                    </div>
                </div>

                {/* Profile Tabs */}
                <ProfileTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}