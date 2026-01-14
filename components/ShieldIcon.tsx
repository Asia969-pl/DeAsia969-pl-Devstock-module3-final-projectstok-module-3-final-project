import Image from "next/image";
import shield from "../icons/shield.svg";
export default function ShieldIcon() {
  return (
    <Image
      src={shield}
      alt="shieldIcon"
      width={24}
      height={24}
    />
  );
}

