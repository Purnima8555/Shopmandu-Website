import { GoArrowRight } from "react-icons/go";
import Button from "../../components/ui/Button";
import useProductStore from "../../store/productStore";
import { useEffect } from "react";
import FlashSaleCard from "../../components/ui/FlashSaleCard";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
// import Loader from "../../components/common/Loader";


export default function ExploreProducts() {

const getProducts = useProductStore((state) => state.getProducts);
const products = useProductStore((state) => state.products);
const loading = useProductStore((state) => state.loading);

  const navigate = useNavigate();

  useEffect(  () => {
    getProducts({ page: 1, limit: 10})
  }, [getProducts]);
  
  if (loading) {
  return <Loader />
}

    // console.log("Products : ", products)
  
  return (
    <section className="container mx-auto px-6 py-20 mt-10">
      {/* Heading */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-8 rounded-xs bg-primary" />
            <span className="text-primary font-semibold">
              Our Products
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-bold text-foreground">
            Explore our Products
          </h2>
        </div>
      </div>

      {/* display product here.*/}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7">
        {products?.map((product) => (
          <FlashSaleCard key={product._id} {...product} />
        ))}
      </div>
      
      <div className="flex justify-center mt-14">
        <Button
          className="px-10 py-4 cursor-pointer"
          icon={GoArrowRight}
          iconPosition="right"
          iconsize={24}
          onClick={()=>navigate("/products")}
        >
          View All Products
        </Button>
      </div>
    </section>
  );
}
