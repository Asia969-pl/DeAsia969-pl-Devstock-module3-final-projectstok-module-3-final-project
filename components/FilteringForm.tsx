"use client";

import { useState, useContext } from "react";
import { GlobalContext } from "../components/context/GlobalContext";
import DownArrowIcon from "./DownArrowIcon";
import PlusIcon from "./PlusIcon";

export default function FilteringForm() {
  const context = useContext(GlobalContext);
  if (!context) return null;

  const { filters, setFilters, categories: globalCategories } = context;

  const [showCategories, setShowCategories] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showPrice, setShowPrice] = useState(true);

  // ALL = brak kategorii w filtrach
  const isAllSelected = filters.categories.length === 0;

  const toggleCategory = (category: string) => {
    setFilters((prev) => {
      // ALL → reset
      if (category === "All") {
        return { ...prev, categories: [] };
      }

      const exists = prev.categories.includes(category);
      const nextCategories = exists
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];

      return {
        ...prev,
        categories: nextCategories,
      };
    });
  };

  return (
    <div className="flex flex-col p-10   bg-white dark:bg-black gap-13">
      {/* CATEGORY */}
      <div>
        <button
          onClick={() => setShowCategories((p) => !p)}
          className=" flex  items-center justify-between  w-[263px] font-medium"
        >
          <span className="text-[20px] text-[black] dark:text-[#FCFCFC]">
            Category
          </span>
          <DownArrowIcon />
        </button>

        {showCategories && (
          <div className=" flex flex-col gap-5 mt-4">
            {/* ALL */}
            <label className="flex gap-2 items-center text-[16px] text-[black] dark:text-[#FCFCFC] ">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={() => toggleCategory("All")}
                className=" w-[26px] h-[26px] rounded-[6px] p-[3px] accent-orange-500 "
              />
              All
            </label>

            {/* CATEGORIES */}
            {globalCategories
              .filter((c: any) => c.name !== "Others")
              .map((cat: any) => (
                <label
                  key={cat.id}
                  className="flex gap-2 items-center text-[16px] text-[black] dark:text-[#FCFCFC] "
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.name)}
                    onChange={() => toggleCategory(cat.name)}
                    className=" w-[26px] h-[26px] rounded-[6px] p-[3px] accent-orange-500 "
                  />
                  {cat.name}
                </label>
              ))}

            {/* LOAD MORE */}
            <button
              type="button"
              onClick={() => setShowMore((p) => !p)}
              className="flex w-[263px] items-center gap-[14px] font-medium"
            >
              <span className="text-[16px] text-[black] dark:text-[#FCFCFC]">
                Load More
              </span>
              <PlusIcon />
            </button>

            {showMore && (
              <label className="flex gap-2 items-center mt-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes("Others")}
                  onChange={() => toggleCategory("Others")}
                  className=" w-[26px] h-[26px] rounded-[6px] p-[3px] accent-orange-500 "
                />
                Others
              </label>
            )}
          </div>
        )}
      </div>

      {/* PRICE */}
      <div>
        <button
          onClick={() => setShowPrice((p) => !p)}
          className="flex w-full items-center justify-between  font-semibold"
        >
          <span className="text-[20px] text-[black] dark:text-[#FCFCFC]">
            Price
          </span>
          <DownArrowIcon />
        </button>

        {showPrice && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="mt-4 flex text-[#FCFCFC] bg-[rgb(38,38,38)] px-[18px] py-[14px] rounded-6 w-[263px] border border-[#616674]">
              <input
                type="text"
                placeholder="$10.00"
                value={filters.price.min}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    price: { ...prev.price, min: e.target.value },
                  }))
                }
                className="border border-r-[#616674] border-t-0 border-t-0 border-l-0 border-b-0 w-[157px]"
              /> 
              <select>
                <option>USD</option>
              </select>
            </div>
            <div className="mt-4 flex text-[#FCFCFC] bg-[rgb(38,38,38)] px-[18px] py-[14px] rounded-6 w-[263px] border border-[#616674] ">
              <input
                type="text"
                placeholder="$Max"
                value={filters.price.max}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    price: { ...prev.price, max: e.target.value },
                  }))
                }
                 className="border border-r-[#616674] border-t-0 border-t-0 border-l-0 border-b-0 w-[157px]"
              />
              <select>
                <option>USD</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
