import React from 'react'
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import review1 from "/images/detail/review1.png"
import review2 from "/images/detail/review2.png"
import { IoIosHeartEmpty } from 'react-icons/io';
import ReviewerInfo from "@/app/[lang]/(welcome)/detail/components/overviewContent/ReviewerInfo";

interface ReviewImages {
  id: number,
  src: string,
  like: string
};

const images = [
  {
    id: 1,
    src: `/images/detail/review1.png`,
    like: "123,456"
  },
  {
    id: 2,
    src: `/images/detail/review2.png`,
    like: "123,456"
  },
  {
    id: 3,
    src: `/images/detail/review1.png`,
    like: "123,456"
  },
]

const Reviews = () => {
  return (
    <div className='mt-[27px]'>
      <p className='text-[15px] font-bold'>Reviews</p>
      <div className='flex justify-start items-center gap-x-1'>
        <p><BiLike className='size-5 text-gray-500 font-semibold' /> </p>
        <p className='text-[#7887FF] text-[19px] font-bold'>123K</p>
      </div>
      <div className='flex justify-start items-center gap-x-1 mt-[3px]'>
        <p><BiDislike className='size-[15px] text-gray-500 font-semibold scale-x-[-1]' /> </p>
        <p className='text-[#FF8888] text-[14px]'>123K</p>
      </div>
      <div className="mt-6">
        <div className="flex gap-x-[3px] items-center justify-start overflow-hidden overflow-x-auto" style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}>
          {images.map((item, index) => (
            <div key={index} className="relative w-[156px] h-[104px] flex-shrink-0">
              <img
                className="w-full h-full object-cover rounded-[8px]"
                src={item.src}
                alt={`${item.src + index}`}
              />
              <div className="absolute left-[5px] bottom-[3px] flex gap-x-1 items-center justify-center bg-black bg-opacity-30 p-1">
                <IoIosHeartEmpty className="size-[14px] md:size-[18px] text-white" />
                <p className="text-[7px] md:text-[10px] text-white">123,456</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ReviewerInfo />
    </div>
  )
}

export default Reviews;