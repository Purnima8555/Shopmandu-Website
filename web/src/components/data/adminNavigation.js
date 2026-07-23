import {
    LayoutGrid,
    UserRound,
    Users,
    Store,
    Layers,
    Package,
    ShoppingBag,
    Wallet,
    Ticket,
    Settings,
} from "lucide-react";

export const ADMIN_NAV = [
    {
        title: null,
        items: [
        {
            label: "Overview",
            icon: LayoutGrid,
            path: "/admin/dashboard",
        },
        ],
    },
    {
        title: "Management",
        items: [
        {
            label: "Users",
            icon: UserRound,
            path: "/admin/users",
        },
        {
            label: "Vendors",
            icon: Users,
            path: "/admin/vendors",
        },
        {
            label: "Shops",
            icon: Store,
            path: "/admin/shops",
        },
        ],
    },
    {
        title: "Catalog",
        items: [
        {
            label: "Categories",
            icon: Layers,
            path: "/admin/categories",
        },
        {
            label: "Products",
            icon: Package,
            path: "/admin/products",
        },
        ],
    },
    {
        title: "Sales",
        items: [
        {
            label: "Orders",
            icon: ShoppingBag,
            path: "/admin/orders",
        },
        {
            label: "Payouts",
            icon: Wallet,
            path: "/admin/payouts",
        },
        ],
    },
    {
        title: "Marketing",
        items: [
        {
            label: "Coupons",
            icon: Ticket,
            path: "/admin/coupons",
        },
        ],
    },

        {
        title: "Account",
        items: [
        {
            label: "Settings",
            icon: Settings,
            path: "/admin/settings",
        },
        ],
    },

];
