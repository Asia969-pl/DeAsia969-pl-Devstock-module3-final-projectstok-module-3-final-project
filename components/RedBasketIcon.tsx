import Image from "next/image";
import redBasket from "../icons/redBasket.svg";

export default function RedBasketIcon() {
  return (
    <Image
      src={redBasket}
      alt="redBasket"
      width={30}
      height={30}
    />
  );
}
