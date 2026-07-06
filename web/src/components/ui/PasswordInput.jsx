import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Input from "./Input";

const PasswordInput = ({  label = "Password",  placeholder = "••••••••", className = "", ...props}) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <div className="relative">
        <Input label={label}
          type={showPass ? "text" : "password"}
          placeholder={placeholder} {...props}/>
          
        <button type="button" onClick={() => setShowPass(!showPass)} className=" absolute right-3 top-9.5 translate-y-0 text-muted-foreground hover:text-primary cursor-pointer">
          {showPass ? (
            <IoEyeOffOutline size={22} />
          ) : (
            <IoEyeOutline size={22} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;