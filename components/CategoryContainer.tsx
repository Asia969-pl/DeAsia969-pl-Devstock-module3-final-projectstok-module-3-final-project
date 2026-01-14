"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "./context/GlobalContext";

export default function CategoryContainer({ categories }: { categories: any[] }) {
  const router = useRouter();
  const context = useContext(GlobalContext);

  if (!categories?.length || !context) return null;

  const { setFilters } = context;

  const handleCategoryClick = (categoryName: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: [categoryName],
    }));

    router.push("/product");
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col gap-8">
      <h1 className="font-medium text-[28px] text-black dark:text-[#FCFCFC]">
        Category
      </h1>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
          gap-6
        "
      >
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className="
              w-full
              max-w-[220px]
              h-[190px]
              flex
              flex-col
              gap-6
              p-3
              dark:bg-[#262626]
              items-center
              border
              border-[#616674]
              rounded-[6px]
              mx-auto
              cursor-pointer
              transition
              hover:scale-105
              hover:shadow-md
            "
          >
            <Image
              width={80}
              height={80}
              src={category.categoryImage}
              alt={category.name}
            />

            <span className="font-medium text-[22px] md:text-[24px] text-black dark:text-[#FCFCFC] text-center">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
