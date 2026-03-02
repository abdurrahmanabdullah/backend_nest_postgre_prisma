///--------------
"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { IoIosSearch } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";

const HomeBannerSlider = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const recommended = [
    "Niigata recommend",
    "Niigata best 10",
    "Niigata winter",
    "Niigata with child",
  ];

  const searchRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null); // Ref for the entire search bar area

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false); // Keeps the search bar closed only if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const slides = [1, 2, 3, 4, 5];

  const handleRecommendedClick = (item: string) => {
    setSearchQuery(item);
  };

  return (
    <div className="relative h-[487px]">
      {/* Swiper Image Slider */}
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="w-full h-full"
        slidesPerView={1}>
        {slides.map((i) => (
          <SwiperSlide key={i}>
            <img
              src={
                i % 2 === 0
                  ? "/images/home-image.jpeg"
                  : "/images/detailImage1.png"
              }
              alt={`image${i}`}
              className="w-full h-[487px] object-cover"
            />
            {i === 5 && (
              <div className="absolute bottom-4 right-2 z-10">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-lg pointer-events-auto">
                  See More
                </button>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Fixed Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-30 px-4 py-6 transition-colors duration-300 pointer-events-none ${
          isScrolled && !showSearch ? "bg-white" : "bg-transparent"
        }`}>
        <div className="w-full flex justify-between items-start pointer-events-auto">
          {!showSearch ? (
            <>
              <h1
                className={`w-[78px] h-[22px] text-[18px] font-normal leading-[100%] tracking-[0] text-center transition-colors duration-300 mt-2 ${
                  isScrolled ? "text-black" : "text-white"
                }`}>
                JP Travel
              </h1>

              <div className="flex flex-col items-end">
                <div
                  className={`flex space-x-4 transition-colors duration-300 ${
                    isScrolled ? "text-black" : "text-white"
                  }`}>
                  <button onClick={() => setShowSearch(true)}>
                    <IoIosSearch className="w-8 h-8" />
                  </button>
                  <button>
                    <IoPersonOutline className="w-8 h-8" />
                  </button>
                </div>

                <span
                  className={`text-[11px] mt-2 whitespace-nowrap transition-colors duration-300 ${
                    isScrolled ? "text-black" : "text-white"
                  }`}>
                  TAGAMI Bam boo boo
                </span>
              </div>
            </>
          ) : (
            // Search Bar + Recommended List
            <div className="w-full flex justify-center  sm:px-6 lg:px-8">
              <div
                ref={searchRef}
                className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                {/* Search Bar */}
                <div
                  ref={searchBarRef}
                  className="relative mt-[60px] h-[48px] w-[303px] bg-[#F5F5F5] border border-[#ACABAB] shadow rounded-[8px] px-4 py-2 flex items-center">
                  <input
                    type="text"
                    className="flex-grow bg-transparent outline-none text-[#ACABAB] placeholder:text-[#ACABAB] placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:font-[400] placeholder:text-left px-6 font-[LINE Seed JP_OTF]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Recommended Dropdown */}

                <div className="relative -mt-1 h-[224px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white border border-gray-200 rounded-[4px] shadow-lg">
                  <ul className="py-4 overflow-y-auto max-h-[300px]">
                    {recommended.map((item, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 text-sm text-[#ACABAB] hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRecommendedClick(item)}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Positioned Search Bar (Always Visible) */}
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-2 z-10 pointer-events-none">
        <div className="w-full flex justify-center mb-16">
          <div className="flex items-center bg-white border border-gray-200 rounded-full shadow px-2 py-2 w-full max-w-md pointer-events-auto">
            <IoIosSearch className="text-gray-500 w-5 h-8 " />{" "}
            {/* Reduced icon size and added margin-right */}
            <input
              type="text"
              placeholder="Where should we go ?"
              className="flex-grow bg-transparent outline-none text-gray-800 placeholder:text-[#ACABAB] placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:font-[400]   px-4 font-[LINE Seed JP_OTF]"
              // Allow manual changes to the search query
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBannerSlider;
