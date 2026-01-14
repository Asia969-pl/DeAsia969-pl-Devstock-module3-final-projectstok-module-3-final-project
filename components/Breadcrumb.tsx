"use client";

import React from "react";
import { useRouter } from "next/navigation";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator = ">" }) => {
  const router = useRouter();

  return (
    <nav className="w-full flex justify-center">
      <div className="flex flex-wrap gap-2 pb-4 pl-10 pr-4 sm:pr-6 md:pr-10 lg:pr-20  text-[16px] w-full max-w-[1820px]">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.href ? (
              <span
                className="cursor-pointer hover:underline text-black dark:text-[#B0B0B0] transition"
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </span>
            ) : (
              <span className="font-medium text-black dark:text-white">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="text-black dark:text-[#B0B0B0]">{separator}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
