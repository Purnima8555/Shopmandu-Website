

const Button = ({ className = "", size = "default", variant = "primary", type = "button", disabled = false, onClick, children = "Button", icon: Icon, iconPosition = "right", iconsize=24, ...props}) => {
  /// base class for each button
  const baseClasses = `relative overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 group `;

  /// variants, default primary
  const variants = {
    primary: ` bg-primary text-primary-foreground border border-primary hover:brightness-95 shadow-md`,
    accent: ` bg-highlight text-white border border-highlight hover:brightness-95 shadow-md`,
    secondary: ` bg-secondary text-secondary-foreground border border-border hover:brightness-95`,
    ghost: ` bg-transparent text-secondary-foreground hover:bg-surface`,
    outline: ` bg-transparent border border-border text-foreground hover:border-primary hover:text-primary`,
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    default: "px-6 py-2 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  //// select style base on properties.
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    //// button create with props and base property
    <button type={type}  onClick={onClick}  disabled={disabled}  className={classes}
      {...props}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      <span className="relative z-10 flex items-center gap-2 justify-around">
        <span> {Icon && iconPosition === "left" && <Icon size={iconsize} />} </span>
        {children}
        <span> {Icon && iconPosition === "right" && <Icon size={iconsize} />} </span>
      </span>
      <span className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all" />
    </button>
  );
};

export default Button;
