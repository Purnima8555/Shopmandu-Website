

import { ArrowLeftRight, BarChart3, CheckCircle2, LayoutDashboard, Package, PlusCircle, SettingsIcon, ShoppingBag, Store, DollarSign, ShoppingCart, RotateCcw, TrendingUp, AlertCircle, } from "lucide-react"

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
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
  }
];


export const INITIAL_SHOP_PROFILE = {
  name: 'Aetheris Handcrafted Essentials',
  description: 'Meticulously crafted leather goods, artisanal ceramics, premium electronics workspace peripherals, and lifestyle accessories for conscious professionals and design enthusiasts.',
  email: 'partner@aetheris.co',
  phone: '+1 (800) 555-8743',
  address: '100 Artisan Way, Industrial District, Portland, OR 97201',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Elegant abstract shape
  banner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3', // Minimalist interior
  businessHours: '09:00 AM - 06:00 PM (Monday - Friday)',
  socialLinks: {
    website: 'https://aetheris.co',
    instagram: 'https://instagram.com/aetheris.co',
    facebook: 'https://facebook.com/aetheris.co',
    twitter: 'https://twitter.com/aetherisco'
  },
  isActive: true,
  kycStatus: 'Pending'
};


export const dashboardSummary = [
  {
    title: "Total Revenue",
    icon: DollarSign,
    summary: "500.50",
    prefix: "$",
    tag: "+14.2%",
    slogan: "vs last 30 days",
    tagIcon: TrendingUp,
    iconBackground: "bg-primary-light",
    iconColor: "text-primary",
    tagBg: "bg-success/10",
    tagColor: "text-success",
  },

  {
    title: "Total Orders",
    icon: ShoppingCart,
    summary: 5,
    tag: "+8.4%",
    slogan: "vs last 30 days",
    tagIcon: TrendingUp,
    iconBackground: "bg-primary-light",
    iconColor: "text-primary",
    tagBg: "bg-success/10",
    tagColor: "text-success",
  },

  {
    title: "Total Products",
    icon: Package,
    summary: 8,
    tag: "6 Active",
    slogan: "2 non-active",
    tagIcon: Package,
    iconBackground: "bg-highlight/10",
    iconColor: "text-highlight",
    tagBg: "bg-primary-light",
    tagColor: "text-primary",
  },

  {
    title: "Return Requests",
    icon: RotateCcw,
    summary: 1,
    tag: "Requires Review",
    slogan: "Pending decisions",
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