import Button from "../../components/ui/Button";
import { GoArrowRight } from "react-icons/go";
import { countdown } from "./data";
import useProductStore from "../../store/productStore";
import FlashSaleCard from "../../components/ui/FlashSaleCard";

const FlashSale = () => {

  const { flashSalesProduct } = useProductStore()

  // console.log("flashSaleProduct is : ",flashSalesProduct);

  
  return (
    <section className="container mx-auto px-6 py-20 mt-35">
      {/* Heading */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
        {/* left */}

        
        <div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-8 rounded-xs bg-primary" />

            <span className="text-primary font-semibold">
              Today's
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-bold text-foreground">
            Flash Sales
          </h2>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-4">
          {countdown.map((item, index) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {item.label}
                </p>
                <h3 className="text-4xl font-bold text-foreground">
                  {item.value}
                </h3>
              </div>

              {index !== 3 && (
                <span className="text-3xl font-bold text-primary">
                  :{" "}
                  {/** display ":" after each item except the last one index 3. */}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7">
        {flashSalesProduct?.map((product) => (
          <FlashSaleCard key={product._id} {...product} />
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center mt-14">
        <Button
          className="px-10 py-4 cursor-pointer"
          icon={GoArrowRight}
          iconPosition="right"
          iconsize={24}
        >
          View All
        </Button>
      </div>
    </section>
  );
};

export default FlashSale;
