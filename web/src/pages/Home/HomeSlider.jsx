import { useRef, useEffect, useState } from "react";
import { homeBannerSlider } from "./data";
import Button from "../../components/ui/Button";
import ButtonRounded from "../../components/ui/ButtonRounded";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const HomeSlider = () => {

      const [currentIndex, setCurrentIndex] = useState(0);
      const timerRef = useRef(null); /// at one time create when components are rendered and it will not be recreated when component re-rendered.
    
      const startAutoSlide = () => {
        clearTimeout(timerRef.current);
    
        timerRef.current = setTimeout(() => {
          next();
        }, 5000);
      };
    
      const next = () => {
        setCurrentIndex((prev) => (prev + 1) % homeBannerSlider.length);
        startAutoSlide();
      };
    
      const previous = () => {
        setCurrentIndex(
          (prev) => (prev - 1 + homeBannerSlider.length) % homeBannerSlider.length,
        );
        startAutoSlide();
      };
    
      useEffect(() => {
        startAutoSlide();
        return () => clearTimeout(timerRef.current);
      }, []);

  return (
              <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-border shadow-xl animation-fade-in animation-delay-200">
              {/* Slides */}
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {homeBannerSlider.map((item, index) => (
                  <div
                    key={index}
                    className="relative min-w-full h-[500px] bg-gradient-to-br from-primary-light to-card"
                  >
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 via-black/30 to-transparent z-10" />

                    {/* Image */}
                    <img
                      src={item.productDetail.image}
                      alt={item.productDetail.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Product Info */}
                    <div className="absolute bottom-4 left-6 z-20 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl animate-bounce ">
                      <p className="text-sm text-white/80">
                        {item.productDetail.productType}
                      </p>

                      <h3 className="text-xl font-bold text-white mt-1">
                        {item.productDetail.name}
                      </h3>

                      <p className="text-md font-semibold text-[var--color-foreground mt-1">
                        Rs. {Number(item.productDetail.price).toLocaleString()}
                      </p>

                      <Button className="mt-1" size="sm" variant="accent">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="absolute bottom-8 right-8 flex gap-3 z-20">
                <ButtonRounded type="button"
                  icon={FaChevronLeft}
                  variant="secondary"
                  onClick={previous}
                />

                <ButtonRounded type="button"
                  icon={FaChevronRight}
                  variant="secondary"
                  onClick={next}
                />
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-6">
              {homeBannerSlider.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === index
                      ? "w-10 h-2 bg-primary"
                      : "w-2 h-2 bg-border hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
  )
}

export default HomeSlider