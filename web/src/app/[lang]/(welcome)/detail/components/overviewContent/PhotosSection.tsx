import SeeMore from '@/components/SeeMore/SeeMore'
import React from 'react'
import { IoIosHeartEmpty } from 'react-icons/io'

const PhotosSection = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    return (
        <div>
            <p className='text-[15px] md:text-[18px] font-bold'>Photos</p>
            <div className='grid grid-cols-3 md:grid-cols-5 gap-[3px] mt-2'>
                {
                    numbers.map((num, index) => (
                        <div key={index} className='relative'>
                            <img className='w-full' src={`${num % 2 == 0 ? "/images/detail/spot1.png" : "/images/detail/spot2.png"}`} alt="Image" />
                            <div className="absolute left-[5px] bottom-[3px] flex gap-x-1 items-center justify-center bg-black bg-opacity-30 p-1">
                                <IoIosHeartEmpty className="size-[14px] md:size-[18px] text-white" />
                                <p className="text-[7px] md:text-[10px] text-white">123K</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='mt-[2px]'>
                <SeeMore />
            </div>
        </div>
    )
}

export default PhotosSection