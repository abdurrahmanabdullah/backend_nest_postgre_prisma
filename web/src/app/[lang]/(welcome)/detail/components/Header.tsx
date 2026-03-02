import Link from "next/link";
import React from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { MdIosShare } from "react-icons/md";

interface HeaderProps {
  onShareClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShareClick }) => {
  return (
    <header className="flex justify-between items-center p-3">
      <Link href="/">
        <IoChevronBackSharp className="size-6 text-black" />
      </Link>
      <div className="flex items-center gap-x-3">
        <div>
          <MdOutlineBookmarkAdd className="size-6 text-black" />
        </div>
        <div onClick={onShareClick} className="cursor-pointer">
          <MdIosShare className="size-6 text-black" />
        </div>
      </div>
    </header>
  );
};

export default Header;
