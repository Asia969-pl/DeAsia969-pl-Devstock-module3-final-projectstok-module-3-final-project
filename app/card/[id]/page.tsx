"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import BasketCard from "@/components/BasketCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlobalContext } from "@/components/context/GlobalContext";
import Breadcrumb from "@/components/Breadcrumb";
import Divider from "@/components/Divider";
import Link from "next/link";

export default function CardPage() {
  const router = useRouter();
  const context = useContext(GlobalContext);
  if (!context) throw new Error("GlobalContext must be used within GlobalContextProvider");

  const {
    cart,
    removeFromCart,
    updateQuantity,
    selectedCartIds,
    toggleSelectCartItem,
    selectedCartItems,
  } = context;

  // 🔹 liczymy tylko zaznaczone produkty
  const totalQuantity = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = selectedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const selectAll = () => {
    if (selectedCartIds.length === cart.length) {
      cart.forEach(item => toggleSelectCartItem(item.cardItemId));
    } else {
      cart.forEach(item => {
        if (!selectedCartIds.includes(item.cardItemId)) toggleSelectCartItem(item.cardItemId);
      });
    }
  };

  const goToCheckout = () => {
    if (selectedCartItems.length === 0) return;
    router.push("/checkout");
  };

  if (cart.length === 0)
    return (
      <div>
        <Header />
        <div className="flex flex-col h-[50vh] bg-white dark:bg-black items-center justify-center">
          <h1>Basket is empty.</h1>
          <Link href="/">
            <p>Go shopping</p>
          </Link>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="bg-white dark:bg-black">
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 py-10 lg:px-10 flex flex-col lg:flex-row gap-8 w-full">
        {/* LEFT - produkty */}
        <div className="flex flex-col flex-1 gap-8">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedCartIds.length === cart.length && cart.length > 0}
              onChange={selectAll}
              className="w-[26px] h-[26px] rounded-[6px] border border-black dark:border-[#616674] accent-[#F29145] bg-black"
            />
            <span className="font-medium text-black dark:text-[#FCFCFC]">Select All</span>
          </div>

          {cart.map(item => (
            <div key={item.cardItemId} className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedCartIds.includes(item.cardItemId)}
                onChange={() => toggleSelectCartItem(item.cardItemId)}
                className="w-[26px] h-[26px] rounded-[6px] border border-black dark:border-[#616674] accent-[#F29145] bg-black"
              />
              <BasketCard
                product={item.product}
                quantity={item.quantity}
                onQuantityChange={q => updateQuantity(item.cardItemId, q)}
                onClick={() => removeFromCart(item.cardItemId)}
              />
            </div>
          ))}
        </div>

        {/* RIGHT - podsumowanie */}
        <div className="w-full lg:w-[423px] h-fit border border-black dark:border-[#383B42] rounded-[6px] p-6 flex flex-col gap-8 bg-gray-200 dark:bg-[#262626]">
          <div className="text-[16px] font-medium text-black dark:text-[#FCFCFC] gap-8">
            <h1 className="text-[18px] mb-4">Subtotal</h1>
            <div className="flex justify-between">
              <span>Total product Price ({totalQuantity} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Divider />
            <div className="flex mt-4 justify-between">
              <h1 className="text-[18px] mt-3">Total</h1>
              <h1 className="text-[28px]">${total.toFixed(2)}</h1>
            </div>
          </div>

          <button
            onClick={goToCheckout}
            className={`px-4 py-2 bg-[#F29145] text-black rounded-[6px] text-center ${
              selectedCartItems.length === 0 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Checkout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
