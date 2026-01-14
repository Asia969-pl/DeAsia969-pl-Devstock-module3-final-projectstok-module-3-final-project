"use client"

import {  useContext } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CategoryCarousel from "@/components/CategoryCorousel";
import {GlobalContext} from "../components/context/GlobalContext"
// Funkcja do renderowania kategorii
import CategoryContainer from "@/components/CategoryContainer";
import BrandContainer from "@/components/BrandContainer";
import RecomendationContainer from "@/components/RecomendationContainer";


// key={category.id} >{category.categoryImage}
export default function Home() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("GlobalContext must be used within GlobalContextProvider");
  }

  const { categories, brands, recomended } = context;

  
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-black pt-30 pb-30 gap-8">
        <CategoryCarousel categories={categories} />
        <CategoryContainer categories={categories}/>
        <RecomendationContainer recomended={recomended}/>
        <BrandContainer brands={brands}/>
      </div>
      <Footer />
    </div>
  );
}
