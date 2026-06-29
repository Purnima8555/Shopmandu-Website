import {
  IoIosArrowRoundForward,
  IoIosArrowRoundUp} from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";

import { FiSearch, FiChevronRight } from "react-icons/fi";

import ButtonRounded from "../../components/ui/ButtonRounded";
import { categoryCards, sidebarCategories } from "./data";
import Button from "../../components/ui/Button";


const ExploreByCategory = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="mb-14 text-center text-4xl font-bold text-foreground">
          Explore by Category
        </h2>

        {/* Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_70px_1fr]">
          {/*  Left  */}
          <div className="flex flex-col">
            {/* Search */}
            <div className="relative mb-8">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-xl bg-muted-foreground/18  py-3 pl-12 pr-4 outline-none"
              />
            </div>

            {/* Categories */}
            <ul className="flex-1 space-y-1">
              {sidebarCategories.map((item) => (
                <li
                  key={item}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition hover:bg-primary-light"
                >
                  <span>{item}</span>
                  <FiChevronRight />
                </li>
              ))}
            </ul>

            {/* Button */}
            <Button className="cursor-pointer" icon={IoIosArrowRoundForward} iconPosition="right" size="lg" iconsize={26} > All Categories</Button>
          </div>

          {/*  Center  */}
          <div className="hidden lg:flex flex-col items-center mt-18">
            <div className="flex-1 w-0.5 rounded-full bg-primary" />

            <ButtonRounded
              icon={IoIosArrowRoundUp}
              className="mt-0 mb-2 text-primary font-bold"
              variant="secondary"
            />

            <ButtonRounded icon={IoIosArrowRoundDown}  variant="secondary" className="my-4" />
          </div>

          {/*  Right  */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {categoryCards.map((item) => (
              <CategoryCard key={item} title={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function CategoryCard({ title }) {
  return (
    <div className="group relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-primary-light transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <h3 className="relative z-10 text-3xl font-serif text-foreground">
        {title}
      </h3>
    </div>
  );
}

export default ExploreByCategory;