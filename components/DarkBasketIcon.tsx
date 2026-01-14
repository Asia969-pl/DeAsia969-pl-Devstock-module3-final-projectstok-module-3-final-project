import Image from "next/image";
import darkBasket from "../icons/DarkBasket.svg"
export default function DarkBasketIcon() {
  return (
    <Image
      src={darkBasket}
      alt="darkBasket"
      width={32}
      height={32}
    />
  );
}

