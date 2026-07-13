const SummaryCard = ({
  title = "Title",
  summary = 0,
  icon: Icon,
  iconsize = 24,
  iconBackground = "bg-bg-surface",
  iconColor = "text-text-secondary",
  valueColor = "text-text-primary",
}) => {
  return (
    <div className="flex items-center justify-between rounded-[14px] border border-border bg-bg-card p-4 shadow-sm">
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
          {title}
        </span>

        <span className={`mt-1 block text-2xl font-extrabold ${valueColor}`}>
          {summary}
        </span>
      </div>

      <span
        className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${iconBackground} ${iconColor}`}
      >
        {Icon && <Icon size={iconsize} />}
      </span>
    </div>
  );
};

export default SummaryCard;