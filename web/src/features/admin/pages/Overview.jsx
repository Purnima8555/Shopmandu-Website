import {
    CheckCircle2,
    DollarSign,
    MoreHorizontal,
    Package,
    ShoppingCart,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import ButtonRounded from "../../../components/ui/ButtonRounded";
import useOrderStore from "../../../store/orderStore";

/* ---------------------------------- Helpers ---------------------------------- */

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from(
  { length: CURRENT_YEAR - 2020 + 1 },
  (_, i) => CURRENT_YEAR - i,
);

const formatCurrency = (value = 0) =>
  `Rs.${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-lg font-semibold">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

/* -------------------------------- Component -------------------------------- */

const AdminDashboardPage = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const {
    loading,
    salesSummary,
    salesTrend,
    getAdminSalesSummary,
    getAdminSalesTrend,
  } = useOrderStore();

  useEffect(() => {
    const params = {
      month,
      year,
    };

    getAdminSalesSummary(params);
    getAdminSalesTrend(params);
  }, [month, year]);

  const kpis = useMemo(() => {
    if (!salesSummary) return [];

    return [
      {
        title: "Gross Sales",
        value: formatCurrency(salesSummary.grossSales),
        subtitle: salesSummary.period,
        icon: DollarSign,
      },
      {
        title: "Total Orders",
        value: salesSummary.totalOrders,
        subtitle: "Orders received",
        icon: ShoppingCart,
      },
      {
        title: "Delivered Orders",
        value: salesSummary.deliveredOrders,
        subtitle: "Successfully delivered",
        icon: CheckCircle2,
      },
      {
        title: "Average Order Value",
        value: formatCurrency(salesSummary.averageOrderValue),
        subtitle: "Per delivered order",
        icon: Package,
      },
    ];
  }, [salesSummary]);

  const orderStatus = useMemo(() => {
    if (!salesSummary) return [];

    return [
      {
        label: "Pending",
        value: salesSummary.pendingOrders,
      },
      {
        label: "Confirmed",
        value: salesSummary.confirmedOrders,
      },
      {
        label: "Processing",
        value: salesSummary.processingOrders,
      },
      {
        label: "Out For Delivery",
        value: salesSummary.outForDeliveryOrders,
      },
      {
        label: "Delivered",
        value: salesSummary.deliveredOrders,
      },
      {
        label: "Cancelled",
        value: salesSummary.cancelledOrders,
      },
    ];
  }, [salesSummary]);

  return (
    <div className="flex w-full flex-col bg-background text-foreground">
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-muted-foreground">
              Monitor revenue, orders and marketplace performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Month */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-xl border border-border bg-card px-4 py-2 outline-none"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-xl border border-border bg-card px-4 py-2 outline-none"
            >
              {YEARS.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Cards */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{item.title}</p>

                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon size={18} className="text-primary" />
                  </div>
                </div>

                <h2 className="mt-6 text-3xl font-bold tracking-tight">
                  {loading ? "--" : item.value}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Revenue Trend + Order Status */}
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Revenue Trend</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Weekly revenue for{" "}
                  {MONTHS.find((m) => m.value === month)?.label} {year}
                </p>
              </div>

              <ButtonRounded
                variant="ghost"
                size="default"
                icon={MoreHorizontal}
              />
            </div>

            {/* Revenue Summary */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight">
                {loading ? "--" : formatCurrency(salesTrend?.totalRevenue)}
              </h2>
            </div>

            {/* Chart */}

            <div className="h-80">
              {salesTrend?.chart?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesTrend.chart}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#6a89a7"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="#6a89a7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                    />
                    <XAxis
                      dataKey="label"
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickFormatter={(value) =>
                        `Rs.${(value / 1000).toFixed(0)}k`
                      }
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip content={<ChartTooltip />} />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6a89a7"
                      strokeWidth={3}
                      fill="url(#revFill)"
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-medium">No Revenue Data</p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      No delivered orders were found for this period.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Status */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Order Status</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Distribution of orders for the selected period.
              </p>
            </div>

            <div className="space-y-4">
              {orderStatus.map((status) => {
                const percentage =
                  salesSummary?.totalOrders > 0
                    ? (status.value / salesSummary.totalOrders) * 100
                    : 0;

                return (
                  <div key={status.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {status.label}
                      </span>

                      <span className="font-semibold">
                        {loading ? "--" : status.value}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-border" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gross Sales</span>

                <span className="font-semibold">
                  {loading ? "--" : formatCurrency(salesSummary?.grossSales)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Average Order Value
                </span>

                <span className="font-semibold">
                  {loading
                    ? "--"
                    : formatCurrency(salesSummary?.averageOrderValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
