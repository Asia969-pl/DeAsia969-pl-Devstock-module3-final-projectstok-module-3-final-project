"use client";

import BasketCard from "./BasketCard";

interface CheckoutCardProps {
  product: any;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
  protection?: boolean;
  onProtectionChange: (checked: boolean) => void;
}

export default function CheckoutCard({
  product,
  quantity,
  onQuantityChange,
  onRemove,
  protection = false,
  onProtectionChange,
}: CheckoutCardProps) {
  return (
    <div className="bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#383B42] rounded-lg overflow-hidden ">
      <div className="">
        <BasketCard
          product={product}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          onClick={onRemove}
        />
      </div>
      <div className="flex items-center justify-between p-6">
        <label className="flex items-start gap-4 ">
          <input
            type="checkbox"
            checked={protection}
            onChange={(e) => onProtectionChange(e.target.checked)} 
            className="p-[3px] w-[26px] h-[26px] rounded-[6px] accent-[#F29145]"
          />

          <div className="flex flex-col ">
            <span className="text-black dark:text-[#FCFCFC] text-[16px] font-medium">
              Product Protection
            </span>
            <span className="text-[14px] text-black dark:text-[#e7e7E7]">
              The claim process is easy and instant, valid for 6 months
            </span>
          </div>
        </label>

        <span className="text-black dark:text-[#FCFCFC] text-[18px] font-medium">
          $1
        </span>
      </div>
    </div>
  );
}
