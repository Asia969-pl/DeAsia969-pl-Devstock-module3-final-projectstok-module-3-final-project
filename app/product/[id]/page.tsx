"use client";

import { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ShieldIcon from "@/components/ShieldIcon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlobalContext } from "@/components/context/GlobalContext";
import OrangeBasketIcon from "@/components/OrangeBasketIcon";
import { useUser } from "@/components/context/UserContext";
import Breadcrumb from "@/components/Breadcrumb";

export default function ProductDetails() {
  const context = useContext(GlobalContext);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useUser();

  if (!context) {
    throw new Error("GlobalContext must be used within GlobalContextProvider");
  }

  const { getProductById, productById, addToCart } = context;

  const params = useParams<{ id: string }>();
  const productId = params?.id ? Number(params.id) : null;

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<"white" | "black">("white");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    if (productId) getProductById(productId);
  }, [getProductById, productId]);

  useEffect(() => {
    if (productById?.imageUrl) setActiveImage(productById.imageUrl);
  }, [productById]);

  useEffect(() => {
    const generateRandomDeliveryDate = () => {
      const now = new Date();
      const start = new Date(now);
      const end = new Date(now);
      end.setDate(now.getDate() + 7);

      const randomStart = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
      const randomEnd = new Date(randomStart.getTime() + 2 * 24 * 60 * 60 * 1000);

      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };

      return `${randomStart.toLocaleDateString("en-US", options)} - ${randomEnd.toLocaleDateString(
        "en-US",
        options
      )}`;
    };

    setDeliveryDate(generateRandomDeliveryDate());
  }, []);

  if (!productById) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Ładowanie produktu...</p>
      </div>
    );
  }

  const images = [
    productById.imageUrl,
    productById.imageUrlFirst,
    productById.imageUrlSecond,
  ].filter(Boolean);

  const subtotal = (productById.price * quantity).toFixed(2);

  
  return (
    <div className="bg-white dark:bg-black min-h-screen gap-6 ">
      <Header />
      <Breadcrumb 
          items={[
            { label: "Product", href: "/product" },
            { label: productById.name },
          ]}
        />
      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-10 mb-10 text-black dark:text-[#FCFCFC]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full lg:flex-1">
            <div className="flex flex-col gap-6 items-center lg:items-start w-full lg:w-auto">
              <div className="relative w-full max-w-[320px] sm:max-w-[398px] md:max-w-[450px] aspect-[398/317] rounded-[6px] overflow-hidden">
                {activeImage && (
                  <Image
                    src={activeImage}
                    alt={productById.name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>

              <div className="flex flex-wrap xl:flex-nowrap gap-4 justify-center lg:justify-start overflow-x-auto">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveImage(img)}
                    className={`relative w-[130px] aspect-[130/99] border rounded-md overflow-hidden cursor-pointer transition ${
                      activeImage === img ? "border-orange-500" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt={productById.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full sm:max-w-[427px]">
              <h1 className="text-[24px] sm:text-[28px] font-semibold">{productById.name}</h1>

              <p className="bg-[#E5610A] text-center text-black dark:text-[#FDEDD7] px-3 py-1 rounded-[6px] w-[120px]">
                {productById.category?.name}
              </p>

              <p className="text-[28px] sm:text-[32px] font-semibold">${productById.price}</p>

              <div>
                <p className="text-[16px]">
                  {isDescriptionExpanded
                    ? productById.description
                    : `${productById.description.slice(0, 150)}${
                        productById.description.length > 150 ? "..." : ""
                      }`}
                </p>

                {productById.description.length > 150 && (
                  <span
                    className="text-[#F29145] font-medium cursor-pointer"
                    onClick={() => setIsDescriptionExpanded(prev => !prev)}
                  >
                    {isDescriptionExpanded ? "View Less" : "View More"}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <p className="text-[18px] dark:text-[#B0B0B0]">Shipping Available</p>

                <div className="flex gap-2 border border-black dark:border-[#B0B0B0] rounded-[6px] p-4 max-w-[312px]">
                  <ShieldIcon />
                  <div>
                    <p>NexusHub Courier</p>
                    <p className="dark:text-[#E7E7E7]">Estimated arrival {deliveryDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[423px] mt-6 lg:mt-0 flex-shrink-0">
            <div className="p-4 sm:p-6 rounded-[6px] border border-black dark:border-[#383B42] bg-gray-200 dark:bg-[#262626] flex flex-col gap-6">
              <div>
                <h1 className="text-[18px] font-semibold text-black dark:text-[#B0B0B0]">Colors</h1>
                <div className="flex gap-4 mt-2">
                  <label className="relative w-[54px] h-[54px]">
                    <input
                      type="checkbox"
                      checked={selectedColor === "white"}
                      onChange={() => setSelectedColor("white")}
                      className="appearance-none w-[54px] h-[54px] bg-white border rounded-[6px]"
                    />
                    {selectedColor === "white" && (
                      <span className="absolute inset-0 flex items-center justify-center text-black text-[24px] font-bold">
                        ✓
                      </span>
                    )}
                  </label>

                  <label className="relative w-[54px] h-[54px]">
                    <input
                      type="checkbox"
                      checked={selectedColor === "black"}
                      onChange={() => setSelectedColor("black")}
                      className="appearance-none w-[54px] h-[54px] bg-black rounded-[6px]"
                    />
                    {selectedColor === "black" && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-[24px] font-bold">
                        ✓
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-[18px] font-semibold text-black dark:text-[#B0B0B0]">Quantity</h1>
                <div className="flex gap-4 flex-wrap items-center">
                  <div className="flex items-center border rounded">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1">
                      −
                    </button>
                    <span className="px-4 text-[16px]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(productById.stock, q + 1))}
                      className="px-3 py-1"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-[16px] font-semibold">Stock: {productById.stock}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-[18px] font-semibold text-black dark:text-[#B0B0B0]">Subtotal:</p>
                <span className="text-[28px] sm:text-[32px] font-semibold">${subtotal}</span>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    enqueueSnackbar("You must be logged in", { variant: "error" });
                    return;
                  }

                  addToCart({ ...productById, quantity });

                  enqueueSnackbar("Product Successfully Added", {
                    variant: "success",
                    style: { width: "95vw", textAlign: "center" },
                  });
                }}
                className="py-2 sm:py-3 w-full flex items-center justify-center border text-[#F29145] border-[#f29145] gap-3 sm:gap-4"
              >
                <span>Add to basket</span>
                <OrangeBasketIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
