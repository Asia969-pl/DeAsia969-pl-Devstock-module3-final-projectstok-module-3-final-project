import Image from "next/image";
const paymentLogos = [
  {
    name: "Visa",
    src: "https://i.ibb.co/kgXKjyXJ/Badge.png",
  },
  {
    name: "Mastercard",
    src: "https://i.ibb.co/DfXGMLrV/Mastercard.png",
  },
  {
    name: "PayPal",
    src: "https://i.ibb.co/cSQfbJFN/Paypal.png",
  },
  {
    name: "GooglePay",
    src: "https://i.ibb.co/hRTYV5Ww/G-Pay.png",
  },
  {
    name: "ApplePay",
    src: "https://i.ibb.co/DDcgLkFh/Pay.png",
  },
];
export default function PaymentLogoContainer() {
    return (
      <div className="flex gap-2">
        {paymentLogos.map((logo) => (
          <div
            key={logo.name}
            className="
              relative
              w-[46.61px]
              h-[30.03px]
              bg-white
              rounded-md
              overflow-hidden
              p-2
            "
          >
            <Image 
              src={logo.src}
              alt={logo.name}
              fill
            className="object-none"
            />
          </div>
        ))}
      </div>
    );
  }
  