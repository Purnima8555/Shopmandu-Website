const Selecter = ({ className = "", size = "default", variant = "default", label, error, disabled = false, children, ...props}) => {
  const baseWrapper = "flex flex-col gap-1 w-full";

  const baseSelect = "w-full outline-none transition-all duration-200 rounded-xl border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default:"border-border focus:border-primary focus:ring-2 focus:ring-primary-light",
    ghost: "border-transparent bg-surface focus:border-primary focus:ring-2 focus:ring-primary-light",
    outline: "border-border bg-transparent focus:border-primary",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  return (
    <div className={`${baseWrapper} ${className}`}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <select
        disabled={disabled}
        className={`${baseSelect} ${variants[variant]} ${sizes[size]}`}
        {...props}
      >
        {children}
      </select>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Selecter;