
import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis,Tooltip, CartesianGrid } from "recharts";
import Button from "../../components/ui/Button";
import ButtonRounded from "../../components/ui/ButtonRounded";

/* ---------------------------------- Data ---------------------------------- */
const KPIS = [
  { label: "Gross revenue", value: "$482,910", delta: "+12.4%", up: true, sub: "vs. last 30 days" },
  { label: "Active vendors", value: "1,284", delta: "+38", up: true, sub: "new this month" },
  { label: "Orders today", value: "3,027", delta: "-2.1%", up: false, sub: "vs. yesterday" },
  { label: "Pending approvals", value: "16", delta: "4 urgent", up: null, sub: "avg. wait 6h" },
];

const REVENUE = [
  { day: "Mon", value: 42100 },
  { day: "Tue", value: 51800 },
  { day: "Wed", value: 47250 },
  { day: "Thu", value: 61900 },
  { day: "Fri", value: 58200 },
  { day: "Sat", value: 71400 },
  { day: "Sun", value: 68300 },
];

const PENDING_APPROVALS = [
  { name: "Marlowe Ceramics", type: "New vendor", time: "2h ago", urgent: true },
  { name: "Fen & Fable Paper Co.", type: "Payout request", time: "5h ago", urgent: true },
  { name: "Coastline Supply", type: "New vendor", time: "1d ago", urgent: false },
  { name: "Ridgeline Coffee", type: "Listing review", time: "1d ago", urgent: false },
];

/* ---------------------------------- Helpers ---------------------------------- */
function TrendPill({ up, children }) {
  if (up === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-warning)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-warning)]">
        {children}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        up
          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
          : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
      }`}
    >
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {children}
    </span>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-mono text-sm text-foreground">${payload[0].value.toLocaleString()}</p>
    </div>
  );
}

/* ---------------------------------- Main Component ---------------------------------- */
const AdminDashboardPage = () => {
  const [range, setRange] = useState("7d");

  return (
    <div className="flex w-full flex-col bg-background text-foreground">

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
            <p className="text-muted-foreground mt-1">Marketplace performance across every vendor, today.</p>
          </div>

          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            {["24h", "7d", "30d"].map((r) => (
              <Button
                key={r}
                variant={range === r ? "primary" : "ghost"}
                size="sm"
                onClick={() => setRange(r)}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {KPIS.map((k) => (
            <div key={k.label} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-3xl font-semibold tracking-tighter">{k.value}</p>
                <TrendPill up={k.up}>{k.delta}</TrendPill>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Revenue Trend + Pending Approvals - 2:1 Ratio */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Trend (2 parts) */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Revenue trend</h2>
                <p className="text-sm text-muted-foreground">Gross merchandise value, all vendors</p>
              </div>
              <ButtonRounded
                variant="ghost"
                size="default"
                icon={MoreHorizontal}
              />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6a89a7" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#6a89a7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis tickFormatter={(v) => `$${v / 1000}k`} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#6a89a7" strokeWidth={3} fill="url(#revFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Approvals (1 part) */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Pending Approvals</h2>
              <span className="px-3 py-1 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-xs font-medium">
                {PENDING_APPROVALS.filter((a) => a.urgent).length} urgent
              </span>
            </div>

            <div className="space-y-5">
              {PENDING_APPROVALS.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      a.urgent ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]" : "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                    }`}
                  >
                    {a.urgent ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{a.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.type} • {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-8 w-full">
              Review All Pending Items
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;