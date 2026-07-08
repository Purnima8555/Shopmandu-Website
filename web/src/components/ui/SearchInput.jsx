import { forwardRef } from "react";
import Input from "./Input";
import { Search } from "lucide-react";

const SearchInput = forwardRef(({ icon: Icon = Search, iconPosition = "left", className = "", size="default", placeholder="", disabled=false, ...props},ref ) => {
    return (
      <div className={`relative w-full ${className}`}>
        {iconPosition === "left" && (
          <Icon size={22} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-card text-muted-foreground pointer-events-none z-10"/>)}
        <Input ref={ref} {...props} size={size} placeholder={placeholder}  disabled={disabled} className={`${iconPosition === "left" ? "pl-0" : "pr-0"}`}/>

        {iconPosition === "right" && (
          <Icon size={22} className="absolute right-4 top-1/2 -translate-y-1/2 bg-card text-muted-foreground pointer-events-none z-10"/>
        )}
      </div>
    );
  }
);


export default SearchInput;