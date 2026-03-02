"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaRegStar } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5"; // For the close button
import { FaCheckCircle } from "react-icons/fa"; // For the verification checkmark
import Sentiment from "@/resources/Sentiment";
import { MdReport } from "react-icons/md";

import ImageDetailsSlider from "@/app/[lang]/(welcome)/component/ImageDetailsSlide";

const PhotoDetailsContent = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-[400px] bg-black text-white">
      {/* Back Button */}
      <button
        onClick={() => {
          console.log("Navigating back");
          router.back();
        }}
        className="text-white text-xl absolute top-2 right-4 z-30 flex items-center justify-center p-2 bg-transparent"
      >
        <IoClose size={24} />
      </button>

      {/* Image Section */}
      <div className="w-full bg-gray-300 mt-20">
        <ImageDetailsSlider />
      </div>

      {/* Scrollable Content Section */}
      <div className="p-4 bg-black mt-40 overflow-y-auto max-h-[300px]">
        {/* User Info Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
            {/* User Name and Date */}
            <div>
              <div className="flex items-center space-x-1">
                <p className="text-white text-sm font-medium">User Name</p>
              </div>
              <div className="flex items-center space-x-1">
                <p className="text-gray-400 text-xs">
                  Date of visit: 08/20/2024
                </p>
                <Sentiment />
              </div>
            </div>
          </div>
          {/* More Button */}
          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0} role="button">
              <BsThreeDotsVertical />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-md"
            >
              <li>
                <a className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md px-2 py-1 transition-colors">
                  <MdReport size={18} />
                  Report this Comment
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Description */}
        <p
          className="text-white text-[14px] mb-2"
          style={{ fontFamily: "Seed JP_OTF" }}
        >
          Your experience story will be placed here.
        </p>
        {/* URL/Placeholder Text */}
        <p
          className="text-gray-400 text-[14px] truncate whitespace-nowrap"
          style={{ fontFamily: "Seed JP_OTF" }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        {/* More content to make it scrollable */}
        <p
          className="text-gray-400 text-[14px] mt-4"
          style={{ fontFamily: "Seed JP_OTF" }}
        >
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  );
};

export default PhotoDetailsContent;
