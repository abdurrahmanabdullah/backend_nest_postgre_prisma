"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { IoIosHeartEmpty } from "react-icons/io";

const DetailSlider = () => {
  const slides = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Example slide array

  return (
    <div className="relative">
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="mySwiper border mt-1"
        slidesPerView={2}
      >
        {slides.map((i) => (
          <SwiperSlide key={i} className="relative">
            {i <= 10 ? (
              <img
                src={
                  i % 2 === 0
                    ? "/images/detailImage2.png"
                    : "/images/detailImage1.png"
                }
                alt={`image${i}`}
                className="w-full h-[244px] object-cover"
              />
            ) : null}
            <div className="absolute left-2 bottom-7 flex gap-x-1 items-center justify-center bg-black bg-opacity-30 p-1">
              <IoIosHeartEmpty className="size-[14px] md:size-[18px]" />
              <p className="text-[7px] md:text-[10px]">123,456</p>
            </div>

            {/* Button for the 10th slide */}
            {i === 10 && (
              <div className="absolute bottom-4 right-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-lg">
                  See More
                </button>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DetailSlider;
