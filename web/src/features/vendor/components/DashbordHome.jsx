
import DashbordHomeHead from "../ui/DashbordHomeHead";
import SummaryCard from "../ui/SummaryCardDashbord";
import { dashboardSummary } from "../data";

const DashboardHome = () => {
  return (
    <div className="space-y-4">
        {/* Header, welcome */}
      <DashbordHomeHead />
      {/* summary Card */}
<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 animation-fade-in animation-delay-200">
  {dashboardSummary.map((card) => (
    <SummaryCard
      key={card.title}
      {...card}
    />
  ))}
</div>


    </div>
  );
};

export default DashboardHome;
