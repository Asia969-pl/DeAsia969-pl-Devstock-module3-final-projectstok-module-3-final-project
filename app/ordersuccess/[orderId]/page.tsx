"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CheckCircle from "@/components/CheckCircle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const cookieUser = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="));

        const userId = cookieUser
          ? JSON.parse(decodeURIComponent(cookieUser.split("=")[1])).id
          : null;

        if (!userId) return setLoading(false);

        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const orderId = pathParts.pop();
        if (!orderId) return setLoading(false);

        const res = await fetch(`/api/orders/${userId}/${orderId}`);
        const data = await res.json();
        if (!res.ok) return setLoading(false);

        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const productTotal = useMemo(() => {
    if (!order?.items) return 0;
    return order.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
  }, [order]);

  const protectionTotal = useMemo(() => {
    if (!order?.items) return 0;
    return order.items.reduce(
      (sum: number, item: any) => sum + (item.protectionFee || 0),
      0
    );
  }, [order]);

  const shippingCost = order?.shippingCost ?? 0;
  const serviceFee = order?.serviceFee ?? 0;
  const grandTotal = productTotal + protectionTotal + shippingCost + serviceFee;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading)
    return <div className="flex justify-center items-center h-screen">Loading…</div>;
  if (!order)
    return <div className="flex justify-center items-center h-screen">No order found</div>;

  return (
    <div className="bg-white dark:bg-black">
      <Header />

      <div className="flex justify-center py-6 sm:py-10 px-3 sm:px-6 text-black dark:text-white">
        <div className="w-full max-w-[640px] bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#383B42] rounded-[6px] p-4 sm:p-6 flex flex-col gap-6">

          <div className="flex flex-col items-center gap-2">
            <CheckCircle />
            <h1 className="text-[22px] sm:text-[28px] font-medium mt-4 sm:mt-6 text-center">
              Thanks for Your Order!
            </h1>
            <p className="text-[14px] sm:text-[16px] font-medium mt-2 sm:mt-6 break-all text-center">
              INV/208421205/TSR/3385-B{order.id}
            </p>
          </div>

          {[["Transaction Date", formatDate(order.createdAt)], ["Payment Method", "Apple Pay"], ["Shipping Method", "NexusHub Courier"]].map(([title, value]) => (
            <div key={title}>
              <p className="text-[14px] sm:text-[16px]">{title}</p>
              <p className="mt-2 sm:mt-6 mb-3 sm:mb-6 text-[14px] sm:text-[16px] break-words">
                {value}
              </p>
              <div className="h-px w-full bg-gray-200 dark:bg-[#383B42]" />
            </div>
          ))}

          <p className="font-medium text-[16px] sm:text-[18px]">Your Order</p>

          <div className="flex flex-col gap-3">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="relative flex justify-between items-center bg-white dark:bg-[#2b2b2b] border border-black dark:border-[#383B42] rounded-[6px] p-3 sm:p-0"
              >
                <div className="flex gap-3 sm:gap-4 items-center p-3 sm:p-6">
                  <div className="w-[120px] h-[96px] sm:w-[172px] sm:h-[138px] bg-gray-100 dark:bg-[#262626] rounded-[6px] flex items-center justify-center border border-gray-300 dark:border-[#383b42]">
                    <Image
                      src={item.product.imageUrl || "/placeholder.png"}
                      alt={item.product.name}
                      width={148}
                      height={116}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:gap-4">
                    <p className="text-[16px] sm:text-[20px] font-medium break-words max-w-[160px] sm:max-w-none">
                      {item.product.name}
                    </p>
                    {item.product.category?.name && (
                      <span className="inline-block w-fit text-[12px] sm:text-[14px] px-2 sm:px-[10px] py-1 sm:py-[10px] rounded-[6px] bg-[#E5610A] text-[#FDEDD7]">
                        {item.product.category.name}
                      </span>
                    )}
                    <p className="text-[20px] sm:text-[26px] font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 text-[14px] sm:text-[16px]">
                  x{item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[14px] sm:text-[16px] space-y-3">
            <div className="flex justify-between"><span>Total Product Price</span><span>${productTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Total Product Protection</span><span>${protectionTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Total Shipping Price</span><span>${shippingCost.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Service Fees</span><span>${serviceFee.toFixed(2)}</span></div>
            <div className="h-px w-full bg-gray-200 dark:bg-[#383B42]" />
            <div className="flex justify-between font-medium text-[18px] sm:text-[20px]">
              <span>Grand total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[14px] sm:text-[18px]">
            <span>Status</span>
            <span className="px-2 sm:px-[6px] py-1 sm:py-[10px] rounded bg-[#295B40] text-[#DFFCE8] text-[12px] sm:text-[14px]">
              Success
            </span>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 sm:py-[14px] bg-[#F29145] text-black font-medium rounded-[6px]"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
