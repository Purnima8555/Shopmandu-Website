

const Loader = ({size = "default", text = "Loading...",fullScreen = false}) => {
  const sizes = {
    sm: "w-6 h-6 border-2",
    default: "w-10 h-10 border-3",
    lg: "w-14 h-14 border-4",
  };

  return (
    <div
      className={` flex flex-col items-center justify-center gap-4
        ${fullScreen ? "fixed inset-0 bg-[var(--glass-bg)] backdrop-blur-sm z-[999]" : "py-8"}
      `}
    >
      <div className={` ${sizes[size]} rounded-full  border-border border-t-primary animate-spin-smooth `}/>
      {text && (
        <p className="text-sm font-medium text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;