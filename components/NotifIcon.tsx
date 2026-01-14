import Image from "next/image";
import notif from "../icons/notif.svg";

export default function NotifIcon() {
  return (
    <Image
      src={notif}
      alt="notif"
      width={18}
      height={18}
    />
  );
}

