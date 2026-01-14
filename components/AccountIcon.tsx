"use client";
import Image from "next/image";
import { useUser } from "../components/context/UserContext";
import React from "react";

interface AccountIconProps {
  onclick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function AccountIcon({ onclick }: AccountIconProps) {
  const { user } = useUser();

  if (!user?.picture) return null;

  return (
    <div
      onClick={onclick}
      className="
        w-10 h-10
        rounded-full
        overflow-hidden
        relative
        cursor-pointer
      "
    >
      <Image
        src={user.picture}
        alt="User avatar"
        fill
        className="object-cover"
        sizes="40px"
      />
    </div>
  );
}
