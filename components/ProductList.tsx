"use client";

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../components/context/GlobalContext";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const context = useContext(GlobalContext);
  if (!context) return null;

  const {
    productsByCategory,
    fetchProductsByCategory,
    filters,
    categories: allCategories,
  } = context;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [sort, setSort] = useState("newest");
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!allCategories.length) return;

      setLoading(true);

      const categoriesForFetch =
        filters.categories.length === 0
          ? allCategories.map((c) => c.name)
          : filters.categories;

      const meta = await fetchProductsByCategory(
        limit,
        page,
        sort,
        categoriesForFetch,
        filters.price
      );

      setTotalPages(meta?.totalPages ?? 10);
      setLoading(false);
    };

    fetchData();
  }, [
    page,
    limit,
    sort,
    filters.categories,
    filters.price,
    allCategories,
    fetchProductsByCategory,
  ]);

  const hasProducts =
    Array.isArray(productsByCategory) && productsByCategory.length > 0;

  const renderPages = () => {
    const pages: (number | string)[] = [];
    const firstPages = [1, 2, 3];
    const middlePages = [4, 5, 6];

    firstPages.forEach((num) => {
      if (num <= totalPages) pages.push(num);
    });

    if (totalPages > 6) pages.push("dots");

    middlePages.forEach((num) => {
      if (num <= totalPages) pages.push(num);
    });

    return pages;
  };

  return (
    <div className="w-full mx-auto px-10 py-6 bg-white dark:bg-black text-black dark:text-[#FCFCFC]">
      {/* CONTROLS */}
      <div className="flex gap-10 mb-6 flex-wrap items-center">
        <label className="flex gap-4 text-[18px] font-bold">
          Sort by:
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="
              border border-black dark:border-[#616674]
              bg-white dark:bg-black
              text-black dark:text-[#FCFCFC]
              w-[180px] h-[44px] rounded-md px-2
              focus:outline-none focus:ring-2 focus:ring-orange-500
            "
          >
            <option value="newest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="priceAsc">Cheapest</option>
            <option value="priceDesc">Most Expensive</option>
          </select>
        </label>

        <label className="flex gap-4 text-[18px] font-bold">
          Show
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="
              border border-black dark:border-[#616674]
              bg-white dark:bg-black
              text-black dark:text-[#FCFCFC]
              w-[140px] h-[44px] rounded-md px-2
              focus:outline-none focus:ring-2 focus:ring-orange-500
            "
          >
            <option value={5}>5</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <p className="text-center text-black dark:text-gray-400">
          Loading products...
        </p>
      ) : !hasProducts ? (
        <p className="text-center text-black dark:text-[#FCFCFC]">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[48px]">
          {productsByCategory.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-12 gap-4 sm:gap-0">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {renderPages().map((item, index) =>
              item === "dots" ? (
                <div
                  key={`dots-${index}`}
                  className="px-2 text-black dark:text-[#FCFCFC] flex items-center"
                >
                  …
                </div>
              ) : (
                <div key={item}>
                  <button
                    onClick={() => setPage(Number(item))}
                    className={`px-3 py-1 ${
                      page === item
                        ? "bg-orange-500 text-black rounded-[6px] p-3 w-[44px] h-[44px]"
                        : "bg-white dark:bg-black text-black dark:text-[#B0B0B0] hover:bg-gray-100 dark:hover:bg-neutral-800 p-3 w-[44px] h-[44px]"
                    }`}
                  >
                    {item}
                  </button>
                </div>
              )
            )}
          </div>

          <div className="flex gap-4 sm:gap-8 mt-2 sm:mt-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2 rounded-[6px] border bg-white dark:bg-black text-black dark:text-[#FCFCFC] border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-40 flex items-center gap-2"
            >
              ← Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-5 py-2 rounded-[6px] border bg-white dark:bg-black text-black dark:text-[#FCFCFC] border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-40 flex items-center gap-2"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
