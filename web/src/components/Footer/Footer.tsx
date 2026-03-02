import Link from "next/link";
import React from "react";

export const menu = [
  {
    id: 1,
    title: "Help",
    url: "/help",
  },
  {
    id: 2,
    title: "Terms",
    url: "/terms",
  },
  {
    id: 3,
    title: "Contact Us",
    url: "/contact-us",
  },
  {
    id: 4,
    title: "Privacy policy",
    url: "/privacy-policy",
  },
];

const Footer = () => {
  const date: Date = new Date();

  return (
    <div className="text-black p-[8.5px] md:p-[10px] border-t border-[#D9D9D9] mt-[12.5px]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-2">
        <div>
          <Link
            href="/"
            className="text-[18px] font-extrabold text-[#D9D9D9] capitalize"
          >
            JP Travel
          </Link>
        </div>
        <ul className="flex items-center gap-x-[23px]">
          {menu.map((item, index) => (
            <li
              key={item.id}
              className="text-[#ACABAB] text-[12px] md:text-[14px]"
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-[6px]">
        <p className="text-[10px] md:text-[12px] text-center md:text-start text-[#ACABAB]">
          &copy; {date.getFullYear()} KT Works. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
