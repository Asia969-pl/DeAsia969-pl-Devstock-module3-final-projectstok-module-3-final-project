import Image from "next/image";
import trash from "../icons/trash.svg"

type TrashIconProps = {
  onClick: () => void;
};

export default function TrashIcon({ onClick }: TrashIconProps) {
  return (
    <Image onClick={onClick}
      src={trash}
      alt="trash"
      width={30}
      height={30}
      className="absolute top-4 right-4"
    />
  );
}

