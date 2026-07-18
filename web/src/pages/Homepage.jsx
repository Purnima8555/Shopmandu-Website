import Testimonials from "./Home/Testimonials";
import FlashSale from "./Home/FlashSale";
import ExploreByCategory from "./Home/ExploreByCategory";
import HomeSlider from "./Home/HomeSlider";
import Button from "../components/ui/Button";
import { getFlashSaleProductsApi } from "../api/product.api";
import ExploreProducts from "./Home/ExploreProducts";
import BestSelling from "./Home/BestSelling";
import { useNavigate } from "react-router-dom";


function HomePage() {

  /// simply get flash sale products and display in console
  const flashSaleProducts = async () => {
    try {
      const data = await getFlashSaleProductsApi({});
  
      console.log("Flash Sale Products:", data);
    } catch (error) {
      console.error("Error fetching flash sale products:", error);
    }
  };

  const navigate = useNavigate()


  return (
    <section className="bg-background">
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-primary-light text-primary font-medium mb-6 animation-fade-in">
              Up to 50% OFF This Week
            </span>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-foreground animation-fade-in animation-delay-100">
              Exclusive Deals on
              <span className="block text-primary">
                Premium Products
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl animation-fade-in animation-delay-200">
              Shop thousands of products from trusted vendors across Nepal.
              Discover fashion, electronics, gadgets, groceries, home essentials
              and much more at unbeatable prices.
            </p>

            <div className="flex flex-wrap gap-4 mt-10 animation-fade-in animation-delay-300">
              <Button size="lg" onClick={()=>{flashSaleProducts(); navigate('/products')}} className="px-12 cursor-pointer">
                Shop Now
              </Button>
            </div>

            <div className="flex gap-12 mt-14 animation-fade-in animation-delay-300">
              <div>
                <h2 className="text-3xl font-bold">15K+</h2>
                <p className="text-muted-foreground">Products</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">500+</h2>
                <p className="text-muted-foreground">Vendors</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">98%</h2>
                <p className="text-muted-foreground">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>

          {/* right Banner / Slider */}
          <HomeSlider />
        </div>

        <FlashSale />
        <ExploreByCategory />
        <BestSelling />
        <ExploreProducts/>
        <Testimonials />
      </div>
    </section>
  );
}

export default HomePage;
