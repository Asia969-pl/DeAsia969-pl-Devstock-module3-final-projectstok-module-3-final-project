import Image from "next/image";
import checkCircle from "../icons/checkCircle.svg";
export default function CheckCircle() {
  return (
    <Image
      src={checkCircle}
      alt="checkCircle"
      width={75}
      height={75}
    />
  );
}

