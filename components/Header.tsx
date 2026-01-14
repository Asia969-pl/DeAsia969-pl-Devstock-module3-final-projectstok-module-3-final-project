"use client";

import Link from "next/link";
import Divider from "./Divider";
import DevstockLogo from "./DevstokLogo";
import NexusLogo from "./NexusLogo";
import { useUser } from "../components/context/UserContext";
import AccountIcon from "./AccountIcon";
import BasketIcon from "./BasketIcon";
import { usePathname } from "next/navigation";

function HeaderButton() {
  return (
    <Link href="/login">
      <button className="bg-orange-500 text-black rounded-[6px] font-semibold hover:bg-orange-600 transition-colors w-[121px] h-[54px] px-[20px] py-[14px] text-[16px]">
        Sign In
      </button>
    </Link>
  );
}

function IconContainer({ userId }: { userId: number }) {
  return (
    <div className="flex gap-7">
      <Link href={`/card/${userId}`}>
        <BasketIcon />
      </Link>
      <Link href="/users">
        <AccountIcon />
      </Link>
    </div>
  );
}

function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

    return `
      transition-colors
      ${isActive ? "text-[#F29145]" : "text-black dark:text-[#B0B0B0] hover:text-[#F29145]"}
    `;
  };

  return (
    <nav className="flex gap-6 text-[16px] font-medium">
      <Link href="/" className={linkClass("/")}>Home</Link>
      <Link href="/product" className={linkClass("/product")}>Products</Link>
      <span>Contact</span>
    </nav>
  );
}

export default function Header() {
  const { user } = useUser();

  return (
    <header className="w-full bg-gray-200 dark:bg-black">
      <div className="max-w-[1820px] mx-auto px-10 py-6 flex flex-col gap-6">

        {/* TOP */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
          {user ? <DevstockLogo /> : <NexusLogo />}
          {user ? <IconContainer userId={user.id} /> : <HeaderButton />}
        </div>

        {/* NAV */}
        {user && <Navbar />}

        <Divider />
      </div>
    </header>
  );
}
