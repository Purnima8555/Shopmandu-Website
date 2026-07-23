import { formatCurrency } from "./adminHelper";


export function ChartTooltip({ active, payload, label }) {  /// when hover on chart then display it with label/week and revenue value
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

