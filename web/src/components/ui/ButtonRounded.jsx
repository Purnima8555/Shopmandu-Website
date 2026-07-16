
const ButtonRounded = ({className = "", variant = "primary", size = "default", icon: Icon, iconPosition = "center", iconSize=20,  iconClassName = "",children, onClick, type = "button", disabled = false, ...props}) => {
  const base =
    "relative inline-flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 font-medium select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: ` bg-primary text-primary-foreground hover:brightness-95 shadow-md `,
    secondary: ` bg-secondary text-secondary-foreground hover:brightness-95 `,
    ghost: ` bg-transparent text-foreground hover:bg-surface `,
    outline: ` bg-transparent border border-border text-foreground hover:border-primary hover:text-primary `,
  };

  const sizes = {
    sm: "w-9 h-9 text-sm",
    default: "w-11 h-11 text-base",
    lg: "w-14 h-14 text-lg",
  };

  const renderContent = () => {
    if (iconPosition === "center") {
      return Icon ? <Icon className={`w-5 h-5 ${iconClassName}`} size={iconSize} /> : children;
    }
    if (iconPosition === "left") {
      return (
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-4 h-4 ${iconClassName}`} size={iconSize} />}
          {children}
        </div>
      );
    }
    if (iconPosition === "right") {
      return (
        <div className="flex items-center gap-2">
          {children}
          {Icon && <Icon className="w-4 h-4" size={iconSize}/>}
        </div>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base}${variants[variant]} ${sizes[size]} rounded-full ${className}`}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default ButtonRounded;