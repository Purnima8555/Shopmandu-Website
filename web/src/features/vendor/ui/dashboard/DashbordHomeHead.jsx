import { CalendarDays, Store } from "lucide-react";
import useAuthStore from "../../../auth/store/auth.store";


const DashbordHomeHead = () => {
  const { user } = useAuthStore();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <section className="relative overflow-hidden rounded-2xl border animation-fade-in bg-card border-border shadow-sm">
      {/* Decorative Background */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl opacity-15 bg-primary-light" />
      <div className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full blur-3xl opacity-10 bg-highlight" />

      <div className="relative flex flex-col justify-between gap-4 px-6 py-4 md:flex-row md:items-start">
        {/* Left */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-1 rounded-full px-4 py-1 text-sm font-medium mb-4 bg-primary-light text-primary">
            <Store size={15} />
            Vendor Dashboard
          </div>

          <h1 className="text-3xl font-bold leading-tight text-foreground">
            Welcome back,
            <span className="ml-2 text-primary">{user.userName}</span>
            <span className="ml-2 animate-fload inline-block">👋</span>
          </h1>

          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted-foreground ">
            Manage your products, monitor orders, track your sales, and grow
            your business from one place.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 rounded-full bg-surface px-5 py-2.5">
          <CalendarDays size={20} className="text-primary" />

          <div>
            <p className="text-sm text-foreground">{today}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashbordHomeHead;
