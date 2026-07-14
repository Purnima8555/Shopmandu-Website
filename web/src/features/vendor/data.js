

import { ArrowLeftRight, CheckCircle2, LayoutDashboard, Package, PlusCircle, SettingsIcon, ShoppingBag, Store, DollarSign, ShoppingCart, RotateCcw, TrendingUp, AlertCircle, } from "lucide-react"

export const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'shop',
    label: 'Shop',
    icon: Store,
    isGroup: true,
    subItems: [
      { id: 'shop-profile', label: 'Shop Profile', icon: Store },
      { id: 'kyc-verification', label: 'KYC Verification', icon: CheckCircle2 }
    ]
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    isGroup: true,
    subItems: [
      { id: 'all-products', label: 'All Products', icon: Package },
      { id: 'add-product', label: 'Add Product', icon: PlusCircle }
    ]
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingBag,
    isGroup: true,
    subItems: [
      { id: 'all-orders', label: 'All Orders', icon: ShoppingBag },
      { id: 'returns', label: 'Returns', icon: ArrowLeftRight }
    ]
  },
  // {
  //   id: 'analytics',
  //   label: 'Analytics',
  //   icon: BarChart3,
  // },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
  }
];



export const getDashboardSummary = (summary, productsSummary) => [
  {
    title: "Total Revenue",
    icon: DollarSign,
    summary: summary?.totalRevenue ?? 0,
    prefix: "Rs. ",
    tag: `${summary?.averageOrderValue ?? 0}`,
    slogan: "Average order value",
    tagIcon: TrendingUp,
    iconBackground: "bg-primary-light",
    iconColor: "text-primary",
    tagBg: "bg-success/10",
    tagColor: "text-success",
  },

  {
    title: "Total Orders",
    icon: ShoppingCart,
    summary: summary?.totalOrders ?? 0,
    tag: `${summary?.confirmedOrders ?? 0} Confirmed`,
    slogan: `${summary?.pendingOrders ?? 0} Pending`,
    tagIcon: TrendingUp,
    iconBackground: "bg-primary-light",
    iconColor: "text-primary",
    tagBg: "bg-success/10",
    tagColor: "text-success",
  },

  {
    title: "Products",
    icon: Package,
    summary: productsSummary.totalProducts,
    tag: `${summary?.processingOrders ?? 0} Processing`,
    slogan: `${summary?.partiallyShippedOrders ?? 0} Partially Shipped`,
    tagIcon: Package,
    iconBackground: "bg-highlight/10",
    iconColor: "text-highlight",
    tagBg: "bg-primary-light",
    tagColor: "text-primary",
  },

  {
    title: "Cancelled Orders",
    icon: RotateCcw,
    summary: summary?.cancelledOrders ?? 0,
    tag: `${summary?.deliveredOrders ?? 0} Delivered`,
    slogan: `${summary?.outForDeliveryOrders ?? 0} Out for delivery`,
    tagIcon: AlertCircle,
    iconBackground: "bg-danger/10",
    iconColor: "text-danger",
    tagBg: "bg-warning/10",
    tagColor: "text-warning",
  },
];

export const filterOptions = {

  statuses: [
    { label: "Status: All", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Out of Stock", value: "OUT_OF_STOCK" },
  ],

  stocks: [
    { label: "Stock: All Levels", value: "ALL" },
    { label: "In Stock (6+ units)", value: "IN_STOCK" },
    { label: "Low Stock (1–5 units)", value: "LOW_STOCK" },
    { label: "Out of Stock (0 units)", value: "OUT_OF_STOCK" },
  ],

  sorts: [
    { label: "Sort: Newest", value: "NEWEST" },
    { label: "Sort: Oldest", value: "OLDEST" },
    { label: "Price: Low → High", value: "PRICE_ASC" },
    { label: "Price: High → Low", value: "PRICE_DESC" },
    { label: "Stock: Low → High", value: "STOCK_ASC" },
    { label: "Stock: High → Low", value: "STOCK_DESC" },
    { label: "Name: A → Z", value: "NAME_ASC" },
    { label: "Name: Z → A", value: "NAME_DESC" },
  ],
};

export const filterOrders = [
  { label: "All Orders", value: "", },
  { label: "Pending", value: "PENDING", },
  { label: "Confirmed", value: "CONFIRMED", },
  { label: "Processing", value: "PROCESSING", },
  { label: "Partially Shipped", value: "PARTIALLY_SHIPPED", },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY", },
  { label: "Delivered", value: "DELIVERED", },
  { label: "Cancelled", value: "CANCELLED", },
  { label: "Return Requested", value: "RETURN_REQUESTED", },
  { label: "Returned", value: "RETURNED", },
  { label: "Failed", value: "FAILED", },
];