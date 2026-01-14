"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import TrashIcon from "./TrashIcon";

type Product = {
  id: number;
  name: string;
  imageUrl?: string | null;
  price: number;
  stock: number;
  category?: { name: string };
};

type BasketCardProps = {
  product: Product;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onClick: () => void;
};

export default function BasketCard({
  product,
  quantity,
  onQuantityChange,
  onClick,
}: BasketCardProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const increase = () => {
    if (localQuantity < product.stock) {
      const newQuantity = localQuantity + 1;
      setLocalQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const decrease = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  if (!product) return null;

  return (
    <div className="relative bg-gray-400 dark:bg-[#262626] flex flex-col sm:flex-row gap-4 sm:gap-6 border border-black dark:border-[#383B42] p-6 rounded-[6px] w-full">
      <div className="border border-black dark:border-[#383B42] h-[138px] w-[172px] p-2 flex items-center justify-center shrink-0 rounded-[6px]">
        <Image
          src={product.imageUrl ?? "/placeholder.png"}
          alt={product.name}
          width={148}
          height={114}
          className="object-contain rounded"
        />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <p className="text-[20px] font-medium">{product.name}</p>
        {product.category?.name && (
          <span className="w-fit px-[10px] py-[6px] h-[36px] text-[14px] bg-[#E5610A] text-[#FDEDD7] rounded-[6px] flex items-center">
            {product.category.name}
          </span>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-[24px] font-medium">${product.price.toFixed(2)}</span>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 absolute right-4 bottom-4 sm:right-6 sm:bottom-6">
            <div className="text-[#F29145] font-medium text-[16px] sm:text-[16px] pr-2 pt-2 border border-t-0 border-l-0 border-b-0 border-[#848A97]">
              Write note
            </div>
            <div className="flex items-center gap-2 sm:gap-3 border border-[#FCFCFC] rounded-[6px]">
              <button
                className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] text-[18px] sm:text-[20px] flex items-center justify-center"
                onClick={decrease}
              >
                −
              </button>
              <span className="min-w-[24px] text-center text-[16px] sm:text-[18px]">
                {localQuantity}
              </span>
              <button
                className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] text-[18px] sm:text-[20px] flex items-center justify-center"
                onClick={increase}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 sm:static sm:self-start">
        <TrashIcon onClick={onClick} />
      </div>
    </div>
  );
}
