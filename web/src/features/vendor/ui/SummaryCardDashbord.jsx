const SummaryCard = ({
  title,
  icon: Icon,
  summary = 0,
  iconBackground = "bg-primary-light",
  iconColor = "text-primary",
  iconSize = 20,
  tag,
  slogan,
  tagIcon: TagIcon,
  tagBg = "bg-success/10",
  tagColor = "text-success",
  prefix = "",
  suffix = "",
}) => {
  return (
    <div className="bg-bg-card rounded-[14px] border border-border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {title}
        </span>

        <div
          className={`flex items-center justify-center rounded-[10px] p-2 ${iconBackground} ${iconColor}`}
        >
          <Icon size={iconSize} />
        </div>
      </div>

      {/* Value */}
      <div className="mt-5">
        <h2 className="text-3xl font-bold text-text-primary">
          {prefix}
          {summary}
          {suffix}
        </h2>

        {(tag || slogan) && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            {tag && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium ${tagBg} ${tagColor}`}
              >
                {TagIcon && <TagIcon size={14} />}
                {tag}
              </span>
            )}

            {slogan && (
              <span className="text-text-secondary">
                {slogan}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;