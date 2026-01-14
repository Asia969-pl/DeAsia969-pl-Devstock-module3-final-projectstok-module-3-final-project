"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import RightOrangeArrowIcon from "./RightOrangeArrowIcon";

export default function RecomendationContainer({ recomended }) {
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef(null);
  const maxCardWidth = 300;
  const gap = 32;
  const safeRecomended = recomended || [];

  const totalWidth = safeRecomended.length * (maxCardWidth + gap) - gap;

  const maxTranslateX = Math.max(totalWidth - containerWidth, 0);
  const isAtEnd = translateX >= maxTranslateX;

  const handleScroll = () => {
    if (!isAtEnd) {
      const visibleCards = Math.floor(containerWidth / (maxCardWidth + gap)) || 1; // zawsze przynajmniej 1 karta
      const moveBy = visibleCards * (maxCardWidth + gap);
      const remaining = maxTranslateX - translateX;
      setTranslateX((prev) => Math.min(prev + moveBy, maxTranslateX));
    } else {
      setTranslateX(0);
    }
  };

  // ResizeObserver do responsywności
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
        <h2 className="text-[28px] font-medium">Recomendations</h2>
        <button
          onClick={handleScroll}
          className="flex gap-[14px] w-[120px] h-[26px]"
        >
          <span className="text-[#F29145] font-semibold">
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
          {safeRecomended.map((recomend) => (
            <div key={recomend.id} className="flex-shrink-0 w-[300px]">
              <ProductCard product={recomend} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
