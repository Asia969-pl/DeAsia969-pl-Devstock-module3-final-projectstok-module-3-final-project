"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import left from "../icons/carouselLeftButton.svg";
import right from "../icons/carouselRightButton.svg";
import RightOrangeArrowIcon from "./RightOrangeArrowIcon";
import { GlobalContext } from "./context/GlobalContext";

type Category = {
  id: string | number;
  name: string;
  categoryInfo: string;
  categoryCarouselImage: string;
};

export default function CategoryCarousel({
  categories,
}: {
  categories: Category[];
}) {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const context = useContext(GlobalContext);

  if (!categories?.length || !context) return null;

  const { setFilters } = context;

  /* NAVIGATION */
  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  /* HANDLE EXPLORE CATEGORY */
  const handleExploreCategory = (categoryName: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: [categoryName],
    }));
    router.push("/product");
  };

  return (
    <div className="w-full max-w-[1820px] px-6 mx-auto flex flex-col gap-6">
      {/* SLIDER */}
      <div className="relative overflow-hidden text-black dark:text-[#FCFCFC] bg-gray-300 dark:bg-[#262626] h-[600px] md:h-[452px] border border-[#383B42] rounded-[6px] py-[80px] px-8 md:px-10 lg:px-16 xl:px-16 2xl:px-16">
        {/* LEFT BUTTON */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20"
        >
          <Image src={left} alt="Previous" width={44} height={74} />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
        >
          <Image src={right} alt="Next" width={44} height={74} />
        </button>

        {/* SLIDES */}
        {categories.map((category, idx) => (
          <div
            key={category.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              idx === current
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="mx-auto h-full md:px-[120px] px-14 grid md:grid-cols-2 items-center justify-between gap-12">
              {/* TEXT */}
              <div className="flex flex-col gap-10 max-w-[433px]">
                <h1 className="text-[32px] font-medium text-black dark:text-[#FCFCFC]">
                  {category.name}
                </h1>
                <p className="text-black dark:text-[#E7E7E7] font-normal">
                  {category.categoryInfo}
                </p>
                <button
                  className="w-[211px] h-[54px] flex items-center gap-4 font-medium text-[16px] text-[#F29145] border border-[#F29145] px-[20px] py-[15px] rounded-[6px]"
                  onClick={() => handleExploreCategory(category.name)}
                >
                  <span>Explore Category</span>
                  <RightOrangeArrowIcon />
                </button>
              </div>

              <div className="relative w-full h-full overflow-visible pointer-events-none">
                <div className="absolute right-[-80px] top-1/2 -translate-y-1/2">
                  <Image
                    src={category.categoryCarouselImage}
                    alt={category.name}
                    width={443}
                    height={853}
                    className="object-contain rotate-[325.42deg] transition-transform duration-500 drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-4">
        {categories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-[12px] h-[12px] rounded-full transition-colors ${
              idx === current ? "bg-[#F29145]" : "bg-[#383B42]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
