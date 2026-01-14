import Image from "next/image";
import orangeArrow from "../icons/rightOrangeArrow.svg";

export default function RightOrangeArrowIcon() {
  return (
    <Image
      src={orangeArrow}
      alt="basket"
      width={16}
      height={12}
    />
  );
}

