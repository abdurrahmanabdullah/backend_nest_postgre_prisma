"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const ImageDetailsSlider = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1); // State for current slide number

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const slides = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="">
      {/* Swiper Image Slider */}
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="w-full h-full"
        slidesPerView={1}
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex + 1)} // Update the current slide
      >
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
            {i === 10 && (
              <div className="absolute bottom-4 right-2 z-10">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-lg pointer-events-auto">
                  See More
                </button>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide Indicator */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-center p-4 z-10">
        <span
          className="text-white text-[16px]"
          style={{ fontFamily: "Seed JP_OTFSiz" }}
        >
          {currentSlide} / {slides.length}
        </span>
      </div>
    </div>
  );
};

export default ImageDetailsSlider;
