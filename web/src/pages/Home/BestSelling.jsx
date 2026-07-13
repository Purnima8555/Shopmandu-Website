import { GoArrowRight } from "react-icons/go";
import Button from "../../components/ui/Button";
import useProductStore from "../../store/productStore";
import { useEffect } from "react";
import FlashSaleCard from "../../components/ui/FlashSaleCard";
import Loader from "../../components/common/Loader";
// import Loader from "../../components/common/Loader";

export default function BestSelling() {
  const getBestSellingProducts = useProductStore(
    (state) => state.getBestSellingProducts,
  );
  const bestSellingProducts = useProductStore(
    (state) => state.bestSellingProducts,
  );
  const loading = useProductStore((state) => state.loading);

  useEffect(() => {
    getBestSellingProducts({ page: 1, limit: 10, bestSale: true });
  }, [getBestSellingProducts]);

  if (loading) {
    return <Loader />;
  }
  if (!bestSellingProducts?.length) {
    return null;
  }
  return (
    <section className="container mx-auto px-6 py-20 mt-35">
      {/* Heading */}
      {bestSellingProducts > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-8 rounded-xs bg-primary" />
              <span className="text-primary font-semibold">This Weeks</span>
            </div>

            <h2 className="mt-6 text-4xl font-bold text-foreground">
              Best Selling Products
            </h2>
          </div>

          <div className="flex justify-center mt-14">
            <Button
              className="px-6 py-3 cursor-pointer"
              icon={GoArrowRight}
              iconPosition="right"
              iconsize={24}
            >
              View All
            </Button>
          </div>
        </div>
      )}

      {/* display product here.*/}
      {bestSellingProducts > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7">
          {bestSellingProducts?.map((product) => (
            <FlashSaleCard key={product._id} {...product} />
          ))}
        </div>
      )}
    </section>
  );
}
