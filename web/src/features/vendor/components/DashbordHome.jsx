import {CheckCircle2,DollarSign,Package, ShoppingCart,} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";

import { MONTHS } from "../data";
import useOrderStore from "../../order/store/order.store";
import DashbordHomeHead from "../ui/dashboard/DashbordHomeHead";

/*  Helpers  */
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

const YEARS = Array.from(
    { length: CURRENT_YEAR - 2020 + 1 },
    (_, i) => CURRENT_YEAR - i
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
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-lg font-semibold">
                {formatCurrency(payload[0].value)}
            </p>
        </div>
    );
}

/* ------------------------------- Component ------------------------------- */

const DashboardHome = () => {
    const today = new Date();

    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());

    const {
        loading,
        vendorSalesSummary,
        vendorSalesTrend,
        getVendorSalesSummary,
        getVendorSalesTrend,
    } = useOrderStore();

    useEffect(() => {
        const params = {
            month,
            year,
        };

        getVendorSalesSummary(params);
        getVendorSalesTrend(params);
    }, [month, year, getVendorSalesSummary, getVendorSalesTrend]);

    /* KPI Cards */

    const kpis = useMemo(() => {
        if (!vendorSalesSummary) return [];

        return [
            {
                title: "Total Revenue",
                value: formatCurrency(
                    vendorSalesSummary.totalRevenue
                ),
                subtitle: vendorSalesSummary.period,
                icon: DollarSign,
            },
            {
                title: "Total Orders",
                value: vendorSalesSummary.totalOrders,
                subtitle: "Orders received",
                icon: ShoppingCart,
            },
            {
                title: "Delivered Orders",
                value: vendorSalesSummary.deliveredOrders,
                subtitle: "Successfully delivered",
                icon: CheckCircle2,
            },
            {
                title: "Average Order Value",
                value: formatCurrency(
                    vendorSalesSummary.averageOrderValue
                ),
                subtitle: "Per delivered order",
                icon: Package,
            },
        ];
    }, [vendorSalesSummary]);

    /* Order Status */

    const orderStatus = useMemo(() => {
        if (!vendorSalesSummary) return [];

        return [
            {
                label: "Pending",
                value: vendorSalesSummary.pendingOrders,
            },
            {
                label: "Confirmed",
                value: vendorSalesSummary.confirmedOrders,
            },
            {
                label: "Processing",
                value: vendorSalesSummary.processingOrders,
            },
            // {
            //     label: "Partially Shipped",
            //     value:
            //         vendorSalesSummary.partiallyShippedOrders,
            // },
            {
                label: "Out For Delivery",
                value:
                    vendorSalesSummary.outForDeliveryOrders,
            },
            {
                label: "Delivered",
                value: vendorSalesSummary.deliveredOrders,
            },
            {
                label: "Cancelled",
                value: vendorSalesSummary.cancelledOrders,
            },
        ];
    }, [vendorSalesSummary]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <DashbordHomeHead />

            {/* KPI Cards */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 animation-fade-in animation-delay-200">
                {kpis.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {item.title}
                                </p>

                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Icon
                                        size={18}
                                        className="text-primary"
                                    />
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
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 animation-fade-in animation-delay-300">
                          {/* Revenue Trend */}
                <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Revenue Trend
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Weekly revenue for{" "}
                                {MONTHS.find((m) => m.value === month)?.label}
                                {year}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Month */}
                            <select
                                value={month}
                                onChange={(e) =>
                                    setMonth(Number(e.target.value))
                                }
                                className="rounded-xl border border-border bg-card px-4 py-2 outline-none"
                            >
                                {MONTHS.map((m) => (
                                    <option
                                        key={m.value}
                                        value={m.value}
                                        disabled={year === CURRENT_YEAR && m.value > CURRENT_MONTH}
                                        >
                                        {m.label}
                                    </option>
                                ))}
                            </select>

                            {/* Year */}
                            <select
                                value={year}
                                onChange={(e) =>
                                    setYear(Number(e.target.value))
                                }
                                className="rounded-xl border border-border bg-card px-4 py-2 outline-none"
                            >
                                {YEARS.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Revenue Summary */}
                    <div className="mb-6">
                        <p className="text-sm text-muted-foreground">
                            Total Revenue
                        </p>

                        <h2 className="mt-2 text-4xl font-bold tracking-tight">
                            {loading
                                ? "--"
                                : formatCurrency(
                                    vendorSalesTrend?.totalRevenue
                                )}
                        </h2>
                    </div>

                    {/* Chart */}
                    <div className="h-80">
                        {vendorSalesTrend?.chart?.length ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <AreaChart
                                    data={vendorSalesTrend.chart}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="revFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
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
                                            `Rs.${(
                                                value / 1000
                                            ).toFixed(0)}k`
                                        }
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <Tooltip
                                        content={<ChartTooltip />}
                                    />

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
                                    <p className="text-lg font-medium">
                                        No Revenue Data
                                    </p>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        No delivered orders were found for this
                                        period.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                                {/* Order Status */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            Order Status
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Distribution of orders for the selected period.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {orderStatus.map((status) => {
                            const percentage =
                                vendorSalesSummary?.totalOrders > 0
                                    ? (status.value /
                                          vendorSalesSummary.totalOrders) *
                                    100
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

                    <div className="my-8 border-t border-border" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Total Revenue
                            </span>

                            <span className="font-semibold">
                                {loading
                                    ? "--"
                                    : formatCurrency(
                                        vendorSalesSummary?.totalRevenue
                                    )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Average Order Value
                            </span>

                            <span className="font-semibold">
                                {loading
                                    ? "--"
                                    : formatCurrency(
                                        vendorSalesSummary?.averageOrderValue
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;