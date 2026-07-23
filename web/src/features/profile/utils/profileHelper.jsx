import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { STEPS } from "../data";
import { stepIndex } from "./profileHelpar";


export function OrderStepper({ status }) {
  const isTerminalIssue = status === "CANCELLED" || status === "FAILED";

  if (isTerminalIssue) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[#EFD9D2] bg-[#FBF3F0] px-5 py-4">
        <AlertTriangle size={18} className="shrink-0 text-[#B3543E]" />
        <p className="text-sm text-[#6B6A63]">
          This order was{" "}
          <span className="font-medium text-[#B3543E]">
            {status === "CANCELLED" ? "cancelled" : "marked as failed"}
          </span>{" "}
          and is not currently in progress.
        </p>
      </div>
    );
  }

  const current = stepIndex(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={step.key}
            className="flex flex-1 items-center last:flex-none"
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  done || active
                    ? "bg-primary text-white"
                    : "bg-[#F1F0EC] text-[#6B6A63]"
                }`}
              >
                {done ? <CheckCircle2 size={15} /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  done || active ? "text-[#23241F]" : "text-[#6B6A63]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded-full ${
                  done ? "bg-primary" : "bg-[#E7E3D8]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function InfoCard({ icon: Icon, title, children, action }) {
  return (
    <div className="rounded-2xl border border-[#E7E3D8] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#23241F]">
          <Icon size={16} className="text-primary" />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title }) {
  return (
    <div className="mb-6">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
      </div>
    </div>
  );
}
