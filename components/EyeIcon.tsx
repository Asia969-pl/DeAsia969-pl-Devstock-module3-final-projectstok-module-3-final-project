import Image from "next/image";
import Eye from "../icons/eyeIcon.svg";

export default function EyeIcon() {
  return (
    <Image
      src={Eye}
      alt="Eye icon"
      width={20}
      height={18}
    />
  );
}

