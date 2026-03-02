"use client";

import Sort from "@/resources/images/svg/Sort";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiHeart } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";

const PhotosContent = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const images = [
    { src: "/images/detailImage1.png", likes: "1234K" },
    { src: "/images/detailImage1.png", likes: "1234K" },
    { src: "/images/detailImage2.png", likes: "1234K" },
    { src: "/images/detailImage2.png", likes: "1234K" },
    { src: "/images/detailImage1.png", likes: "1234K" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const ImageCard = ({
    src,
    likes,
    height = "h-[250px]",
    index,
  }: {
    src: string;
    likes: string;
    height?: string;
    index: number;
  }) => {
    const handleClick = () => {
      router.push(`/detail/photos/${index}`);
    };

    return (
      <div
        className={`relative w-full ${height} cursor-pointer`}
        onClick={handleClick}
      >
        <img
          src={src}
          alt="img"
          className="w-full h-full object-cover rounded"
        />
        <div className="absolute bottom-2 right-2 flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded-full space-x-1">
          <CiHeart className="w-5 h-5" />
          <span className="text-xs">{likes}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Sort Button and Dropdown */}

      <div className="relative flex justify-end" onClick={toggleDropdown}>
        <span className="flex items-center bg-[#E9E9E9] w-[123px] justify-center gap-2 rounded-full h-[25px] mb-1">
          <Sort />
          <p className="text-[13px] font-light">Like</p>
          <IoMdArrowDropdown
            className={`transform transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </span>

        {/* Dropdown options */}
        {dropdownOpen && (
          <div className="absolute top-full right-0 bg-white rounded-[12px] shadow-lg mt-2 z-10 w-[120px]">
            <ul className="space-y-2 p-4">
              <li className="cursor-pointer hover:bg-gray-200 p-2 rounded text-sm font-medium">
                Max
              </li>
              <li className="cursor-pointer hover:bg-gray-200 p-2 rounded text-sm font-medium">
                Min
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Image Rows */}
      <div className="flex gap-1">
        <ImageCard
          src={images[0].src}
          likes={images[0].likes}
          index={0}
          height="h-[247px]"
        />
        <ImageCard
          src={images[1].src}
          likes={images[1].likes}
          index={1}
          height="h-[247px]"
        />
      </div>

      <div className="flex">
        {/* Left side - two stacked images */}
        <div className="flex flex-col gap-1 w-full">
          <ImageCard
            src={images[2].src}
            likes={images[2].likes}
            height="h-[130px]"
            index={2}
          />
          <ImageCard
            src={images[3].src}
            likes={images[3].likes}
            height="h-[130px]"
            index={3}
          />
        </div>
        {/* Right side - single image */}
        <div className="pl-1 w-full">
          <ImageCard
            src={images[4].src}
            likes={images[4].likes}
            height="h-[265px]"
            index={4}
          />
        </div>
      </div>

      <div className="flex gap-1">
        <ImageCard
          src={images[0].src}
          likes={images[0].likes}
          height="h-[150px]"
          index={0}
        />
        <ImageCard
          src={images[1].src}
          likes={images[1].likes}
          height="h-[150px]"
          index={1}
        />
      </div>
    </div>
  );
};

export default PhotosContent;
