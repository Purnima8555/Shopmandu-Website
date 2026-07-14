
import DashbordHomeHead from "../ui/DashbordHomeHead";
import SummaryCard from "../ui/SummaryCardDashbord";
import { getDashboardSummary } from "../data";
import useOrderStore from "../../../store/orderStore";
import useShopStore from "../../../store/shop";

const DashboardHome = () => {
    const {vendorSalesSummary} = useOrderStore();
    console.log(vendorSalesSummary)

  const { productsSummary } =
    useShopStore();

    console.log(productsSummary)
const dashboardSummary = getDashboardSummary(
    vendorSalesSummary,
   productsSummary
);
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
