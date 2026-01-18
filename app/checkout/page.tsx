"use client";

import { useContext, useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutCard from "@/components/CheckoutCard";
import AddressSelector from "@/components/AddressSelector";
import { GlobalContext } from "@/components/context/GlobalContext";
import ShieldIcon from "@/components/ShieldIcon";
import Image from "next/image";

export default function CheckoutPage() {
  const ctx = useContext(GlobalContext);
  if (!ctx) return <p>Ładowanie...</p>;

  const {
    cart,
    selectedCartItems,
    updateQuantity,
    removeFromCart,
    protectionFeeIds,
    toggleProtectionFee,
    shippingCost,
    serviceFee,
    addresses,
    setAddresses,
    selectedAddressId,
    setSelectedAddressId,
    handlePayNow,
    shippingInsurance,
  } = ctx;

  const insuranceFee = 5;
  const [totalProtection, setTotalProtection] = useState(false);

  useEffect(() => {
    cart.forEach((item) => {
      const has = protectionFeeIds.includes(item.cardItemId);
      if (totalProtection && !has) toggleProtectionFee(item.cardItemId);
      if (!totalProtection && has) toggleProtectionFee(item.cardItemId);
    });
  }, [totalProtection]);

  const productsTotal = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const protectionTotal = selectedCartItems.reduce(
    (sum, item) =>
      sum + (protectionFeeIds.includes(item.cardItemId) ? insuranceFee : 0),
    0
  );

  const total =
    productsTotal +
    protectionTotal +
    shippingCost +
    serviceFee +
    shippingInsurance;

  const handleAddAddress = async (data: any) => {
    try {
      const cookieUser = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="));
      const userId = cookieUser
        ? JSON.parse(decodeURIComponent(cookieUser.split("=")[1])).id
        : null;

      if (!userId) return;

      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });

      const created = await res.json();
      if (!res.ok) return;

      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: false })).concat(created)
      );
      setSelectedAddressId(created.id);
    } catch (err) {
      console.error("Error while adding address:", err);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <h2>Checkout is empty</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black dark:bg-black dark:text-[#FCFCFC]">
      <Header />

      <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-10">
            <div>
              <h1 className="text-[24px] font-medium mb-6">Your Order</h1>
              <div className="flex flex-col gap-8">
                {selectedCartItems.map((item) => (
                  <CheckoutCard
                    key={item.cardItemId}
                    product={item.product}
                    quantity={item.quantity}
                    onQuantityChange={(q) => updateQuantity(item.cardItemId, q)}
                    onRemove={() => removeFromCart(item.cardItemId)}
                    protection={protectionFeeIds.includes(item.cardItemId)}
                    onProtectionChange={() =>
                      toggleProtectionFee(item.cardItemId)
                    }
                  />
                ))}
              </div>
            </div>

           
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Address</h2>
              <div className="bg-white border border-gray-200 dark:bg-[#262626] dark:border-[#383B42] rounded-xl p-6">
                <AddressSelector
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                  onAddAddress={handleAddAddress}
                />
              </div>
            </div>
            <h2 className="text-[24px] font-medium">Shipping Method</h2>
            <div className="flex gap-4 bg-white border border-gray-200 dark:bg-[#262626] dark:border-[#383B42] rounded-[6px] p-6 ">
              <ShieldIcon />
              <p className="text-[16px] font-medium">NexusHub Courier </p>
            </div>

            {/* PAYMENT */}
            <h2 className="text-[24px] font-medium">Payment Method</h2>

            <div className="flex gap-4 items-center bg-white border border-gray-200 dark:bg-[#262626] dark:border-[#383B42] rounded-[6px] p-6 ">
              <div className="bg-white rounded-[6px] p-1">
                <Image
                  src="https://i.ibb.co/DDcgLkFh/Pay.png"
                  alt="Apple Pay"
                  width={40}
                  height={34}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">Apple Pay</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[423px] h-fit bg-white border border-gray-200 dark:bg-[#262626] dark:border-[#383B42] rounded-[6px] p-6 text-black dark:text-[#FCFCFC]">
            <h2 className="text-[18px] font-medium">Total Product</h2>

            <div className="flex justify-between mt-4 text-[16px] font-medium text-black dark:text-[#E7E7E7]">
              <span>Total Product Price</span>
              <span className="text-[18]">${productsTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mt-4 text-[16px] font-medium text-black dark:text-[#E7E7E7]">
              <span>Total Product Protection</span>
              <span className="text-[18]">${protectionTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mt-4 text-[16px] font-medium text-black dark:text-[#E7E7E7]">
              <span>Total Shipping Price</span>
              <span className="text-[18]">${shippingCost.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mt-4 text-[16px] font-medium text-black dark:text-[#E7E7E7]">
              <span className="mb-4"> Shipping insurance</span>
              <span className="text-[18px]">
                ${shippingInsurance.toFixed(2)}
              </span>
            </div>
            <div className="h-[1px] w-full bg-black dark:bg-[#383B42]"></div>
            <div className="mt-4">
              <span className="text-[18px] ">Transaction Fees</span>
            </div>

            <div className="flex justify-between mt-4 text-[16px] font-medium text-black dark:text-[#E7E7E7]">
              <span className="mb-4">Service Fees</span>
              <span className="text-[18]">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="h-[1px] w-full bg-black dark:bg-[#383B42]"></div>

            <div className="flex justify-between items-center text-[16px] font-medium mt-4">
              <span className="text-[18px]">Grand Total</span>
              <span className="text-[28px]">${total.toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                handlePayNow();
              }}
              disabled={!selectedAddressId}
              className="w-full mt-4 py-[14px] rounded-[6px] bg-[#F29145] hover:bg-orange-600 text-black font-medium"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
