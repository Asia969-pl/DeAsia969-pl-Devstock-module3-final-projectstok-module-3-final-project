"use client";

import { useContext } from "react";
import { GlobalContext } from "../..//components/context/GlobalContext";
import ProductList from "@/components/ProductList";
import FilteRingForm from "@/components/FilteringForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Product() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("GlobalContext must be used within GlobalContextProvider");
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <Header />

      <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row border border-t-orange-500 dark:border-t-[#383B42] border-l-0 border-r-0 border-b-0 mb-10">
          <FilteRingForm />
          <ProductList />
        </div>
      </div>

      <Footer />
    </div>
  );
}
