"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import RightOrangeArrowIcon from "./RightOrangeArrowIcon";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "./context/GlobalContext";




export default function BrandContainer({ brands }) {
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const router = useRouter();
  const context = useContext(GlobalContext);

  if (!context) return null;

  const { setFilters } = context;



  const containerRef = useRef(null);

  const maxCardWidth = 220;
  const gap = 32;
  const safeBrands = brands || [];
  const totalWidth = safeBrands.length * (maxCardWidth + gap) - gap;
  const maxTranslateX = Math.max(totalWidth - containerWidth, 0);
  const isAtEnd = translateX >= maxTranslateX;

  const handleScroll = () => {
    if (!isAtEnd) {
      const visibleCards = Math.floor(containerWidth / (maxCardWidth + gap)) || 1;
      const moveBy = visibleCards * (maxCardWidth + gap);
      setTranslateX((prev) => Math.min(prev + moveBy, maxTranslateX));
    } else {
      setTranslateX(0);
    }
  };

  const handleBrandClick = (brandName: string) => {
    setFilters(prev => ({
      ...prev,
      categories: [],       
      brands: [brandName],  
    }));

    router.push("/product");
  };




  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);







  return (
    <div className="w-full px-4 md:px-10">
      {/* Nagłówek */}
      <div className="max-w-[1360px] mx-auto flex justify-between items-center mb-4">
        <h2 className="text-[28px] font-medium">Brands</h2>
        <button
          onClick={handleScroll}
          className="flex gap-[14px] w-[120px] h-[26px]"
        >
          <span className="text-[#F29145] font-medium">
            {isAtEnd ? "See Less" : "See More"}
          </span>
          <RightOrangeArrowIcon />
        </button>
      </div>

      {/* Slider */}
      <div
        ref={containerRef}
        className="relative max-w-[1360px] mx-auto overflow-hidden"
      >
        <div
          className="flex gap-8 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${translateX}px)` }}
        >
          {safeBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.name)}
              className="shrink-0 w-[220px] h-[190px] bg-gray-200 dark:bg-[#262626] flex flex-col items-center justify-center gap-7 p-4 rounded-lg border border-[#616674]"
            >
              <div className="w-[60px] h-[30px] flex items-center justify-center">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <p className="bark:text-[#FCFCFC] font-medium">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
