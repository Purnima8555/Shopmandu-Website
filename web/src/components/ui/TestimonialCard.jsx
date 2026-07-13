

const TestimonialCard = ({ icon: Icon, bacgroundColor, title = "Title", slog = "", className = "",}) => {
  return (
    <div className="group flex flex-col items-center text-center px-6 py-8 rounded-xl bg-card hover:-translate-y-1 transition-all duration-300">
      {/* Icon */}
      <div
        className={` w-18 h-18 rounded-2xl flex items-center justify-center text-foreground shadow-lg
          ${bacgroundColor}
          ${className}
        `}
      >
        <Icon size={30} className="group-hover:scale-110 transition-transform duration-300"/>
      </div>

      {/* Content */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{slog}</p>
      </div>
    </div>
  );
};
export default TestimonialCard;