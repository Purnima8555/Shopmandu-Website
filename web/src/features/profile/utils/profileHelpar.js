
import { STEPS, TIMELINE_STEPS } from "../data";


export function stepIndex(status) {
  if (status === "PARTIALLY_SHIPPED") return 2;
  const i = STEPS.findIndex((s) => s.key === status);
  return i === -1 ? 0 : i;
}




export function timelineIndex(status) {
    if (status === "REJECTED") return 1; // got as far as review, then rejected
    const i = TIMELINE_STEPS.findIndex((s) => s.key === status);
    return i === -1 ? 0 : i;
}

export function prettyStatus(status) {
    return status
        .toLowerCase()
        .replace("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function prettyReason(reason) {
    return reason
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
