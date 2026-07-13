
const styles = {
    success: "bg-success/10 text-success border border-success/20",

    warning: "bg-warning/10 text-warning border border-warning/20",

    danger: "bg-danger/10 text-danger border border-danger/20",

    info: "bg-blue-500/10 text-blue-600 border border-blue-500/20",

    primary: "bg-primary/10 text-primary border border-primary/20",

    neutral: "bg-destructive/10 text-destructive border border-destructive/20",
};

export default function StatusBadge({ tone = "neutral", children }) {
    return (
        <span
            className={`inline-flex w-28 items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                styles[tone] || styles.neutral
            }`}
            >
            {children}
        </span>
    );
}