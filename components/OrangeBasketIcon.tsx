import Image from "next/image";
import Basket from "../icons/orangeBasket.svg";

export default function OrangeBasketIcon() {
  return (
    <Image
      src={Basket}
      alt="orangeBasket"
      width={24}
      height={24}
    />
  );
}

