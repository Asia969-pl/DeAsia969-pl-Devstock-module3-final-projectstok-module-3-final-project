"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import DarkBasketIcon from "./DarkBasketIcon";
import { useContext } from "react";
import { GlobalContext } from "./context/GlobalContext";
import { useSnackbar } from "notistack";


export default function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const context = useContext(GlobalContext);
  const { enqueueSnackbar } = useSnackbar(); // <-- tutaj
  if (!context) {
    throw new Error("GlobalContext must be used within GlobalContextProvider");
  }
  
  


  const { addToCart } = context;



  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative flex flex-col w-75 h-[386px] px-[16px] py-[20px] gap-[18px] 
                 bg-gray-200 dark:bg-[#262626] border rounded-[6px] border-[#383B42] cursor-pointer"
    >
      {/* IMAGE */}
      <div className="w-full h-[204px] flex justify-center items-center">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={268}
          height={204}
          className="object-contain"
        />
      </div>

      {/* TEXT */}
      <div className="flex flex-col gap-4">
        <p className="bg-[#E5610A] text-[14px] text-center font-medium w-[99px] h-[36px] rounded-[6px] px-[10px] py-[6px]">
          {product.category?.name}
        </p>
        <p className="font-medium text-base text-black dark:text-[#FCFCFC] ">
          {product.name}
        </p>
        <p className="font-medium text-[28px]  text-black dark:text-[#FCFCFC] ">${product.price}</p>
      </div>

      {/* ADD TO CART */}
      <button
        type="button"
        className="absolute top-8 left-8 z-10"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product);
          enqueueSnackbar(`Product Succesfully Added`, {
            variant: "success",
            style: { width: '95vw', textAlign: 'center' } 
          });
          console.log("Product Succesfully Added ");
          
        }}
      >
        <DarkBasketIcon />
      </button>
    </div>
  );
}
