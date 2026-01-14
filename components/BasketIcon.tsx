import Image from "next/image";
import Basket from "../icons/basket.svg";

export default function BasketIcon() {
  return (
    <Image
      src={Basket}
      alt="basket"
      width={24}
      height={24}
    />
  );
}

