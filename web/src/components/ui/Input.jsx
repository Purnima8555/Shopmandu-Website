import { forwardRef } from "react";

const Input = forwardRef(({ className = "",  size = "default",  variant = "default",  type = "text",  label,  error,  helperText,  disabled = false,  ...props}, ref) => {
    const baseWrapper = "flex flex-col gap-1 w-full";
    const baseInput ="w-full outline-none transition-all duration-200 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      default: "border-border focus:border-primary focus:ring-2 focus:ring-primary-light",

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
        {label && ( <label className="text-sm font-medium text-foreground">  {label} </label> )}

        <input ref={ref} type={type} disabled={disabled}
          className={`
            ${baseInput}
            ${variants[variant]}
            ${sizes[size]}
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""} `}
          {...props}/>

        {error && (
          <span className="text-xs text-red-500">
            {error}
          </span>
        )}

        {helperText && !error && (
          <span className="text-xs text-muted-foreground">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;