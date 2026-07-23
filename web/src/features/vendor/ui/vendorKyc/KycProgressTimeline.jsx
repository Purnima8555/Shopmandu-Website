import { CheckCircle, X, Calendar } from "lucide-react";
import {
  buildTimelineSteps,
  TIMELINE_DOT_CLASSES,
} from "../../util/kycConstants";

const KycProgressTimeline = ({ status, record }) => {
  const timelineSteps = buildTimelineSteps(status, record);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-md p-6">
      <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-border">
        {timelineSteps.map((step, idx) => (
          <div key={idx} className="flex gap-4 relative z-10">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 ${TIMELINE_DOT_CLASSES[step.status]}`}
            >
              {step.status === "completed" ? (
                <CheckCircle className="w-4 h-4" />
              ) : step.status === "rejected" ? (
                <X className="w-4 h-4" />
              ) : (
                <span>{idx + 1}</span>
              )}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground leading-tight">
                {step.title}
              </h4>
              <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {step.date}
              </span>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KycProgressTimeline;
